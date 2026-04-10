const React = window.React;

const { registerPlugin } = wp.plugins;
const { useDispatch } = wp.data;
const { useState, useEffect, useCallback, Fragment } = wp.element;
const { store: noticesStore } = wp.notices;
const { __ } = wp.i18n;
const { createBlock, serialize } = wp.blocks;
const { Button, PanelBody } = wp.components;
const { PluginSidebar } = wp.editPost;

const ALLOWED_BLOCKS = [
    "core/heading",
    "core/paragraph",
    "core/list",
    "core/columns",
    "core/buttons",
    "core/image",
    "core/quote",
    "core/pullquote",
    "core/table",
];

function mapCells(cells, tag) {
    if (!Array.isArray(cells)) {
        return [];
    }

    return cells.map((cell) => ({
        tag,
        content: cell.content,
    }));
}

function formatTableSection(section, sectionName, cellTag, expectedColumns = 0) {
    if (sectionName === "head" || sectionName === "foot") {
        if (section && section.cells && Array.isArray(section.cells)) {
            const mapped = mapCells(section.cells, cellTag);

            if (sectionName === "foot") {
                while (mapped.length < expectedColumns) {
                    mapped.push({ tag: cellTag, content: "" });
                }

                if (mapped.every((cell) => !String(cell.content || "").trim())) {
                    return [];
                }
            }

            return [{ cells: mapped }];
        }
    } else if (sectionName === "body" && section && section.cells && Array.isArray(section.cells)) {
        return section.cells.map((row) => ({
            cells: mapCells(row, cellTag),
        }));
    }

    return [];
}

function normalizeTableBodies(blocks) {
    blocks.forEach((block) => {
        if (block.blockType === "core/table") {
            const tableHeadColumns = block.head?.cells?.length || 0;

            if (
                block.body &&
                block.body.cells &&
                Array.isArray(block.body.cells) &&
                !block.body.cells.every((item) => Array.isArray(item))
            ) {
                const groupedRows = [];

                for (let i = 0; i < block.body.cells.length; i += tableHeadColumns || 1) {
                    groupedRows.push(block.body.cells.slice(i, i + (tableHeadColumns || 1)));
                }

                block.body = { cells: groupedRows };
            }
        }

        if (block.blockType === "core/columns" && Array.isArray(block.columnContent)) {
            block.columnContent.forEach((columnBlocks) => normalizeTableBodies(columnBlocks));
        }
    });
}

function createListBlock(content, ordered) {
    let listItems;

    if (/<\/?[a-z][\s\S]*>/i.test(content)) {
        const parsed = new DOMParser().parseFromString(content, "text/html");
        listItems = Array.from(parsed.querySelectorAll("li")).map((li) => li.textContent);
    } else {
        listItems = content.includes("\n")
            ? content.split("\n")
            : content.includes(",")
            ? content.split(",")
            : [content];
    }

    listItems = listItems
        .map((item) => {
            let normalized = String(item || "").trim().replace(/^-\s*/, "");

            if (ordered) {
                normalized = normalized.replace(/^\d+\.\s*/, "");
            }

            return normalized;
        })
        .filter((item) => item !== "");

    const children = listItems.map((item) => createBlock("core/list-item", { content: item }));

    return createBlock("core/list", { ordered: !!ordered }, children);
}

function mapBlockDataToWpBlock(blockData) {
    if (!blockData || !blockData.blockType) {
        // eslint-disable-next-line no-console
        console.error("Invalid block data:", blockData);
        return null;
    }

    switch (blockData.blockType) {
        case "core/heading":
            return createBlock(blockData.blockType, {
                level: blockData.level || 2,
                content: blockData.content,
            });

        case "core/list":
            return createListBlock(blockData.content || "", blockData.ordered || false);

        case "core/buttons": {
            const buttonBlocks = (blockData.buttonsContent || []).map((button) =>
                createBlock("core/button", {
                    text: button.text,
                    url: button.url,
                })
            );

            return createBlock("core/buttons", {}, buttonBlocks);
        }

        case "core/image":
            return createBlock(blockData.blockType);

        case "core/quote": {
            const paragraph = createBlock("core/paragraph", {
                content: blockData.content,
            });

            return createBlock(
                blockData.blockType,
                {
                    citation: blockData.citation || "",
                },
                [paragraph]
            );
        }

        case "core/pullquote":
            return createBlock(blockData.blockType, {
                value: blockData.content,
                citation: blockData.citation || "",
            });

        case "core/columns":
            if (Array.isArray(blockData.columnContent)) {
                const columnBlocks = blockData.columnContent.map((columnItems) => {
                    const innerBlocks = columnItems.map((item) => mapBlockDataToWpBlock(item));
                    return createBlock("core/column", {}, innerBlocks);
                });

                return createBlock(blockData.blockType, {}, columnBlocks);
            }

            // eslint-disable-next-line no-console
            console.error("Invalid column content:", blockData.columnContent);
            return null;

        case "core/paragraph":
            return createBlock(blockData.blockType, {
                content: blockData.content,
            });

        case "core/table": {
            const expectedColumns = blockData.head?.cells?.length || 0;
            const tableAttrs = {
                head: formatTableSection(blockData.head, "head", "th"),
                body: formatTableSection(blockData.body, "body", "td"),
                foot: formatTableSection(blockData.foot, "foot", "td", expectedColumns),
                caption: blockData.caption || "",
            };

            return createBlock(blockData.blockType, tableAttrs);
        }

        default: {
            const error = new Error(
                __("Dit block type wordt momenteel niet ondersteund.", "madeit")
            );
            error.name = "notSupported";
            throw error;
        }
    }
}

function insertGeneratedBlocks(rawBlocks, insertBlocks) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(rawBlocks) || rawBlocks.length === 0) {
            reject(
                new Error(
                    "Invalid blocks data structure. Please try again or use a more advanced GPT-4 model."
                )
            );
            return;
        }

        const converted = rawBlocks
            .map((block) => mapBlockDataToWpBlock(block))
            .filter((block) => block !== null);

        if (converted.length === 0) {
            reject(new Error("Block type is not yet supported."));
            return;
        }

        insertBlocks(converted);
        resolve();
    });
}

function getFunctionsForModel(modelName) {
    const blockProps = {
        blockType: {
            type: "string",
            enum: ALLOWED_BLOCKS,
            description: "The type of supported blocks",
        },
        content: {
            type: "string",
            description: "The content of the block",
        },
        ordered: {
            type: "boolean",
            description: "Specifies if the list (core/list) is ordered (numbered) or unordered (bulleted)",
        },
        level: {
            type: "integer",
            description: "The heading level for a heading block (only for core/heading)",
            minimum: 1,
            maximum: 6,
        },
        citation: {
            type: "string",
            description: "The citation or source of the quote (only for core/quote and core/pullquote)",
        },
        buttonsContent: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    text: {
                        type: "string",
                        description: "The text of the button",
                    },
                    url: {
                        type: "string",
                        description: "The URL the button links to",
                    },
                },
                required: ["text", "url"],
            },
            description: "An array of objects, each representing a button within a buttons block",
        },
        numColumns: {
            type: "integer",
            description: "The number of columns (only for core/columns)",
            minimum: 1,
            maximum: 6,
        },
        columnContent: {
            type: "array",
            items: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        blockType: {
                            type: "string",
                            enum: ALLOWED_BLOCKS,
                            description: "The type of block to insert in the column",
                        },
                        content: {
                            type: "string",
                            description: "The content of the block",
                        },
                    },
                    required: ["blockType", "content"],
                },
            },
            description:
                "An array of arrays, each containing objects specifying the block type and content for each block in a column (only for core/columns)",
        },
    };

    if (modelName !== "m3") {
        blockProps.head = {
            type: "object",
            description:
                "An object representing the table header, containing a 'cells' array where each cell is a header cell object. Example: { cells: [{ content: 'Header 1' }, { content: 'Header 2' }] }",
            properties: {
                cells: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            content: {
                                type: "string",
                                description: "The content of the cell",
                            },
                        },
                    },
                },
            },
        };

        blockProps.body = {
            type: "object",
            description:
                "An object containing a 'cells' array for the table body, with cells grouped to match the header's cell count.",
            properties: {
                cells: {
                    type: "array",
                    description:
                        "An array of cell objects, with cells grouped to match the header's cell count. Example: If the header has 2 cells, group body cells in pairs. Example: { cells: [{ content: 'Row 1, Cell 1' }, { content: 'Row 1, Cell 2' }] }",
                    items: {
                        type: "object",
                        properties: {
                            content: {
                                type: "string",
                                description: "The content of the cell",
                            },
                        },
                    },
                },
            },
        };

        blockProps.foot = {
            type: "object",
            description:
                "An object containing a 'cells' array for the table footer, with cells grouped to match the header's cell count.",
            properties: {
                cells: {
                    type: "array",
                    description:
                        "An array of cell objects, with cells grouped to match the header's cell count. Example: If the header has 2 cells, group footer cells in pairs. Example: { cells: [{ content: 'Footer 1, Cell 1' }, { content: 'Footer 1, Cell 2' }] }",
                    items: {
                        type: "object",
                        properties: {
                            content: {
                                type: "string",
                                description: "The content of the cell",
                            },
                        },
                    },
                },
            },
        };

        blockProps.caption = {
            type: "string",
            description: "The caption for the table (only for core/table)",
        };
    }

    return [
        {
            type: "function",
            function: {
                name: "create_gutenberg_blocks",
                description:
                    "Create multiple Gutenberg blocks in the WordPress editor, including individual blocks and columns with nested blocks.",
                parameters: {
                    type: "object",
                    properties: {
                        blocks: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: blockProps,
                                required: ["blockType"],
                            },
                        },
                    },
                    required: ["blocks"],
                },
            },
        },
    ];
}

function SuccessIcon() {
    return React.createElement(
        "svg",
        {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        },
        React.createElement("polyline", { points: "20 6 9 17 4 12" })
    );
}

function WarningIcon() {
    return React.createElement(
        "svg",
        {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
        },
        React.createElement("path", {
            d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
        }),
        React.createElement("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
        React.createElement("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
    );
}

function SendIcon() {
    return React.createElement(
        "svg",
        {
            xmlns: "http://www.w3.org/2000/svg",
            height: "24px",
            viewBox: "0 -960 960 960",
            width: "24px",
        },
        React.createElement("path", { d: "M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" })
    );
}

function CancelIcon() {
    return React.createElement(
        "svg",
        {
            xmlns: "http://www.w3.org/2000/svg",
            height: "24px",
            viewBox: "0 -960 960 960",
            width: "24px",
        },
        React.createElement("path", { d: "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" })
    );
}

function renderMultilineText(text) {
    const parts = String(text || "").split("\n");
    return parts.map((line, idx) =>
        React.createElement(
            Fragment,
            { key: idx },
            line,
            idx < parts.length - 1 ? React.createElement("br") : null
        )
    );
}

function extractJsonFromText(text) {
    const raw = String(text || "").trim();

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (parseError) {
        const fencedMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        if (fencedMatch?.[1]) {
            try {
                return JSON.parse(fencedMatch[1]);
            } catch (innerParseError) {
                return null;
            }
        }

        return null;
    }
}

function extractMarkedError(source) {
    const text = String(source || "");
    const match = text.match(/\[FOUT\]([\s\S]*?)\[\/FOUT\]/i);
    return match?.[1] ? match[1] : "";
}

function stripHtml(source) {
    const text = String(source || "");
    const doc = new DOMParser().parseFromString(text, "text/html");
    return String(doc.body?.textContent || "")
        .replace(/\s+/g, " ")
        .trim();
}

function renderSourceWithHighlight(source) {
    const plain = stripHtml(source);
    const match = plain.match(/\[FOUT\]([\s\S]*?)\[\/FOUT\]/i);

    if (!match || !match[1]) {
        return plain;
    }

    const fullMatch = match[0];
    const incorrect = match[1];
    const startIndex = plain.indexOf(fullMatch);

    if (startIndex < 0) {
        return plain.replace(/\[FOUT\]|\[\/FOUT\]/gi, "");
    }

    const before = plain.slice(0, startIndex);
    const after = plain.slice(startIndex + fullMatch.length);

    return React.createElement(
        Fragment,
        null,
        before,
        React.createElement("strong", { className: "madeit-language-issue-highlight" }, incorrect),
        after
    );
}

function parseIssuePosition(positionText) {
    const raw = String(positionText || "");
    const blockIndexMatch = raw.match(/block\s+index\s+(\d+)/i);
    const clientIdMatch = raw.match(
        /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
    );

    if (!blockIndexMatch) {
        return {
            blockIndex: null,
            innerPath: [],
            range: null,
            hintedClientId: clientIdMatch?.[1] || null,
        };
    }

    const innerMatches = [...raw.matchAll(/innerBlocks\[(\d+)\]/g)].map((item) =>
        Number(item[1])
    );

    const rangeMatch = raw.match(/character\s+range\s+(\d+)\s*-\s*(\d+)/i);

    return {
        blockIndex: Number(blockIndexMatch[1]),
        innerPath: innerMatches,
        hintedClientId: clientIdMatch?.[1] || null,
        range: rangeMatch
            ? {
                  start: Number(rangeMatch[1]),
                  end: Number(rangeMatch[2]),
              }
            : null,
    };
}

function extractIssueClientId(issue) {
    const direct = String(issue?.clientId || "").trim();
    if (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(direct)
    ) {
        return direct;
    }

    const parsedPosition = parseIssuePosition(issue?.positie);
    return parsedPosition?.hintedClientId || null;
}

function getBlockFromPosition(blocks, position) {
    if (
        !position ||
        !Array.isArray(blocks) ||
        !Number.isInteger(position.blockIndex) ||
        position.blockIndex >= blocks.length
    ) {
        return null;
    }

    let target = blocks[position.blockIndex];

    for (let i = 0; i < position.innerPath.length; i += 1) {
        const innerIndex = position.innerPath[i];

        if (!target?.innerBlocks || innerIndex >= target.innerBlocks.length) {
            return null;
        }

        target = target.innerBlocks[innerIndex];
    }

    return target || null;
}

function applyIssueToContent(content, issue) {
    const original = String(content || "");
    const incorrectText = extractMarkedError(issue?.source);
    const replacementText = String(issue?.fix || "").trim();
    const sourcePlain = stripHtml(String(issue?.source || ""))
        .replace(/\[FOUT\]|\[\/FOUT\]/gi, "")
        .trim();

    const isLikelySentenceFix = /\s/.test(replacementText);

    // For sentence-level fixes, only replace the full source sentence.
    if (isLikelySentenceFix) {
        if (sourcePlain && original.includes(sourcePlain)) {
            return original.replace(sourcePlain, replacementText);
        }

        return original;
    }

    // Prefer exact marked-fault replacement when available.
    if (incorrectText && original.includes(incorrectText)) {
        return original.replace(incorrectText, replacementText);
    }

    const parsedPosition = parseIssuePosition(issue?.positie);
    if (parsedPosition?.range && incorrectText) {
        const { start, end } = parsedPosition.range;
        if (Number.isInteger(start) && Number.isInteger(end) && end > start && start >= 0) {
            const rangeText = original.slice(start, end);
            if (!rangeText || !rangeText.includes(incorrectText)) {
                return original;
            }

            return original.slice(0, start) + replacementText + original.slice(end);
        }
    }

    return original;
}

function extractInnerHtmlFromMarkup(markup) {
    const raw = String(markup || "");
    if (!raw) {
        return "";
    }

    const parsed = new DOMParser().parseFromString(raw, "text/html");
    const firstElement = parsed.body?.firstElementChild;

    if (firstElement) {
        return String(firstElement.innerHTML || "").trim();
    }

    return stripHtml(raw);
}

function findFirstBlockWithContent(blocks, needle) {
    if (!Array.isArray(blocks) || !needle) {
        return null;
    }

    for (let i = 0; i < blocks.length; i += 1) {
        const block = blocks[i];
        const attributeValues = Object.values(block?.attributes || {}).filter(
            (value) => typeof value === "string"
        );

        if (attributeValues.some((value) => String(value).includes(needle))) {
            return block;
        }

        const nested = findFirstBlockWithContent(block?.innerBlocks || [], needle);
        if (nested) {
            return nested;
        }
    }

    return null;
}

function findBestAttributeUpdate(block, issue) {
    if (!block?.attributes) {
        return null;
    }

    const priorityKeys = ["content", "title", "text", "caption", "value", "values"];
    const allStringKeys = Object.keys(block.attributes).filter(
        (key) => typeof block.attributes[key] === "string"
    );

    const orderedKeys = [
        ...priorityKeys.filter((key) => allStringKeys.includes(key)),
        ...allStringKeys.filter((key) => !priorityKeys.includes(key)),
    ];

    for (let i = 0; i < orderedKeys.length; i += 1) {
        const key = orderedKeys[i];
        const currentValue = String(block.attributes[key] || "");
        const updatedValue = applyIssueToContent(currentValue, issue);

        if (currentValue !== updatedValue) {
            return {
                key,
                currentValue,
                updatedValue,
            };
        }
    }

    // Fallback for cases where editor text only exists in originalContent.
    if (typeof block.originalContent === "string" && block.originalContent.trim() !== "") {
        const updatedMarkup = applyIssueToContent(block.originalContent, issue);

        if (updatedMarkup !== block.originalContent) {
            return {
                key: "content",
                currentValue: block.originalContent,
                updatedValue: extractInnerHtmlFromMarkup(updatedMarkup),
                sourceType: "originalContent",
            };
        }
    }

    return null;
}

function buildLanguageCheckSnapshot(blocks) {
    if (!Array.isArray(blocks)) {
        return [];
    }

    return blocks.map((block) => ({
        clientId: block.clientId,
        blockName: block.name,
        attributes: block.attributes || {},
        // Use fresh serialized HTML so language check does not rely on stale originalContent.
        serializedHtml: serialize([block]),
        innerBlocks: buildLanguageCheckSnapshot(block.innerBlocks || []),
    }));
}

const SIDEBAR_MODULES = {
    languageCheck: {
        key: "languageCheck",
        label: __("Taalcheck", "madeit"),
        description: __(
            "Plak tekst en ontvang AI-voorstellen voor spelling, grammatica en leesbaarheid.",
            "madeit"
        ),
    },
    chat: {
        key: "chat",
        label: __("Chat", "madeit"),
        description: __("Vraag AI om contentblokken te genereren voor je pagina.", "madeit"),
    },
};

function ModuleSelector({ selectedModule, onSelect }) {
    const modules = Object.values(SIDEBAR_MODULES);

    return React.createElement(
        "div",
        { className: "madeit-module-selector" },
        modules.map((moduleItem) =>
            React.createElement(
                "button",
                {
                    key: moduleItem.key,
                    type: "button",
                    className:
                        "madeit-module-button" +
                        (selectedModule === moduleItem.key ? " madeit-module-button-active" : ""),
                    onClick: () => onSelect(moduleItem.key),
                },
                React.createElement("span", { className: "madeit-module-title" }, moduleItem.label),
                React.createElement(
                    "span",
                    { className: "madeit-module-description" },
                    moduleItem.description
                )
            )
        )
    );
}

function ChatModule({ uiChat, message, setMessage, isLoading, hasScrolled, handleSendMessage }) {
    const endRef = useCallback(
        (element) => {
            if (element !== null) {
                element.scrollIntoView({ behavior: hasScrolled ? "smooth" : "auto" });
            }
        },
        [uiChat, hasScrolled]
    );

    const chatClassName = uiChat.length === 0
        ? "madeit-chat-container madeit-chat-empty"
        : "madeit-chat-container";

    return React.createElement(
        Fragment,
        null,
        React.createElement(
            "div",
            { className: chatClassName },
            uiChat.length === 0
                ? React.createElement(
                        Fragment,
                        null,
                        React.createElement(
                            "div",
                            { className: "madeit-chat-placeholder" },
                            React.createElement(
                                "p",
                                null,
                                "No messages yet. Use the message box to request content blocks."
                            )
                        )
                    )
                : uiChat.map((entry, index) => {
                        const statusClass = entry.blockAdded
                            ? "madeit-status madeit-status-success"
                            : entry.blockAddedWarning
                            ? "madeit-status madeit-status-warning"
                            : "";

                        return React.createElement(
                            "div",
                            {
                                key: index,
                                className:
                                    "madeit-chat-message " +
                                    (entry.role === "assistant"
                                        ? "madeit-chat-assistant"
                                        : "madeit-chat-user"),
                            },
                            React.createElement(
                                "div",
                                { className: `madeit-message-box ${statusClass}` },
                                entry.role !== "assistant" ||
                                entry.blockAdded ||
                                entry.blockAddedWarning
                                    ? entry.role === "user" &&
                                      !entry.blockAdded &&
                                      React.createElement(Fragment, null)
                                    : React.createElement(
                                          "div",
                                          { className: "madeit-label-assistant madeit-label" },
                                          React.createElement(
                                              "span",
                                              null,
                                              __("AI Editor", "madeit")
                                          )
                                      ),
                                React.createElement(
                                    "div",
                                    { className: "madeit-chat-text" },
                                    entry.blockAdded || entry.blockAddedWarning
                                        ? React.createElement(
                                              Fragment,
                                              null,
                                              React.createElement(
                                                  "div",
                                                  { className: "madeit-chat-svg" },
                                                  entry.blockAdded
                                                      ? React.createElement(SuccessIcon)
                                                      : React.createElement(WarningIcon)
                                              ),
                                              React.createElement("p", null, entry.content)
                                          )
                                        : renderMultilineText(entry.content)
                                )
                            )
                        );
                    }),
            isLoading &&
                React.createElement(
                    "div",
                    { className: "madeit-chat-message fade-in" },
                    React.createElement(
                        "div",
                        { className: "madeit-message-box" },
                        React.createElement(
                            "div",
                            { className: "madeit-chat-text" },
                            React.createElement(
                                "div",
                                { className: "loading-dots" },
                                React.createElement("span"),
                                React.createElement("span"),
                                React.createElement("span")
                            )
                        )
                    )
                ),
            React.createElement("div", { ref: endRef })
        ),
        React.createElement(
            "div",
            { className: "madeit-input-container" },
            React.createElement(
                "div",
                { className: "madeit-textarea-wrap" },
                React.createElement("textarea", {
                    className: "madeit-textarea",
                    value: message,
                    onChange: (event) => setMessage(event.target.value),
                    placeholder: __("Write a message...", "madeit"),
                    rows: 1,
                }),
                React.createElement(
                    "div",
                    { className: "madeit-button-group" },
                    React.createElement(
                        Button,
                        {
                            variant: "primary",
                            className: "madeit-send-button",
                            onClick: handleSendMessage,
                            isBusy: isLoading,
                            disabled: !isLoading && message.trim() === "",
                        },
                        isLoading
                            ? React.createElement(CancelIcon)
                            : React.createElement(SendIcon)
                    )
                )
            )
        )
    );
}

function LanguageCheckModule({
    blockCount,
    languageResult,
    languageIssues,
    acceptedIssues,
    isLoading,
    handleLanguageCheck,
    handleAcceptIssue,
    handleFocusIssue,
}) {
    return React.createElement(
        Fragment,
        null,
        React.createElement(
            "div",
            { className: "madeit-language-check" },
            React.createElement(
                "p",
                { className: "madeit-language-intro" },
                __(
                    "De volledige block-source wordt automatisch ingeladen. Klik op Start voor JSON-output met correcties.",
                    "madeit"
                )
            ),
            React.createElement(
                "p",
                { className: "madeit-language-meta" },
                __(
                    "Gevonden blocks:",
                    "madeit"
                ) + " " + String(blockCount)
            ),
            React.createElement(
                "div",
                { className: "madeit-language-actions" },
                React.createElement(
                    Button,
                    {
                        variant: "primary",
                        onClick: handleLanguageCheck,
                        isBusy: isLoading,
                        disabled: isLoading || blockCount === 0,
                    },
                    isLoading
                        ? __("Bezig met controleren...", "madeit")
                        : __("Start", "madeit")
                )
            ),
            languageResult &&
                React.createElement(
                    "div",
                    { className: "madeit-language-result" },
                    React.createElement("h3", null, __("AI-voorstellen", "madeit")),
                    Array.isArray(languageIssues) && languageIssues.length > 0
                        ? React.createElement(
                              "div",
                              { className: "madeit-language-issues" },
                              languageIssues.map((issue, index) =>
                                  React.createElement(
                                      "div",
                                      { key: index, className: "madeit-language-issue" },
                                      React.createElement(
                                          "p",
                                          { className: "madeit-language-issue-label" },
                                          __("Bron", "madeit")
                                      ),
                                      React.createElement(
                                          "p",
                                          {
                                              className: "madeit-language-issue-source",
                                              role: "button",
                                              tabIndex: 0,
                                              onClick: () => handleFocusIssue(index),
                                              onKeyDown: (event) => {
                                                  if (
                                                      event.key === "Enter" ||
                                                      event.key === " "
                                                  ) {
                                                      event.preventDefault();
                                                      handleFocusIssue(index);
                                                  }
                                              },
                                          },
                                          renderSourceWithHighlight(String(issue.source || ""))
                                      ),
                                      React.createElement(
                                          "p",
                                          { className: "madeit-language-issue-label" },
                                          __("Oplossing", "madeit")
                                      ),
                                      React.createElement(
                                          "p",
                                          { className: "madeit-language-issue-fix" },
                                          String(issue.fix || "")
                                      ),
                                      React.createElement(
                                          "div",
                                          { className: "madeit-language-issue-actions" },
                                          React.createElement(
                                              Button,
                                              {
                                                  variant: "secondary",
                                                  onClick: () => handleAcceptIssue(index),
                                                  disabled: !!acceptedIssues[index] || isLoading,
                                              },
                                              acceptedIssues[index]
                                                  ? __("Toegepast", "madeit")
                                                  : __("Accepteer", "madeit")
                                          ),
                                          React.createElement(
                                              Button,
                                              {
                                                  variant: "tertiary",
                                                  onClick: () => handleFocusIssue(index),
                                              },
                                              __("Ga naar fout", "madeit")
                                          )
                                      )
                                  )
                              )
                          )
                        : React.createElement("pre", null, languageResult)
                )
        )
    );
}

function SidebarContent({
    selectedModule,
    onSelectModule,
    uiChat,
    message,
    setMessage,
    isLoading,
    hasScrolled,
    handleSendMessage,
    blockCount,
    languageResult,
    languageIssues,
    acceptedIssues,
    handleLanguageCheck,
    handleAcceptIssue,
    handleFocusIssue,
}) {
    return React.createElement(
        PluginSidebar,
        {
            name: "madeit",
            title: "AI Editor",
        },
        React.createElement(
            PanelBody,
            { className: "madeit-sidebar" },
            React.createElement(ModuleSelector, {
                selectedModule,
                onSelect: onSelectModule,
            }),
            selectedModule === SIDEBAR_MODULES.languageCheck.key
                ? React.createElement(LanguageCheckModule, {
                      blockCount,
                      languageResult,
                      languageIssues,
                      acceptedIssues,
                      isLoading,
                      handleLanguageCheck,
                      handleAcceptIssue,
                      handleFocusIssue,
                  })
                : React.createElement(ChatModule, {
                      uiChat,
                      message,
                      setMessage,
                      isLoading,
                      hasScrolled,
                      handleSendMessage,
                  })
        )
    );
}

registerPlugin("madeit-chatbot-sidebar", {
    render: () => {
        const { insertBlocks, updateBlockAttributes, selectBlock } = useDispatch("core/block-editor");
        const { createErrorNotice } = useDispatch(noticesStore);

        const [message, setMessage] = useState("");
        const [chatHistory, setChatHistory] = useState([]);
        const [uiChat, setUiChat] = useState([]);
        const [selectedModule, setSelectedModule] = useState(SIDEBAR_MODULES.chat.key);
        const [languageResult, setLanguageResult] = useState("");
        const [languageIssues, setLanguageIssues] = useState([]);
        const [acceptedIssues, setAcceptedIssues] = useState({});
        const [blockCount, setBlockCount] = useState(0);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);
        const [hasScrolled, setHasScrolled] = useState(false);
        const [abortController, setAbortController] = useState(null);

        useEffect(() => {
            let activeSidebar = wp.data.select("core/edit-post").getActiveGeneralSidebarName();

            const unsubscribe = wp.data.subscribe(() => {
                const currentSidebar = wp.data.select("core/edit-post").getActiveGeneralSidebarName();

                if (activeSidebar !== currentSidebar) {
                    activeSidebar = currentSidebar;

                    if (currentSidebar !== "madeit-chatbot-sidebar/madeit") {
                        setHasScrolled(false);
                    }
                }
            });

            return () => {
                unsubscribe();
            };
        }, []);

        useEffect(() => {
            const getCurrentCount = () => {
                const blocks = wp.data.select("core/block-editor").getBlocks() || [];
                setBlockCount(blocks.length);
            };

            getCurrentCount();

            const unsubscribe = wp.data.subscribe(() => {
                getCurrentCount();
            });

            return () => {
                unsubscribe();
            };
        }, []);

        const cancelActiveRequest = () => {
            if (abortController) {
                abortController.abort();
                setAbortController(null);
                setIsLoading(false);
            }
        };

        const handleLanguageCheck = async () => {
            if (isLoading) {
                cancelActiveRequest();
                return;
            }

            const editorBlocks = wp.data.select("core/block-editor").getBlocks() || [];
            const blockSnapshot = buildLanguageCheckSnapshot(editorBlocks);
            const textToCheck = JSON.stringify(blockSnapshot, null, 2);

            if (!textToCheck) {
                createErrorNotice(
                    __(
                        "Er is geen bruikbare tekst in de huidige blocks gevonden.",
                        "madeit"
                    ),
                    { type: "default" }
                );
                return;
            }

            setIsLoading(true);
            setError(null);
            setLanguageResult("");
            setLanguageIssues([]);
            setAcceptedIssues({});

            const controller =
                typeof AbortController === "undefined" ? undefined : new AbortController();

            setAbortController(controller || null);

            try {
                const completionResponse = await wp.apiFetch({
                    path: "/madeit-ai/v1/chat/completions",
                    method: "POST",
                    data: {
                        response_format: {
                            type: "json_object",
                        },
                        messages: [
                            {
                                role: "system",
                                content:
                                    "Je bent een taalassistent. Je ontvangt de actuele Gutenberg block-state als JSON (met clientId, attributes en serializedHtml). Geef ALLEEN geldige JSON terug (geen markdown of extra tekst) met dit formaat: {\"issues\":[{\"source\":\"...\",\"fix\":\"...\",\"clientId\":\"...\",\"positie\":\"...\"}]}. In 'source' markeer je de fout met [FOUT]...[/FOUT]. Gebruik ALTIJD de echte Gutenberg clientId van het block met de fout in 'clientId'. 'positie' mag als extra context, maar 'clientId' is verplicht. Baseer je op de huidige state, niet op historische/originalContent velden.",
                            },
                            {
                                role: "user",
                                content:
                                    "Controleer deze Gutenberg blocks op taalfouten en geef uitsluitend JSON terug volgens het gevraagde formaat:\n\n" +
                                    textToCheck,
                            },
                        ],
                    },
                    signal: controller?.signal,
                });

                const payload = completionResponse.data
                    ? completionResponse.data
                    : completionResponse;

                const responseText = payload?.choices?.[0]?.message?.content;

                if (responseText) {
                    const jsonResult = extractJsonFromText(responseText);

                    if (jsonResult) {
                        setLanguageResult(JSON.stringify(jsonResult, null, 2));
                        setLanguageIssues(Array.isArray(jsonResult.issues) ? jsonResult.issues : []);
                    } else {
                        createErrorNotice(
                            __(
                                "De AI gaf geen valide JSON terug. Probeer opnieuw.",
                                "madeit"
                            ),
                            { type: "default" }
                        );
                    }
                } else {
                    createErrorNotice(
                        __(
                            "Er kon geen taalvoorstel worden gegenereerd. Probeer het opnieuw.",
                            "madeit"
                        ),
                        { type: "default" }
                    );
                }
            } catch (requestError) {
                if (requestError.name === "AbortError") {
                    createErrorNotice(__("De taalcheck is geannuleerd.", "madeit"), {
                        type: "snackbar",
                    });
                } else {
                    const messageText = requestError.message || "An unknown error occurred.";
                    createErrorNotice(messageText, { type: "default" });
                }
            } finally {
                setIsLoading(false);
                setAbortController(null);
            }
        };

        const handleAcceptIssue = (issueIndex) => {
            if (!Array.isArray(languageIssues) || !languageIssues[issueIndex]) {
                return;
            }

            const logApplyFailure = (reason, details = {}) => {
                // eslint-disable-next-line no-console
                console.error("[madeit-language-check] apply issue failed", {
                    reason,
                    issueIndex,
                    details,
                });
            };

            const issue = languageIssues[issueIndex];
            const blockEditorSelect = wp.data.select("core/block-editor");
            const blocks = blockEditorSelect.getBlocks() || [];
            const position = parseIssuePosition(issue.positie);
            const issueClientId = extractIssueClientId(issue);
            const markedError = extractMarkedError(issue?.source);
            const sourcePlain = stripHtml(String(issue?.source || ""))
                .replace(/\[FOUT\]|\[\/FOUT\]/gi, "")
                .trim();

            const resolveIssueBlock = () => {
                let resolved = issueClientId
                    ? blockEditorSelect.getBlock(issueClientId)
                    : null;

                if (!resolved) {
                    resolved = getBlockFromPosition(blocks, position);
                }

                if (!resolved && markedError) {
                    resolved = findFirstBlockWithContent(blocks, markedError);
                }

                if (!resolved && sourcePlain) {
                    resolved = findFirstBlockWithContent(blocks, sourcePlain);
                }

                return resolved;
            };

            const targetBlock = resolveIssueBlock();

            if (!targetBlock || !targetBlock.clientId) {
                logApplyFailure("target_block_not_found", {
                    issue,
                    parsedPosition: position,
                    markedError,
                    issueClientId,
                    hintedClientId: position?.hintedClientId || null,
                    rootBlockCount: blocks.length,
                });
                createErrorNotice(
                    __(
                        "Kon de juiste block niet vinden voor deze wijziging.",
                        "madeit"
                    ),
                    { type: "default" }
                );
                return;
            }

            const attributeUpdate = findBestAttributeUpdate(targetBlock, issue);

            if (!attributeUpdate) {
                logApplyFailure("no_content_change", {
                    issue,
                    parsedPosition: position,
                    targetBlockClientId: targetBlock.clientId,
                    targetBlockName: targetBlock.name,
                    targetBlockOriginalContentPreview: String(
                        targetBlock.originalContent || ""
                    ).slice(0, 240),
                    availableStringAttributes: Object.keys(targetBlock.attributes || {}).filter(
                        (key) => typeof targetBlock.attributes[key] === "string"
                    ),
                });
                createErrorNotice(
                    __(
                        "Deze wijziging kon niet automatisch worden toegepast.",
                        "madeit"
                    ),
                    { type: "default" }
                );
                return;
            }

            try {
                updateBlockAttributes(targetBlock.clientId, {
                    [attributeUpdate.key]: attributeUpdate.updatedValue,
                });
            } catch (updateError) {
                logApplyFailure("update_block_attributes_error", {
                    issue,
                    parsedPosition: position,
                    targetBlockClientId: targetBlock.clientId,
                    targetBlockName: targetBlock.name,
                    updatedAttributeKey: attributeUpdate.key,
                    errorMessage: updateError?.message || "unknown_error",
                });

                createErrorNotice(
                    __(
                        "Er ging iets mis bij het toepassen van deze wijziging.",
                        "madeit"
                    ),
                    { type: "default" }
                );
                return;
            }

            setAcceptedIssues((previous) => ({
                ...previous,
                [issueIndex]: true,
            }));
        };

        const handleFocusIssue = (issueIndex) => {
            if (!Array.isArray(languageIssues) || !languageIssues[issueIndex]) {
                return;
            }

            const issue = languageIssues[issueIndex];
            const blockEditorSelect = wp.data.select("core/block-editor");
            const blocks = blockEditorSelect.getBlocks() || [];
            const position = parseIssuePosition(issue.positie);
            const issueClientId = extractIssueClientId(issue);
            const markedError = extractMarkedError(issue?.source);
            const sourcePlain = stripHtml(String(issue?.source || ""))
                .replace(/\[FOUT\]|\[\/FOUT\]/gi, "")
                .trim();

            let targetBlock = issueClientId
                ? blockEditorSelect.getBlock(issueClientId)
                : null;

            if (!targetBlock) {
                targetBlock = getBlockFromPosition(blocks, position);
            }

            if (!targetBlock && markedError) {
                targetBlock = findFirstBlockWithContent(blocks, markedError);
            }

            if (!targetBlock && sourcePlain) {
                targetBlock = findFirstBlockWithContent(blocks, sourcePlain);
            }

            if (!targetBlock?.clientId) {
                createErrorNotice(
                    __(
                        "Kon geen block vinden om naartoe te navigeren.",
                        "madeit"
                    ),
                    { type: "default" }
                );
                return;
            }

            selectBlock(targetBlock.clientId);

            window.requestAnimationFrame(() => {
                const blockElement = document.querySelector(`[data-block="${targetBlock.clientId}"]`);
                if (blockElement && typeof blockElement.scrollIntoView === "function") {
                    blockElement.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            });
        };

        return React.createElement(SidebarContent, {
            selectedModule,
            onSelectModule: (moduleKey) => {
                setSelectedModule(moduleKey);
                setError(null);
            },
            uiChat,
            message,
            setMessage,
            isLoading,
            hasScrolled,
            blockCount,
            languageResult,
            languageIssues,
            acceptedIssues,
            handleLanguageCheck,
            handleAcceptIssue,
            handleFocusIssue,
            handleSendMessage: async () => {
                if (isLoading) {
                    cancelActiveRequest();
                    return;
                }

                const outgoingMessage = message.trim();
                if (!outgoingMessage) {
                    return;
                }

                setMessage("");
                setIsLoading(true);
                setError(null);
                setHasScrolled(true);

                const controller =
                    typeof AbortController === "undefined"
                        ? undefined
                        : new AbortController();

                setAbortController(controller || null);

                const nextMessages = [
                    ...chatHistory,
                    {
                        role: "user",
                        content: outgoingMessage,
                    },
                ];

                setChatHistory(nextMessages);
                setUiChat((previous) => [
                    ...previous,
                    {
                        role: "user",
                        content: outgoingMessage,
                    },
                ]);

                try {
                    //const functions = getFunctionsForModel(settings.ai_editor_model);
                    const completionResponse = await wp.apiFetch({
                        path: "/madeit-ai/v1/chat/completions",
                        method: "POST",
                        data: {
                            messages: nextMessages,
                            //functions,
                        },
                        signal: controller?.signal,
                    });

                    if (completionResponse.error) {
                        createErrorNotice(
                            __("An error occurred: ", "madeit") + completionResponse.message,
                            { type: "default" }
                        );
                    }

                    const payload = completionResponse.data
                        ? completionResponse.data
                        : completionResponse;

                    if (payload?.choices?.[0]?.message?.blocks) {
                        let hasError = false;

                        try {
                            const blocks = payload.choices[0].message.blocks;

                            if (Array.isArray(blocks) && blocks.length > 0) {
                                normalizeTableBodies(blocks);

                                try {
                                    await insertGeneratedBlocks(blocks, insertBlocks);
                                } catch (insertError) {
                                    // eslint-disable-next-line no-console
                                    console.error("Cannot insert blocks:", insertError);
                                    createErrorNotice(
                                        __(
                                            "The model did not format the request correctly. Please try again with a more detailed prompt.",
                                            "madeit"
                                        ),
                                        { type: "default" }
                                    );
                                    hasError = true;
                                }
                            }
                        } catch (formatError) {
                            createErrorNotice(
                                __(
                                    "An error occurred: Invalid data structure. Please try again or use a more advanced GPT-4 model.",
                                    "madeit"
                                ),
                                { type: "default" }
                            );
                            hasError = true;
                        }

                        if (!hasError) {
                            let successMessage = __("Blocks added successfully!", "madeit");
                            let messageFlags = { blockAdded: true };

                            if (completionResponse.warning) {
                                successMessage = completionResponse.message;
                                messageFlags = { blockAddedWarning: true };
                            }

                            setUiChat((previous) => [
                                ...previous,
                                {
                                    role: "assistant",
                                    content: successMessage,
                                    ...messageFlags,
                                },
                            ]);

                            setChatHistory((previous) => [
                                ...previous,
                                {
                                    role: "assistant",
                                    content: successMessage,
                                },
                            ]);
                        }
                    } else if (payload?.choices?.[0]?.message?.content) {
                        const assistantContent = payload.choices[0].message.content;

                        setChatHistory((previous) => [
                            ...previous,
                            {
                                role: "assistant",
                                content: assistantContent,
                            },
                        ]);

                        setUiChat((previous) => [
                            ...previous,
                            {
                                role: "assistant",
                                content: assistantContent,
                            },
                        ]);
                    } else {
                        // eslint-disable-next-line no-console
                        console.error("There was a problem with the OpenAI request:", payload);
                        createErrorNotice(
                            __(
                                "An error occurred: There was a problem with the OpenAI request.",
                                "madeit"
                            ),
                            { type: "default" }
                        );
                    }
                } catch (requestError) {
                    if (requestError.name === "AbortError") {
                        createErrorNotice(__("The request has been cancelled.", "madeit"), {
                            type: "snackbar",
                        });
                    } else if (requestError.name === "notSupported") {
                        const warningFlags = { blockAddedWarning: true };

                        setUiChat((previous) => [
                            ...previous,
                            {
                                role: "assistant",
                                content: requestError.message,
                                ...warningFlags,
                            },
                        ]);

                        setChatHistory((previous) => [
                            ...previous,
                            {
                                role: "assistant",
                                content: requestError.message,
                            },
                        ]);
                    } else {
                        const messageText = requestError.message || "An unknown error occurred.";
                        createErrorNotice(messageText, { type: "default" });
                    }
                } finally {
                    setIsLoading(false);
                    setAbortController(null);
                }
            },
            handleCancel: cancelActiveRequest,
            error,
        });
    },
    icon: React.createElement(
        "svg",
        {
            xmlns: "http://www.w3.org/2000/svg",
            width: "800",
            height: "800",
            fill: "currentColor",
            version: "1.1",
            viewBox: "0 0 512.002 512.002",
            xmlSpace: "preserve",
        },
        React.createElement("path", {
            d: "M247.527 264.474l-54.037-16.785-188.598 188.6c-6.521 6.521-6.521 17.086 0 23.607l47.214 47.214a16.64 16.64 0 0011.803 4.891c4.272 0 8.543-1.63 11.803-4.891L264.31 318.512l-16.783-54.038z",
        }),
        React.createElement("path", {
            d: "M508.684 231.248l-61.051-81.81 32.78-96.678a16.696 16.696 0 00-4.011-17.162 16.736 16.736 0 00-17.162-4.01l-96.678 32.78-81.81-61.051a16.697 16.697 0 00-17.564-1.5 16.721 16.721 0 00-9.119 15.096l1.304 102.069-83.354 58.953a16.693 16.693 0 00-6.847 16.238 16.695 16.695 0 0011.531 13.336l97.494 30.292 30.292 97.494a16.693 16.693 0 0013.336 11.531c.869.141 1.74.207 2.609.207 5.369 0 10.466-2.516 13.63-6.985l58.953-83.283 102.069 1.443h.217c6.272 0 12.021-3.661 14.879-9.258 2.881-5.662 2.306-12.605-1.498-17.702z",
        })
    ),
});