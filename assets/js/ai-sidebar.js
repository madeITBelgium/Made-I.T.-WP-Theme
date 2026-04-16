/**
 * TODO:
 * - Interne Link Suggesties.
 * - FAQ
 * - Content Gap module
 * - Titel analyse module
 */

const React = window.React;

const { registerPlugin } = wp.plugins;
const { useDispatch } = wp.data;
const { useState, useEffect, useCallback, useRef, Fragment } = wp.element;
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
            const buttonsFromArray = Array.isArray(blockData.buttonsContent)
                ? blockData.buttonsContent
                : [];

            const fallbackText = String(
                blockData.content || blockData.text || blockData.label || ""
            ).trim();

            const normalizedButtons =
                buttonsFromArray.length > 0
                    ? buttonsFromArray
                    : fallbackText
                    ? [{ text: fallbackText, url: "" }]
                    : [];

            const buttonBlocks = normalizedButtons
                .map((button) => {
                    const text = String(button?.text || "").trim();
                    const url = String(button?.url || "").trim();

                    if (!text) {
                        return null;
                    }

                    return createBlock("core/button", {
                        text,
                        url,
                    });
                })
                .filter((buttonBlock) => buttonBlock !== null);

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

function clampColumnWidth(width) {
    const numeric = Number(width);
    if (!Number.isFinite(numeric)) {
        return 12;
    }

    return Math.max(1, Math.min(12, Math.round(numeric)));
}

function normalizeAutoBlockSections(payload) {
    if (Array.isArray(payload?.sections)) {
        return payload.sections;
    }

    if (Array.isArray(payload?.columns)) {
        return [{ columns: payload.columns }];
    }

    if (Array.isArray(payload?.blocks)) {
        return [
            {
                columns: [
                    {
                        width: 12,
                        blocks: payload.blocks,
                    },
                ],
            },
        ];
    }

    return [];
}

function createMadeitContentBlocksFromSections(sections) {
    if (!Array.isArray(sections)) {
        return [];
    }

    return sections
        .map((section) => {
            const sectionColumns = Array.isArray(section?.columns) ? section.columns : [];
            const fallbackBlocks = Array.isArray(section?.blocks) ? section.blocks : [];

            const normalizedColumns =
                sectionColumns.length > 0
                    ? sectionColumns
                    : [
                          {
                              width: 12,
                              blocks: fallbackBlocks,
                          },
                      ];

            const columnBlocks = normalizedColumns
                .map((column) => {
                    const innerRawBlocks = Array.isArray(column?.blocks) ? column.blocks : [];

                    const innerBlocks = innerRawBlocks
                        .map((item) => mapBlockDataToWpBlock(item))
                        .filter((item) => item !== null);

                    if (innerBlocks.length === 0) {
                        return null;
                    }

                    return createBlock(
                        "madeit/block-content-column",
                        {
                            width: clampColumnWidth(column?.width),
                        },
                        innerBlocks
                    );
                })
                .filter((columnBlock) => columnBlock !== null);

            if (columnBlocks.length === 0) {
                return null;
            }

            return createBlock(
                "madeit/block-content",
                {
                    containerPaddingOnRow: true,
                    overflow: "visible",
                    flexDirection: "row",
                    flexDirectionTablet: "column",
                    flexDirectionMobile: "column",
                    alignItems: "stretch",
                    justifyContent: "flex-start",
                    rowGap: 20,
                    rowGapTablet: 20,
                    rowGapMobile: 20,
                    columnsCount: columnBlocks.length,
                    flexWrap: "nowrap",
                },
                columnBlocks
            );
        })
        .filter((sectionBlock) => sectionBlock !== null);
}

function blockTreeContainsClientId(block, targetClientId) {
    if (!block || !targetClientId) {
        return false;
    }

    if (block.clientId === targetClientId) {
        return true;
    }

    const innerBlocks = Array.isArray(block.innerBlocks) ? block.innerBlocks : [];
    for (let i = 0; i < innerBlocks.length; i += 1) {
        if (blockTreeContainsClientId(innerBlocks[i], targetClientId)) {
            return true;
        }
    }

    return false;
}

function resolveRootInsertIndexByClientId(rootBlocks, targetClientId, position) {
    if (!Array.isArray(rootBlocks) || !targetClientId) {
        return null;
    }

    for (let i = 0; i < rootBlocks.length; i += 1) {
        if (blockTreeContainsClientId(rootBlocks[i], targetClientId)) {
            return position === "before" ? i : i + 1;
        }
    }

    return null;
}

function normalizeAutoInsertSpec(payload) {
    const rawInsert = payload?.insert || {};
    const position = rawInsert?.position === "before" || rawInsert?.position === "after"
        ? rawInsert.position
        : "after";
    const clientId = String(rawInsert?.clientId || "").trim();

    return {
        position,
        clientId,
    };
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

    const sectionSchema = {
        type: "object",
        properties: {
            columns: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        width: {
                            type: "integer",
                            minimum: 1,
                            maximum: 12,
                        },
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
        required: ["columns"],
    };

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
        {
            type: "function",
            function: {
                name: "create_madeit_layout_blocks",
                description:
                    "Create madeit/block-content root sections with columns and inner Gutenberg blocks. Optionally insert before/after a specific clientId.",
                parameters: {
                    type: "object",
                    properties: {
                        insert: {
                            type: "object",
                            properties: {
                                position: {
                                    type: "string",
                                    enum: ["before", "after"],
                                },
                                clientId: {
                                    type: "string",
                                },
                            },
                        },
                        sections: {
                            type: "array",
                            items: sectionSchema,
                        },
                    },
                    required: ["sections"],
                },
            },
        },
        {
            type: "function",
            function: {
                name: "delete_gutenberg_block",
                description:
                    "Delete exactly one Gutenberg block by clientId when the user asks to remove specific content.",
                parameters: {
                    type: "object",
                    properties: {
                        clientId: {
                            type: "string",
                            description: "The exact Gutenberg clientId of the block to remove.",
                        },
                        reason: {
                            type: "string",
                            description: "Optional short reason why this block should be removed.",
                        },
                    },
                    required: ["clientId"],
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

function getApiPayload(response) {
    return response?.data ? response.data : response;
}

function getCompletionTextFromApiResponse(response) {
    const payload = getApiPayload(response);
    return String(payload?.choices?.[0]?.message?.content || "").trim();
}

function buildLayoutSystemPrompt() {
    return (
        "Je bent een Gutenberg layout-assistent. Geef ALLEEN geldige JSON terug, zonder markdown of extra tekst. Formaat: {\"insert\":{\"position\":\"before|after\",\"clientId\":\"...\"},\"sections\":[{\"columns\":[{\"width\":6,\"blocks\":[{\"blockType\":\"core/heading\",\"content\":\"...\"},{\"blockType\":\"core/paragraph\",\"content\":\"...\"}]}]}]}. Op root niveau worden sections altijd omgezet naar madeit/block-content. Gebruik in blocks uitsluitend deze blockTypes: " +
        ALLOWED_BLOCKS.join(", ") +
        ". Als je geen specifieke clientId hebt, laat insert.clientId leeg."
    );
}

function buildLayoutUserPrompt(prompt, selectedClientId, currentStructure) {
    return (
        "Gebruikersvraag:\n" +
        prompt +
        "\n\nHuidige geselecteerde clientId:\n" +
        (selectedClientId || "") +
        "\n\nHuidige Gutenberg structuur (met clientId):\n" +
        JSON.stringify(currentStructure)
    );
}

async function requestLayoutJson({ prompt, selectedClientId, currentStructure, signal }) {
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
                    content: buildLayoutSystemPrompt(),
                },
                {
                    role: "user",
                    content: buildLayoutUserPrompt(prompt, selectedClientId, currentStructure),
                },
            ],
        },
        signal,
    });

    return extractJsonFromText(getCompletionTextFromApiResponse(completionResponse));
}

function buildBlocksSystemPrompt() {
    return (
        "Je bent een Gutenberg block-assistent. Geef ALLEEN geldige JSON terug, zonder markdown of extra tekst, met formaat: {\"blocks\":[{\"blockType\":\"core/heading\",\"content\":\"...\"}]}. Gebruik uitsluitend deze blockTypes: " +
        ALLOWED_BLOCKS.join(", ") +
        "."
    );
}

function buildBlocksUserPrompt(prompt, currentStructure) {
    return (
        "Gebruikersvraag:\n" +
        prompt +
        "\n\nHuidige Gutenberg structuur (met clientId):\n" +
        JSON.stringify(currentStructure)
    );
}

async function requestBlocksJson({ prompt, currentStructure, signal }) {
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
                    content: buildBlocksSystemPrompt(),
                },
                {
                    role: "user",
                    content: buildBlocksUserPrompt(prompt, currentStructure),
                },
            ],
        },
        signal,
    });

    return extractJsonFromText(getCompletionTextFromApiResponse(completionResponse));
}

function buildDeleteBlockSystemPrompt() {
    return (
        "Je bent een Gutenberg assistent die exact 1 block clientId kiest om te verwijderen. Geef ALLEEN geldige JSON terug zonder markdown of extra tekst in dit formaat: {\"clientId\":\"...\",\"reason\":\"...\"}. Gebruik enkel een bestaande clientId uit de meegegeven Gutenberg structuur. Als je niet zeker bent, geef {\"clientId\":\"\",\"reason\":\"\"} terug."
    );
}

function buildDeleteBlockUserPrompt(prompt, currentStructure) {
    return (
        "Gebruikersvraag:\n" +
        prompt +
        "\n\nHuidige Gutenberg structuur (met clientId):\n" +
        JSON.stringify(currentStructure)
    );
}

async function requestDeleteBlockJson({ prompt, currentStructure, signal }) {
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
                    content: buildDeleteBlockSystemPrompt(),
                },
                {
                    role: "user",
                    content: buildDeleteBlockUserPrompt(prompt, currentStructure),
                },
            ],
        },
        signal,
    });

    return extractJsonFromText(getCompletionTextFromApiResponse(completionResponse));
}

function sanitizeClientId(value) {
    const raw = String(value || "").trim();
    const match = raw.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    return match ? match[0] : "";
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

function previewText(value, limit = 180) {
    return String(value || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, limit);
}

function applyIssueToContent(content, issue) {
    const original = String(content || "");
    const incorrectText = extractMarkedError(issue?.source);
    const replacementText = String(issue?.fix || "").trim();
    const sourcePlain = stripHtml(String(issue?.source || ""))
        .replace(/\[FOUT\]|\[\/FOUT\]/gi, "")
        .trim();

    const replaceFirstInsensitive = (haystack, needle, replacement) => {
        const source = String(haystack || "");
        const target = String(needle || "").trim();
        if (!source || !target) {
            return null;
        }

        const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "i");
        if (!regex.test(source)) {
            return null;
        }

        return source.replace(regex, replacement);
    };

    const normalizeWhitespace = (value) => String(value || "").replace(/\s+/g, " ").trim();

    // Prefer exact marked-fault replacement when available.
    if (incorrectText && original.includes(incorrectText)) {
        return original.replace(incorrectText, replacementText);
    }

    // Fallback: case-insensitive replacement for marked fault.
    if (incorrectText) {
        const replacedInsensitive = replaceFirstInsensitive(original, incorrectText, replacementText);
        if (replacedInsensitive !== null) {
            return replacedInsensitive;
        }
    }

    // For sentence-level fixes, prefer replacing the full source sentence.
    if (/\s/.test(replacementText)) {
        if (sourcePlain && original.includes(sourcePlain)) {
            return original.replace(sourcePlain, replacementText);
        }

        const replacedInsensitive = replaceFirstInsensitive(original, sourcePlain, replacementText);
        if (replacedInsensitive !== null) {
            return replacedInsensitive;
        }

        const originalCollapsed = normalizeWhitespace(original);
        const sourceCollapsed = normalizeWhitespace(sourcePlain);
        if (sourceCollapsed && originalCollapsed.includes(sourceCollapsed)) {
            return originalCollapsed.replace(sourceCollapsed, replacementText);
        }

        return original;
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

function findBestAttributeUpdate(block, issue, options = {}) {
    if (!block?.attributes) {
        if (options.debugNamespace) {
            // eslint-disable-next-line no-console
            console.info("[" + options.debugNamespace + "] no block attributes for update", {
                clientId: block?.clientId || null,
            });
        }
        return null;
    }

    const priorityKeys = ["content", "title", "text", "caption", "value", "values"];
    const allAttributeKeys = Object.keys(block.attributes);
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
            if (options.debugNamespace) {
                // eslint-disable-next-line no-console
                console.info("[" + options.debugNamespace + "] attribute update match found", {
                    key,
                    sourceType: "attribute",
                    before: previewText(currentValue),
                    after: previewText(updatedValue),
                });
            }

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
            const preferredMarkupKey = allAttributeKeys.includes("content")
                ? "content"
                : allAttributeKeys.includes("value")
                ? "value"
                : allAttributeKeys.includes("values")
                ? "values"
                : "";
            const preferredTextKey = block.name === "core/button" && allAttributeKeys.includes("text")
                ? "text"
                : allAttributeKeys.includes("text")
                ? "text"
                : allAttributeKeys.includes("title")
                ? "title"
                : "";

            const updatedInnerHtml = extractInnerHtmlFromMarkup(updatedMarkup);
            const updatedPlainText = stripHtml(updatedMarkup);
            const targetKey = preferredTextKey || preferredMarkupKey || "content";
            const targetValue = preferredTextKey ? updatedPlainText : updatedInnerHtml;
            const currentAttributeValue = String(block.attributes?.[targetKey] || "");

            if (options.debugNamespace) {
                // eslint-disable-next-line no-console
                console.info("[" + options.debugNamespace + "] originalContent fallback match found", {
                    key: targetKey,
                    sourceType: "originalContent",
                    before: previewText(block.originalContent),
                    after: previewText(targetValue),
                });
            }

            return {
                key: targetKey,
                currentValue: currentAttributeValue,
                updatedValue: targetValue,
                sourceType: "originalContent",
            };
        }
    }

    if (options.allowDirectReplace) {
        const fallbackValue = String(issue?.fix || "").trim();
        const preferredDirectKeys = ["text", "content", "value", "values", "title", "caption"];
        const directTargetKey = preferredDirectKeys.find((key) => allAttributeKeys.includes(key)) || "";

        if (fallbackValue && directTargetKey) {
            const targetKey = directTargetKey;
            const currentValue = String(block.attributes[targetKey] || "");

            if (currentValue !== fallbackValue) {
                if (options.debugNamespace) {
                    // eslint-disable-next-line no-console
                    console.info("[" + options.debugNamespace + "] direct fallback used", {
                        key: targetKey,
                        sourceType: "directFallback",
                        before: previewText(currentValue),
                        after: previewText(fallbackValue),
                    });
                }

                return {
                    key: targetKey,
                    currentValue,
                    updatedValue: fallbackValue,
                    sourceType: "directFallback",
                };
            }
        }
    }

    if (options.debugNamespace) {
        // eslint-disable-next-line no-console
        console.info("[" + options.debugNamespace + "] no attribute update match", {
            availableStringKeys: orderedKeys,
            issueSource: previewText(issue?.source),
            issueFix: previewText(issue?.fix),
        });
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

function countMissingImageAlts(blocks) {
    if (!Array.isArray(blocks)) {
        return 0;
    }

    return blocks.reduce((count, block) => {
        const isImageBlock = block?.name === "core/image";
        const url = String(block?.attributes?.url || "").trim();
        const alt = String(block?.attributes?.alt || "").trim();
        const hasImageSource = url !== "";
        const ownCount = isImageBlock && hasImageSource && alt === "" ? 1 : 0;
        return count + ownCount + countMissingImageAlts(block?.innerBlocks || []);
    }, 0);
}

function flattenBlocksForContext(blocks, flat = []) {
    if (!Array.isArray(blocks)) {
        return flat;
    }

    blocks.forEach((block) => {
        const attrs = block?.attributes || {};
        const contentFields = ["content", "caption", "title", "text", "value", "values"];

        contentFields.forEach((field) => {
            if (typeof attrs[field] === "string") {
                const text = stripHtml(attrs[field]);
                if (text) {
                    flat.push({ type: "text", text });
                }
            }
        });

        if (block?.name === "core/image") {
            flat.push({
                type: "image",
                clientId: block.clientId,
                url: String(attrs.url || ""),
                alt: String(attrs.alt || ""),
                caption: stripHtml(String(attrs.caption || "")),
            });
        }

        flattenBlocksForContext(block?.innerBlocks || [], flat);
    });

    return flat;
}

function collectMissingAltTasks(blocks) {
    const flat = flattenBlocksForContext(blocks);
    const tasks = [];

    flat.forEach((entry, index) => {
        if (entry.type !== "image") {
            return;
        }

        if (!entry.url || entry.alt.trim() !== "") {
            return;
        }

        const contextParts = [];
        for (let i = index - 1; i >= 0 && contextParts.length < 2; i -= 1) {
            if (flat[i].type === "text") {
                contextParts.unshift(flat[i].text);
            }
        }

        for (let i = index + 1; i < flat.length && contextParts.length < 4; i += 1) {
            if (flat[i].type === "text") {
                contextParts.push(flat[i].text);
            }
        }

        tasks.push({
            clientId: entry.clientId,
            url: entry.url,
            caption: entry.caption,
            contextText: contextParts.join("\n"),
        });
    });

    return tasks;
}

function extractResponseText(payload) {
    if (!payload) {
        return "";
    }

    if (typeof payload.output_text === "string") {
        return payload.output_text.trim();
    }

    if (Array.isArray(payload.output)) {
        const textParts = [];
        payload.output.forEach((item) => {
            if (Array.isArray(item?.content)) {
                item.content.forEach((part) => {
                    if (typeof part?.text === "string") {
                        textParts.push(part.text);
                    }
                });
            }
        });

        if (textParts.length > 0) {
            return textParts.join("\n").trim();
        }
    }

    return String(payload?.choices?.[0]?.message?.content || "").trim();
}

function buildResponsesInputFromMessages(messages) {
    if (!Array.isArray(messages)) {
        return [];
    }

    return messages.map((message) => {
        const role = message?.role || "user";
        const contentType = role === "assistant" ? "output_text" : "input_text";

        return {
            role,
            content: [
                {
                    type: contentType,
                    text: String(message?.content || ""),
                },
            ],
        };
    });
}

function extractResponseFunctionArgs(payload, allowedNames = []) {
    const outputItems = Array.isArray(payload?.output) ? payload.output : [];

    for (let i = 0; i < outputItems.length; i += 1) {
        const item = outputItems[i];
        const itemName = String(item?.name || item?.function?.name || "");
        const itemType = String(item?.type || "");
        const rawArgs = String(item?.arguments || item?.function?.arguments || "").trim();

        const isFunctionCallType = itemType === "function_call" || itemType === "tool_call";
        const isAllowedName =
            allowedNames.length === 0 || (itemName && allowedNames.includes(itemName));

        if (!isFunctionCallType || !isAllowedName || !rawArgs) {
            continue;
        }

        const parsed = extractJsonFromText(rawArgs);
        if (parsed) {
            return parsed;
        }
    }

    return null;
}

function sanitizeAltText(text) {
    return String(text || "")
        .replace(/^['"]+|['"]+$/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 125);
}

function isYoastSeoActive() {
    try {
        const hasYoastStore =
            !!wp?.data?.hasStore &&
            (wp.data.hasStore("yoast-seo/editor") || wp.data.hasStore("yoast-seo/settings"));

        const hasYoastGlobal =
            typeof window !== "undefined" &&
            (typeof window.YoastSEO !== "undefined" || typeof window.wpseoScriptData !== "undefined");

        return hasYoastStore || hasYoastGlobal;
    } catch (error) {
        return false;
    }
}

function collectPostContextForKeyword() {
    const editorSelect = wp.data.select("core/editor");
    const blockEditorSelect = wp.data.select("core/block-editor");

    const title = String(editorSelect?.getEditedPostAttribute("title") || "").trim();
    const blocks = blockEditorSelect?.getBlocks() || [];
    const blockSnapshot = buildLanguageCheckSnapshot(blocks);

    return {
        title,
        blocks: blockSnapshot,
    };
}

function sanitizeKeyword(text) {
    return String(text || "")
        .replace(/^['"]+|['"]+$/g, "")
        .replace(/\.$/, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80);
}

function sanitizeMetaTitle(text) {
    return String(text || "")
        .replace(/^['"]+|['"]+$/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180);
}

function sanitizeMetaDescription(text) {
    return String(text || "")
        .replace(/^['"]+|['"]+$/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 320);
}

function applyYoastFocusKeyword(keyword) {
    const sanitized = sanitizeKeyword(keyword);
    if (!sanitized) {
        return false;
    }

    let applied = false;

    try {
        const yoastDispatch = wp?.data?.dispatch?.("yoast-seo/editor");
        if (yoastDispatch) {
            const candidateActions = [
                "setFocusKeyphrase",
                "setFocusKeyword",
                "setFocusKeywordValue",
            ];

            for (let i = 0; i < candidateActions.length; i += 1) {
                const actionName = candidateActions[i];
                if (typeof yoastDispatch[actionName] === "function") {
                    yoastDispatch[actionName](sanitized);
                    applied = true;
                    break;
                }
            }
        }
    } catch (error) {
        // noop
    }

    if (applied) {
        return true;
    }

    const inputSelectors = [
        "#focus-keyword-input-metabox",
        "#yoast_wpseo_focuskw",
        "input[name='yoast_wpseo_focuskw']",
    ];

    for (let i = 0; i < inputSelectors.length; i += 1) {
        const input = document.querySelector(inputSelectors[i]);
        if (input) {
            input.value = sanitized;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
        }
    }

    return false;
}

function getYoastFocusKeyword() {
    try {
        const yoastSelect = wp?.data?.select?.("yoast-seo/editor");
        if (yoastSelect) {
            const candidateSelectors = [
                "getFocusKeyphrase",
                "getFocusKeyword",
                "getFocusKeywordValue",
            ];

            for (let i = 0; i < candidateSelectors.length; i += 1) {
                const selector = candidateSelectors[i];
                if (typeof yoastSelect[selector] === "function") {
                    const value = sanitizeKeyword(yoastSelect[selector]());
                    if (value) {
                        return value;
                    }
                }
            }
        }
    } catch (error) {
        // noop
    }

    const inputSelectors = [
        "#focus-keyword-input-metabox",
        "#yoast_wpseo_focuskw",
        "input[name='yoast_wpseo_focuskw']",
    ];

    for (let i = 0; i < inputSelectors.length; i += 1) {
        const input = document.querySelector(inputSelectors[i]);
        if (input?.value) {
            const value = sanitizeKeyword(input.value);
            if (value) {
                return value;
            }
        }
    }

    return "";
}

function getYoastMetaTitleDebugSnapshot() {
    const snapshot = {
        yoastStore: {},
        coreMeta: {},
        dom: {},
    };

    try {
        const yoastSelect = wp?.data?.select?.("yoast-seo/editor");
        if (yoastSelect) {
            const candidateSelectors = [
                "getTitle",
                "getSeoTitle",
                "getSnippetTitle",
                "getSnippetEditorTitle",
                "getMetaTitle",
            ];

            candidateSelectors.forEach((selectorName) => {
                if (typeof yoastSelect[selectorName] === "function") {
                    try {
                        snapshot.yoastStore[selectorName] = yoastSelect[selectorName]();
                    } catch (selectorError) {
                        snapshot.yoastStore[selectorName] = "[selector_error]";
                    }
                }
            });
        }
    } catch (error) {
        snapshot.yoastStore._error = error?.message || "unknown_error";
    }

    try {
        const editorSelect = wp?.data?.select?.("core/editor");
        const editedMeta = editorSelect?.getEditedPostAttribute?.("meta") || {};
        snapshot.coreMeta._yoast_wpseo_title = editedMeta?._yoast_wpseo_title || "";
    } catch (error) {
        snapshot.coreMeta._error = error?.message || "unknown_error";
    }

    const inputSelectors = [
        "#yoast_wpseo_title",
        "input[name='yoast_wpseo_title']",
        "#snippet-editor-title",
        "input[id*='snippet-editor-title']",
        "input[aria-label='SEO title']",
    ];

    inputSelectors.forEach((selector) => {
        const input = document.querySelector(selector);
        snapshot.dom[selector] = input ? String(input.value || "") : "[not_found]";
    });

    return snapshot;
}

function setNativeFieldValue(element, value) {
    const isTextarea = String(element?.tagName || "").toUpperCase() === "TEXTAREA";
    const prototype = isTextarea
        ? window?.HTMLTextAreaElement?.prototype
        : window?.HTMLInputElement?.prototype;

    const descriptor = prototype
        ? Object.getOwnPropertyDescriptor(prototype, "value")
        : null;

    if (descriptor?.set) {
        descriptor.set.call(element, value);
    } else {
        element.value = value;
    }
}

async function applyYoastMetaTitle(metaTitle) {
    const sanitized = sanitizeMetaTitle(metaTitle);
    if (!sanitized) {
        // eslint-disable-next-line no-console
        console.warn("[madeit-yoast-meta-title] empty meta title after sanitize", { metaTitle });
        return { applied: false, restApplied: false, appliedPaths: [] };
    }

    // eslint-disable-next-line no-console
    console.info("[madeit-yoast-meta-title] apply start", {
        metaTitle,
        sanitized,
        before: getYoastMetaTitleDebugSnapshot(),
    });

    let applied = false;
    let restApplied = false;
    const appliedPaths = [];

    try {
        const editorSelect = wp?.data?.select?.("core/editor");
        const postId = Number(editorSelect?.getCurrentPostId?.() || 0);

        if (postId > 0) {
            // eslint-disable-next-line no-console
            console.info("[madeit-yoast-meta-title] trying REST meta save", { postId });
            const restPayload = await wp.apiFetch({
                path: "/madeit-ai/v1/yoast/meta-title",
                method: "POST",
                data: {
                    postId,
                    metaTitle: sanitized,
                },
            });

            const savedValue = sanitizeMetaTitle(restPayload?.metaTitle || "");
            if (restPayload?.success && savedValue === sanitized) {
                restApplied = true;
                applied = true;
                appliedPaths.push("rest_api_meta");
                // eslint-disable-next-line no-console
                console.info("[madeit-yoast-meta-title] REST meta save succeeded", {
                    postId,
                    savedValue,
                    changed: !!restPayload?.changed,
                });
            } else {
                // eslint-disable-next-line no-console
                console.warn("[madeit-yoast-meta-title] REST meta save mismatch", {
                    postId,
                    requested: sanitized,
                    restPayload,
                });
            }
        } else {
            // eslint-disable-next-line no-console
            console.warn("[madeit-yoast-meta-title] no valid postId for REST meta save");
        }
    } catch (restError) {
        // eslint-disable-next-line no-console
        console.error("[madeit-yoast-meta-title] REST meta save failed", {
            error: restError?.message || "unknown_error",
        });
    }

    try {
        const yoastDispatch = wp?.data?.dispatch?.("yoast-seo/editor");
        if (yoastDispatch) {
            const candidateActions = [
                "setTitle",
                "setSeoTitle",
                "setSnippetTitle",
                "setSnippetEditorTitle",
                "setMetaTitle",
            ];

            for (let i = 0; i < candidateActions.length; i += 1) {
                const actionName = candidateActions[i];
                if (typeof yoastDispatch[actionName] === "function") {
                    try {
                        // eslint-disable-next-line no-console
                        console.info("[madeit-yoast-meta-title] trying yoast dispatch action", {
                            actionName,
                        });
                        yoastDispatch[actionName](sanitized);
                        applied = true;
                        appliedPaths.push("yoast_store:" + actionName);
                        // eslint-disable-next-line no-console
                        console.info("[madeit-yoast-meta-title] yoast dispatch action succeeded", {
                            actionName,
                            afterAction: getYoastMetaTitleDebugSnapshot(),
                        });
                        break;
                    } catch (dispatchError) {
                        // eslint-disable-next-line no-console
                        console.error("[madeit-yoast-meta-title] yoast dispatch action failed", {
                            actionName,
                            error: dispatchError?.message || "unknown_error",
                        });
                    }
                }
            }

            if (!applied && typeof yoastDispatch.setSnippetEditorData === "function") {
                try {
                    // eslint-disable-next-line no-console
                    console.info("[madeit-yoast-meta-title] trying setSnippetEditorData fallback");
                    yoastDispatch.setSnippetEditorData({ title: sanitized });
                    applied = true;
                    appliedPaths.push("yoast_store:setSnippetEditorData");
                    // eslint-disable-next-line no-console
                    console.info("[madeit-yoast-meta-title] setSnippetEditorData succeeded", {
                        afterAction: getYoastMetaTitleDebugSnapshot(),
                    });
                } catch (dispatchError) {
                    // eslint-disable-next-line no-console
                    console.error("[madeit-yoast-meta-title] setSnippetEditorData failed", {
                        error: dispatchError?.message || "unknown_error",
                    });
                }
            }
        } else {
            // eslint-disable-next-line no-console
            console.warn("[madeit-yoast-meta-title] yoast dispatch store not available");
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[madeit-yoast-meta-title] yoast dispatch block failed", {
            error: error?.message || "unknown_error",
        });
    }

    try {
        const coreEditorDispatch = wp?.data?.dispatch?.("core/editor");
        if (coreEditorDispatch?.editPost) {
            // eslint-disable-next-line no-console
            console.info("[madeit-yoast-meta-title] trying core/editor meta fallback");
            const editorSelect = wp?.data?.select?.("core/editor");
            const currentMeta = editorSelect?.getEditedPostAttribute?.("meta") || {};

            coreEditorDispatch.editPost({
                meta: {
                    ...currentMeta,
                    _yoast_wpseo_title: sanitized,
                },
            });
            applied = true;
            appliedPaths.push("core_editor_meta");
            // eslint-disable-next-line no-console
            console.info("[madeit-yoast-meta-title] core/editor meta fallback succeeded", {
                afterAction: getYoastMetaTitleDebugSnapshot(),
            });
        } else {
            // eslint-disable-next-line no-console
            console.warn("[madeit-yoast-meta-title] core/editor editPost not available");
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[madeit-yoast-meta-title] core/editor fallback failed", {
            error: error?.message || "unknown_error",
        });
    }

    const inputSelectors = [
        "#yoast_wpseo_title",
        "input[name='yoast_wpseo_title']",
        "textarea[name='yoast_wpseo_title']",
        "#snippet-editor-title",
        "#snippet-editor-title-metabox",
        "input[id*='snippet-editor-title']",
        "input[id*='yoast-snippet-editor-title']",
        "input[name='snippet-editor-title']",
        "input[data-testid='snippet-editor-title']",
        "input[aria-label='SEO title']",
    ];

    const seenInputs = new Set();
    let domApplied = false;
    for (let i = 0; i < inputSelectors.length; i += 1) {
        const selector = inputSelectors[i];
        const inputs = Array.from(document.querySelectorAll(selector));

        for (let j = 0; j < inputs.length; j += 1) {
            const input = inputs[j];
            if (!input || seenInputs.has(input)) {
                continue;
            }

            seenInputs.add(input);
            // eslint-disable-next-line no-console
            console.info("[madeit-yoast-meta-title] trying DOM input fallback", { selector });
            setNativeFieldValue(input, sanitized);
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
            input.dispatchEvent(new Event("blur", { bubbles: true }));
            input.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "Enter" }));
            domApplied = true;
            applied = true;
            appliedPaths.push("dom_input:" + selector);
            // eslint-disable-next-line no-console
            console.info("[madeit-yoast-meta-title] DOM input fallback succeeded", {
                selector,
                afterAction: getYoastMetaTitleDebugSnapshot(),
            });
        }
    }

    if (domApplied) {
        // eslint-disable-next-line no-console
        console.info("[madeit-yoast-meta-title] DOM sync completed", { appliedPaths });
    }

    if (applied) {
        // eslint-disable-next-line no-console
        console.info("[madeit-yoast-meta-title] apply success", {
            appliedPaths,
            finalState: getYoastMetaTitleDebugSnapshot(),
        });
        return { applied: true, restApplied, appliedPaths };
    }

    // eslint-disable-next-line no-console
    console.error("[madeit-yoast-meta-title] apply failed on all paths", {
        appliedPaths,
        finalState: getYoastMetaTitleDebugSnapshot(),
    });
    return { applied: false, restApplied, appliedPaths };
}

async function applyYoastMetaDescription(metaDescription) {
    const sanitized = sanitizeMetaDescription(metaDescription);
    if (!sanitized) {
        // eslint-disable-next-line no-console
        console.warn("[madeit-yoast-meta-description] empty meta description after sanitize", {
            metaDescription,
        });
        return { applied: false, restApplied: false, appliedPaths: [] };
    }

    let applied = false;
    let restApplied = false;
    const appliedPaths = [];

    try {
        const editorSelect = wp?.data?.select?.("core/editor");
        const postId = Number(editorSelect?.getCurrentPostId?.() || 0);

        if (postId > 0) {
            const restPayload = await wp.apiFetch({
                path: "/madeit-ai/v1/yoast/meta-description",
                method: "POST",
                data: {
                    postId,
                    metaDescription: sanitized,
                },
            });

            const savedValue = sanitizeMetaDescription(restPayload?.metaDescription || "");
            if (restPayload?.success && savedValue === sanitized) {
                restApplied = true;
                applied = true;
                appliedPaths.push("rest_api_meta_description");
            }
        }
    } catch (restError) {
        // eslint-disable-next-line no-console
        console.error("[madeit-yoast-meta-description] REST meta save failed", {
            error: restError?.message || "unknown_error",
        });
    }

    try {
        const coreEditorDispatch = wp?.data?.dispatch?.("core/editor");
        if (coreEditorDispatch?.editPost) {
            const editorSelect = wp?.data?.select?.("core/editor");
            const currentMeta = editorSelect?.getEditedPostAttribute?.("meta") || {};

            coreEditorDispatch.editPost({
                meta: {
                    ...currentMeta,
                    _yoast_wpseo_metadesc: sanitized,
                },
            });

            applied = true;
            appliedPaths.push("core_editor_metadesc");
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[madeit-yoast-meta-description] core/editor fallback failed", {
            error: error?.message || "unknown_error",
        });
    }

    const inputSelectors = [
        "#yoast_wpseo_metadesc",
        "textarea[name='yoast_wpseo_metadesc']",
        "#snippet-editor-meta-description",
        "textarea[id*='snippet-editor-meta-description']",
        "textarea[name='snippet-editor-meta-description']",
        "textarea[aria-label='Meta description']",
    ];

    const seenInputs = new Set();
    for (let i = 0; i < inputSelectors.length; i += 1) {
        const selector = inputSelectors[i];
        const inputs = Array.from(document.querySelectorAll(selector));

        for (let j = 0; j < inputs.length; j += 1) {
            const input = inputs[j];
            if (!input || seenInputs.has(input)) {
                continue;
            }

            seenInputs.add(input);
            setNativeFieldValue(input, sanitized);
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
            input.dispatchEvent(new Event("blur", { bubbles: true }));
            applied = true;
            appliedPaths.push("dom_input:" + selector);
        }
    }

    return { applied, restApplied, appliedPaths };
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
    altTags: {
        key: "altTags",
        label: __("ALT tags", "madeit"),
        description: __("Vul ontbrekende alt-teksten voor afbeeldingen automatisch aan.", "madeit"),
    },
    ctaOptimization: {
        key: "ctaOptimization",
        label: __("CTA-optimalisatie", "madeit"),
        description: __("Krijg CTA-voorstellen en keur wijzigingen manueel goed.", "madeit"),
    },
    yoastKeyword: {
        key: "yoastKeyword",
        label: __("Focus keyword", "madeit"),
        description: __("Genereer een Yoast focus keyword op basis van titel en inhoud.", "madeit"),
    },
    yoastMetaTitle: {
        key: "yoastMetaTitle",
        label: __("Meta titel", "madeit"),
        description: __("Genereer een Yoast SEO-titel met placeholders.", "madeit"),
    },
    yoastMetaDescription: {
        key: "yoastMetaDescription",
        label: __("Meta beschrijving", "madeit"),
        description: __("Genereer een Yoast SEO meta beschrijving.", "madeit"),
    },
    autoBlocks: {
        key: "autoBlocks",
        label: __("Auto blokken", "madeit"),
        description: __("Genereer automatisch contentblokken in madeit containers.", "madeit"),
    },
    deleteBlock: {
        key: "deleteBlock",
        label: __("Blok verwijderen", "madeit"),
        description: __("Beschrijf welk blok weg mag. AI kiest een clientId en verwijdert dat blok.", "madeit"),
    },
};

function ModuleSelector({ selectedModule, onSelect, yoastActive }) {
    const modules = Object.values(SIDEBAR_MODULES).filter((moduleItem) => {
        if (
            moduleItem.key === SIDEBAR_MODULES.yoastKeyword.key ||
            moduleItem.key === SIDEBAR_MODULES.yoastMetaTitle.key ||
            moduleItem.key === SIDEBAR_MODULES.yoastMetaDescription.key
        ) {
            return !!yoastActive;
        }

        return true;
    });

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

function ChatModule({
    uiChat,
    message,
    setMessage,
    isLoading,
    hasScrolled,
    handleSendMessage,
    handleResetChat,
}) {
    const textareaRef = useRef(null);

    const resizeTextarea = useCallback((element) => {
        if (!element) {
            return;
        }

        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
    }, []);

    useEffect(() => {
        resizeTextarea(textareaRef.current);
    }, [message, resizeTextarea]);

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
            { className: "madeit-chat-reset-row" },
            React.createElement(
                Button,
                {
                    variant: "tertiary",
                    className: "madeit-reset-button",
                    onClick: handleResetChat,
                    disabled: isLoading || uiChat.length === 0,
                },
                __("Reset", "madeit")
            )
        ),
        React.createElement(
            "div",
            { className: "madeit-input-container" },
            React.createElement(
                "div",
                { className: "madeit-textarea-wrap" },
                React.createElement("textarea", {
                    ref: textareaRef,
                    className: "madeit-textarea",
                    value: message,
                    onChange: (event) => setMessage(event.target.value),
                    onInput: (event) => resizeTextarea(event.target),
                    placeholder: __("Write a message...", "madeit"),
                    rows: 1,
                    style: { overflow: "hidden" },
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
                    "Klik op Start om de taalcontrole te starten.",
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
                        : React.createElement(
                              "p",
                              { className: "madeit-language-no-issues" },
                              __("Geen verbeteringen gevonden. De tekst lijkt correct.", "madeit")
                          )
                )
        )
    );
}

function CtaOptimizationModule({
    blockCount,
    ctaResult,
    ctaIssues,
    acceptedCtaIssues,
    isLoading,
    handleCtaCheck,
    handleAcceptCtaIssue,
    handleFocusCtaIssue,
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
                __("Klik op Start om CTA-voorstellen te genereren.", "madeit")
            ),
            React.createElement(
                "p",
                { className: "madeit-language-meta" },
                __("Gevonden blocks:", "madeit") + " " + String(blockCount)
            ),
            React.createElement(
                "div",
                { className: "madeit-language-actions" },
                React.createElement(
                    Button,
                    {
                        variant: "primary",
                        onClick: handleCtaCheck,
                        isBusy: isLoading,
                        disabled: isLoading || blockCount === 0,
                    },
                    isLoading
                        ? __("Bezig met analyseren...", "madeit")
                        : __("Start", "madeit")
                )
            ),
            ctaResult &&
                React.createElement(
                    "div",
                    { className: "madeit-language-result" },
                    React.createElement("h3", null, __("CTA-voorstellen", "madeit")),
                    Array.isArray(ctaIssues) && ctaIssues.length > 0
                        ? React.createElement(
                              "div",
                              { className: "madeit-language-issues" },
                              ctaIssues.map((issue, index) =>
                                  React.createElement(
                                      "div",
                                      { key: index, className: "madeit-language-issue" },
                                      React.createElement(
                                          "p",
                                          { className: "madeit-language-issue-label" },
                                          __("Huidige CTA", "madeit")
                                      ),
                                      React.createElement(
                                          "p",
                                          {
                                              className: "madeit-language-issue-source",
                                              role: "button",
                                              tabIndex: 0,
                                              onClick: () => handleFocusCtaIssue(index),
                                              onKeyDown: (event) => {
                                                  if (
                                                      event.key === "Enter" ||
                                                      event.key === " "
                                                  ) {
                                                      event.preventDefault();
                                                      handleFocusCtaIssue(index);
                                                  }
                                              },
                                          },
                                          renderSourceWithHighlight(String(issue.source || ""))
                                      ),
                                      React.createElement(
                                          "p",
                                          { className: "madeit-language-issue-label" },
                                          __("Voorstel", "madeit")
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
                                                  onClick: () => handleAcceptCtaIssue(index),
                                                  disabled: !!acceptedCtaIssues[index] || isLoading,
                                              },
                                              acceptedCtaIssues[index]
                                                  ? __("Toegepast", "madeit")
                                                  : __("Accepteer", "madeit")
                                          ),
                                          React.createElement(
                                              Button,
                                              {
                                                  variant: "tertiary",
                                                  onClick: () => handleFocusCtaIssue(index),
                                              },
                                              __("Ga naar CTA", "madeit")
                                          )
                                      )
                                  )
                              )
                          )
                        : React.createElement(
                              "p",
                              { className: "madeit-language-no-issues" },
                              __("Geen CTA-verbeteringen gevonden.", "madeit")
                          )
                )
        )
    );
}

function AltTagsModule({
    missingAltCount,
    isLoading,
    altProgress,
    altSummary,
    handleGenerateAltTags,
}) {
    const progressPercent = altProgress.total > 0
        ? Math.round((altProgress.done / altProgress.total) * 100)
        : 0;

    return React.createElement(
        Fragment,
        null,
        React.createElement(
            "div",
            { className: "madeit-alt-module" },
            React.createElement(
                "p",
                { className: "madeit-alt-intro" },
                __(
                    "Deze module zoekt afbeeldingen zonder alt-tag en vult ze een voor een in via AI.",
                    "madeit"
                )
            ),
            React.createElement(
                "p",
                { className: "madeit-alt-meta" },
                __("Afbeeldingen zonder alt:", "madeit") + " " + String(missingAltCount)
            ),
            React.createElement(
                "div",
                { className: "madeit-alt-actions" },
                React.createElement(
                    Button,
                    {
                        variant: "primary",
                        onClick: handleGenerateAltTags,
                        isBusy: isLoading,
                        disabled: isLoading || missingAltCount === 0,
                    },
                    isLoading ? __("Bezig...", "madeit") : __("Start", "madeit")
                )
            ),
            (isLoading || altProgress.total > 0) &&
                React.createElement(
                    "div",
                    { className: "madeit-alt-progress" },
                    React.createElement(
                        "div",
                        { className: "madeit-alt-progress-head" },
                        React.createElement(
                            "span",
                            null,
                            __("Voortgang", "madeit") +
                                ": " +
                                String(altProgress.done) +
                                "/" +
                                String(altProgress.total)
                        ),
                        React.createElement("span", null, String(progressPercent) + "%")
                    ),
                    React.createElement(
                        "div",
                        { className: "madeit-alt-progress-track" },
                        React.createElement("div", {
                            className: "madeit-alt-progress-bar",
                            style: { width: String(progressPercent) + "%" },
                        })
                    ),
                    altProgress.current &&
                        React.createElement(
                            "p",
                            { className: "madeit-alt-progress-current" },
                            altProgress.current
                        )
                ),
            altSummary.total > 0 &&
                React.createElement(
                    "p",
                    { className: "madeit-alt-summary" },
                    __("Klaar", "madeit") +
                        ": " +
                        String(altSummary.updated) +
                        " " +
                        __("aangepast", "madeit") +
                        ", " +
                        String(altSummary.skipped) +
                        " " +
                        __("overgeslagen", "madeit") +
                        ", " +
                        String(altSummary.failed) +
                        " " +
                        __("fouten", "madeit")
                )
        )
    );
}

function YoastKeywordModule({
    isLoading,
    generatedKeyword,
    yoastApplyStatus,
    handleGenerateFocusKeyword,
}) {
    return React.createElement(
        Fragment,
        null,
        React.createElement(
            "div",
            { className: "madeit-yoast-module" },
            React.createElement(
                "p",
                { className: "madeit-yoast-intro" },
                __(
                    "Genereer een focus keyword op basis van titel en paginainhoud.",
                    "madeit"
                )
            ),
            React.createElement(
                "div",
                { className: "madeit-yoast-actions" },
                React.createElement(
                    Button,
                    {
                        variant: "primary",
                        isBusy: isLoading,
                        onClick: handleGenerateFocusKeyword,
                        disabled: isLoading,
                    },
                    isLoading ? __("Bezig...", "madeit") : __("Genereer focus keyword", "madeit")
                )
            ),
            generatedKeyword &&
                React.createElement(
                    "div",
                    { className: "madeit-yoast-result" },
                    React.createElement("p", { className: "madeit-yoast-label" }, __("Keyword", "madeit")),
                    React.createElement("p", { className: "madeit-yoast-keyword" }, generatedKeyword),
                    yoastApplyStatus &&
                        React.createElement("p", { className: "madeit-yoast-status" }, yoastApplyStatus)
                )
        )
    );
}

function YoastMetaTitleModule({
    isLoading,
    generatedMetaTitle,
    yoastMetaApplyStatus,
    handleGenerateMetaTitle,
}) {
    return React.createElement(
        Fragment,
        null,
        React.createElement(
            "div",
            { className: "madeit-yoast-module" },
            React.createElement(
                "p",
                { className: "madeit-yoast-intro" },
                __(
                    "Genereer een Yoast SEO meta titel.",
                    "madeit"
                )
            ),
            React.createElement(
                "div",
                { className: "madeit-yoast-actions" },
                React.createElement(
                    Button,
                    {
                        variant: "primary",
                        isBusy: isLoading,
                        onClick: handleGenerateMetaTitle,
                        disabled: isLoading,
                    },
                    isLoading ? __("Bezig...", "madeit") : __("Genereer meta titel", "madeit")
                )
            ),
            generatedMetaTitle &&
                React.createElement(
                    "div",
                    { className: "madeit-yoast-result" },
                    React.createElement("p", { className: "madeit-yoast-label" }, __("Meta titel", "madeit")),
                    React.createElement("p", { className: "madeit-yoast-keyword" }, generatedMetaTitle),
                    yoastMetaApplyStatus &&
                        React.createElement("p", { className: "madeit-yoast-status" }, yoastMetaApplyStatus)
                )
        )
    );
}

function YoastMetaDescriptionModule({
    isLoading,
    generatedMetaDescription,
    yoastMetaDescriptionApplyStatus,
    handleGenerateMetaDescription,
}) {
    return React.createElement(
        Fragment,
        null,
        React.createElement(
            "div",
            { className: "madeit-yoast-module" },
            React.createElement(
                "p",
                { className: "madeit-yoast-intro" },
                __(
                    "Genereer een Yoast SEO meta beschrijving op basis van titel, content en focus keyword.",
                    "madeit"
                )
            ),
            React.createElement(
                "div",
                { className: "madeit-yoast-actions" },
                React.createElement(
                    Button,
                    {
                        variant: "primary",
                        isBusy: isLoading,
                        onClick: handleGenerateMetaDescription,
                        disabled: isLoading,
                    },
                    isLoading ? __("Bezig...", "madeit") : __("Genereer meta beschrijving", "madeit")
                )
            ),
            generatedMetaDescription &&
                React.createElement(
                    "div",
                    { className: "madeit-yoast-result" },
                    React.createElement(
                        "p",
                        { className: "madeit-yoast-label" },
                        __("Meta beschrijving", "madeit")
                    ),
                    React.createElement(
                        "p",
                        { className: "madeit-yoast-keyword" },
                        generatedMetaDescription
                    ),
                    yoastMetaDescriptionApplyStatus &&
                        React.createElement(
                            "p",
                            { className: "madeit-yoast-status" },
                            yoastMetaDescriptionApplyStatus
                        )
                )
        )
    );
}

function AutoBlocksModule({
    isLoading,
    autoBlocksPrompt,
    setAutoBlocksPrompt,
    autoBlocksStatus,
    handleGenerateAutoBlocks,
}) {
    return React.createElement(
        Fragment,
        null,
        React.createElement(
            "div",
            { className: "madeit-yoast-module" },
            React.createElement(
                "p",
                { className: "madeit-yoast-intro" },
                __(
                    "Genereer automatisch inhoud. Op root-niveau wordt altijd madeit/block-content gebruikt, met kolommen voor de effectieve inhoud.",
                    "madeit"
                )
            ),
            React.createElement("textarea", {
                className: "madeit-textarea",
                value: autoBlocksPrompt,
                onChange: (event) => setAutoBlocksPrompt(event.target.value),
                rows: 4,
                placeholder: __("Beschrijf welke secties en inhoud je wil genereren...", "madeit"),
            }),
            React.createElement(
                "div",
                { className: "madeit-yoast-actions" },
                React.createElement(
                    Button,
                    {
                        variant: "primary",
                        isBusy: isLoading,
                        onClick: handleGenerateAutoBlocks,
                        disabled: isLoading || autoBlocksPrompt.trim() === "",
                    },
                    isLoading ? __("Bezig...", "madeit") : __("Genereer blokken", "madeit")
                )
            ),
            autoBlocksStatus &&
                React.createElement(
                    "div",
                    { className: "madeit-yoast-result" },
                    React.createElement("p", { className: "madeit-yoast-status" }, autoBlocksStatus)
                )
        )
    );
}

function DeleteBlockModule({
    isLoading,
    deleteBlockPrompt,
    setDeleteBlockPrompt,
    deleteBlockStatus,
    handleDeleteBlock,
}) {
    return React.createElement(
        Fragment,
        null,
        React.createElement(
            "div",
            { className: "madeit-yoast-module" },
            React.createElement(
                "p",
                { className: "madeit-yoast-intro" },
                __(
                    "Beschrijf welk onderdeel verwijderd moet worden.",
                    "madeit"
                )
            ),
            React.createElement("textarea", {
                className: "madeit-textarea",
                value: deleteBlockPrompt,
                onChange: (event) => setDeleteBlockPrompt(event.target.value),
                rows: 4,
                placeholder: __("Bijv. verwijder de sectie met de oude prijstabel", "madeit"),
            }),
            React.createElement(
                "div",
                { className: "madeit-yoast-actions" },
                React.createElement(
                    Button,
                    {
                        variant: "primary",
                        isBusy: isLoading,
                        onClick: handleDeleteBlock,
                        disabled: isLoading || deleteBlockPrompt.trim() === "",
                    },
                    isLoading ? __("Bezig...", "madeit") : __("Zoek en verwijder blok", "madeit")
                )
            ),
            deleteBlockStatus &&
                React.createElement(
                    "div",
                    { className: "madeit-yoast-result" },
                    React.createElement("p", { className: "madeit-yoast-status" }, deleteBlockStatus)
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
    handleResetChat,
    blockCount,
    languageResult,
    languageIssues,
    acceptedIssues,
    handleLanguageCheck,
    handleAcceptIssue,
    handleFocusIssue,
    ctaResult,
    ctaIssues,
    acceptedCtaIssues,
    handleCtaCheck,
    handleAcceptCtaIssue,
    handleFocusCtaIssue,
    missingAltCount,
    altProgress,
    altSummary,
    handleGenerateAltTags,
    yoastActive,
    generatedFocusKeyword,
    yoastApplyStatus,
    handleGenerateFocusKeyword,
    generatedMetaTitle,
    yoastMetaApplyStatus,
    handleGenerateMetaTitle,
    generatedMetaDescription,
    yoastMetaDescriptionApplyStatus,
    handleGenerateMetaDescription,
    autoBlocksPrompt,
    setAutoBlocksPrompt,
    autoBlocksStatus,
    handleGenerateAutoBlocks,
    deleteBlockPrompt,
    setDeleteBlockPrompt,
    deleteBlockStatus,
    handleDeleteBlock,
}) {
    const showYoastModule = yoastActive && selectedModule === "yoastKeyword";
    const showYoastMetaTitleModule = yoastActive && selectedModule === "yoastMetaTitle";
    const showYoastMetaDescriptionModule = yoastActive && selectedModule === "yoastMetaDescription";

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
                yoastActive,
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
                : selectedModule === SIDEBAR_MODULES.ctaOptimization.key
                ? React.createElement(CtaOptimizationModule, {
                      blockCount,
                      ctaResult,
                      ctaIssues,
                      acceptedCtaIssues,
                      isLoading,
                      handleCtaCheck,
                      handleAcceptCtaIssue,
                      handleFocusCtaIssue,
                  })
                : selectedModule === SIDEBAR_MODULES.altTags.key
                ? React.createElement(AltTagsModule, {
                      missingAltCount,
                      isLoading,
                      altProgress,
                      altSummary,
                      handleGenerateAltTags,
                  })
                : showYoastModule
                ? React.createElement(YoastKeywordModule, {
                      isLoading,
                      generatedKeyword: generatedFocusKeyword,
                      yoastApplyStatus,
                      handleGenerateFocusKeyword,
                  })
                    : showYoastMetaTitleModule
                    ? React.createElement(YoastMetaTitleModule, {
                        isLoading,
                        generatedMetaTitle,
                        yoastMetaApplyStatus,
                        handleGenerateMetaTitle,
                    })
                : showYoastMetaDescriptionModule
                ? React.createElement(YoastMetaDescriptionModule, {
                      isLoading,
                      generatedMetaDescription,
                      yoastMetaDescriptionApplyStatus,
                      handleGenerateMetaDescription,
                  })
                    : selectedModule === SIDEBAR_MODULES.deleteBlock.key
                    ? React.createElement(DeleteBlockModule, {
                        isLoading,
                        deleteBlockPrompt,
                        setDeleteBlockPrompt,
                        deleteBlockStatus,
                        handleDeleteBlock,
                    })
                    : selectedModule === SIDEBAR_MODULES.autoBlocks.key
                    ? React.createElement(AutoBlocksModule, {
                        isLoading,
                        autoBlocksPrompt,
                        setAutoBlocksPrompt,
                        autoBlocksStatus,
                        handleGenerateAutoBlocks,
                    })
                : React.createElement(ChatModule, {
                      uiChat,
                      message,
                      setMessage,
                      isLoading,
                      hasScrolled,
                      handleSendMessage,
                      handleResetChat,
                  })
        )
    );
}

registerPlugin("madeit-chatbot-sidebar", {
    render: () => {
        const {
            insertBlocks,
            removeBlocks,
            updateBlockAttributes,
            selectBlock,
            __unstableMarkLastChangeAsPersistent,
        } = useDispatch("core/block-editor");
        const { createErrorNotice } = useDispatch(noticesStore);

        const [message, setMessage] = useState("");
        const [chatHistory, setChatHistory] = useState([]);
        const [uiChat, setUiChat] = useState([]);
        const [selectedModule, setSelectedModule] = useState(SIDEBAR_MODULES.chat.key);
        const [languageResult, setLanguageResult] = useState("");
        const [languageIssues, setLanguageIssues] = useState([]);
        const [acceptedIssues, setAcceptedIssues] = useState({});
        const [ctaResult, setCtaResult] = useState("");
        const [ctaIssues, setCtaIssues] = useState([]);
        const [acceptedCtaIssues, setAcceptedCtaIssues] = useState({});
        const [yoastActive, setYoastActive] = useState(false);
        const [generatedFocusKeyword, setGeneratedFocusKeyword] = useState("");
        const [yoastApplyStatus, setYoastApplyStatus] = useState("");
        const [generatedMetaTitle, setGeneratedMetaTitle] = useState("");
        const [yoastMetaApplyStatus, setYoastMetaApplyStatus] = useState("");
        const [generatedMetaDescription, setGeneratedMetaDescription] = useState("");
        const [yoastMetaDescriptionApplyStatus, setYoastMetaDescriptionApplyStatus] = useState("");
        const [autoBlocksPrompt, setAutoBlocksPrompt] = useState("");
        const [autoBlocksStatus, setAutoBlocksStatus] = useState("");
        const [deleteBlockPrompt, setDeleteBlockPrompt] = useState("");
        const [deleteBlockStatus, setDeleteBlockStatus] = useState("");
        const [missingAltCount, setMissingAltCount] = useState(0);
        const [altProgress, setAltProgress] = useState({ total: 0, done: 0, current: "" });
        const [altSummary, setAltSummary] = useState({ total: 0, updated: 0, skipped: 0, failed: 0 });
        const [blockCount, setBlockCount] = useState(0);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);
        const [hasScrolled, setHasScrolled] = useState(false);
        const [abortController, setAbortController] = useState(null);
        const [chatStorageKey, setChatStorageKey] = useState("");
        const chatStorageReadyRef = useRef(false);

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
                setMissingAltCount(countMissingImageAlts(blocks));
                setYoastActive(isYoastSeoActive());
            };

            getCurrentCount();

            const unsubscribe = wp.data.subscribe(() => {
                getCurrentCount();
            });

            return () => {
                unsubscribe();
            };
        }, []);

        useEffect(() => {
            const postId = Number(wp.data.select("core/editor")?.getCurrentPostId?.() || 0);
            const storageKey =
                "madeit_ai_chat_history_post_" + String(postId > 0 ? postId : "new");

            setChatStorageKey(storageKey);

            try {
                const raw = window.localStorage.getItem(storageKey);
                if (raw) {
                    const parsed = JSON.parse(raw);

                    if (Array.isArray(parsed?.chatHistory)) {
                        setChatHistory(parsed.chatHistory);
                    }

                    if (Array.isArray(parsed?.uiChat)) {
                        setUiChat(parsed.uiChat);
                    }
                }
            } catch (storageError) {
                // eslint-disable-next-line no-console
                console.warn("[madeit-chat] unable to load local chat history", storageError);
            } finally {
                chatStorageReadyRef.current = true;
            }
        }, []);

        useEffect(() => {
            if (!chatStorageReadyRef.current || !chatStorageKey) {
                return;
            }

            try {
                window.localStorage.setItem(
                    chatStorageKey,
                    JSON.stringify({
                        chatHistory,
                        uiChat,
                    })
                );
            } catch (storageError) {
                // eslint-disable-next-line no-console
                console.warn("[madeit-chat] unable to save local chat history", storageError);
            }
        }, [chatHistory, uiChat, chatStorageKey]);

        const cancelActiveRequest = () => {
            if (abortController) {
                abortController.abort();
                setAbortController(null);
                setIsLoading(false);
            }
        };

        const handleResetChat = () => {
            if (isLoading) {
                cancelActiveRequest();
            }

            setChatHistory([]);
            setUiChat([]);
            setMessage("");
            setHasScrolled(false);

            if (chatStorageKey) {
                try {
                    window.localStorage.removeItem(chatStorageKey);
                } catch (storageError) {
                    // eslint-disable-next-line no-console
                    console.warn("[madeit-chat] unable to clear local chat history", storageError);
                }
            }
        };

        const handleGenerateFocusKeyword = async () => {
            if (isLoading) {
                cancelActiveRequest();
                return;
            }

            const context = collectPostContextForKeyword();
            if (!context.title && (!Array.isArray(context.blocks) || context.blocks.length === 0)) {
                createErrorNotice(__("Er is onvoldoende inhoud om een keyword te genereren.", "madeit"), {
                    type: "default",
                });
                return;
            }

            setIsLoading(true);
            setGeneratedFocusKeyword("");
            setYoastApplyStatus("");

            const controller =
                typeof AbortController === "undefined" ? undefined : new AbortController();

            setAbortController(controller || null);

            try {
                const completionResponse = await wp.apiFetch({
                    path: "/madeit-ai/v1/chat/completions",
                    method: "POST",
                    data: {
                        messages: [
                            {
                                role: "system",
                                content:
                                    "Je bent een SEO-assistent. Geef exact 1 focus keyword terug in het Nederlands (max 4 woorden), zonder extra uitleg, zonder aanhalingstekens en zonder leestekens op het einde.",
                            },
                            {
                                role: "user",
                                content:
                                    "Titel:\n" +
                                    (context.title || "(geen titel)") +
                                    "\n\nInhoud (blocks):\n" +
                                    JSON.stringify(context.blocks),
                            },
                        ],
                    },
                    signal: controller?.signal,
                });

                const payload = completionResponse.data
                    ? completionResponse.data
                    : completionResponse;
                const responseText = String(payload?.choices?.[0]?.message?.content || "").trim();
                const keyword = sanitizeKeyword(responseText.split("\n")[0] || "");

                if (!keyword) {
                    createErrorNotice(__("Er kon geen focus keyword worden gegenereerd.", "madeit"), {
                        type: "default",
                    });
                    return;
                }

                setGeneratedFocusKeyword(keyword);

                const applied = applyYoastFocusKeyword(keyword);
                if (applied) {
                    setYoastApplyStatus(__("Keyword toegepast in Yoast SEO.", "madeit"));
                } else {
                    setYoastApplyStatus(
                        __("Keyword gegenereerd, maar niet automatisch toegepast in Yoast.", "madeit")
                    );
                }
            } catch (requestError) {
                if (requestError.name === "AbortError") {
                    createErrorNotice(__("Focus keyword generatie geannuleerd.", "madeit"), {
                        type: "snackbar",
                    });
                } else {
                    createErrorNotice(
                        requestError.message || __("Onbekende fout bij focus keyword generatie.", "madeit"),
                        { type: "default" }
                    );
                }
            } finally {
                setIsLoading(false);
                setAbortController(null);
            }
        };

        const handleGenerateMetaTitle = async () => {
            if (isLoading) {
                cancelActiveRequest();
                return;
            }

            const context = collectPostContextForKeyword();
            if (!context.title && (!Array.isArray(context.blocks) || context.blocks.length === 0)) {
                createErrorNotice(__("Er is onvoldoende inhoud om een meta titel te genereren.", "madeit"), {
                    type: "default",
                });
                return;
            }

            const existingKeyword = getYoastFocusKeyword();

            setIsLoading(true);
            setGeneratedMetaTitle("");
            setYoastMetaApplyStatus("");

            const controller =
                typeof AbortController === "undefined" ? undefined : new AbortController();

            setAbortController(controller || null);

            try {
                const completionResponse = await wp.apiFetch({
                    path: "/madeit-ai/v1/chat/completions",
                    method: "POST",
                    data: {
                        messages: [
                            {
                                role: "system",
                                content:
                                    "Je bent een SEO-assistent voor Yoast. Geef exact 1 SEO meta titel terug zonder extra uitleg. Gebruik Yoast placeholders waar relevant, zoals %%title%%, %%sep%% en %%sitename%%. Gebruik de focus keyword natuurlijk indien beschikbaar. Geen markdown, geen bullets, geen aanhalingstekens.",
                            },
                            {
                                role: "user",
                                content:
                                    "Titel:\n" +
                                    (context.title || "(geen titel)") +
                                    "\n\nFocus keyword:\n" +
                                    (existingKeyword || "(geen focus keyword)") +
                                    "\n\nInhoud (blocks):\n" +
                                    JSON.stringify(context.blocks),
                            },
                        ],
                    },
                    signal: controller?.signal,
                });

                const payload = completionResponse.data
                    ? completionResponse.data
                    : completionResponse;
                const responseText = String(payload?.choices?.[0]?.message?.content || "").trim();
                const metaTitle = sanitizeMetaTitle(responseText.split("\n")[0] || "");

                // eslint-disable-next-line no-console
                console.info("[madeit-yoast-meta-title] generated candidate", {
                    existingKeyword,
                    responseText,
                    metaTitle,
                });

                if (!metaTitle) {
                    createErrorNotice(__("Er kon geen meta titel worden gegenereerd.", "madeit"), {
                        type: "default",
                    });
                    return;
                }

                setGeneratedMetaTitle(metaTitle);

                const applyResult = await applyYoastMetaTitle(metaTitle);
                const applied = !!applyResult?.applied;
                // eslint-disable-next-line no-console
                console.info("[madeit-yoast-meta-title] apply result", {
                    applied,
                    metaTitle,
                    applyResult,
                });
                if (applied) {
                    setYoastMetaApplyStatus(__("Meta titel toegepast in Yoast SEO.", "madeit"));

                    if (applyResult?.restApplied) {
                        setYoastMetaApplyStatus(
                            __("Meta titel opgeslagen via REST API. Pagina wordt herladen...", "madeit")
                        );

                        window.setTimeout(() => {
                            window.location.reload();
                        }, 700);
                    }
                } else {
                    setYoastMetaApplyStatus(
                        __("Meta titel gegenereerd, maar niet automatisch toegepast in Yoast.", "madeit")
                    );
                }
            } catch (requestError) {
                if (requestError.name === "AbortError") {
                    createErrorNotice(__("Meta titel generatie geannuleerd.", "madeit"), {
                        type: "snackbar",
                    });
                } else {
                    createErrorNotice(
                        requestError.message || __("Onbekende fout bij meta titel generatie.", "madeit"),
                        { type: "default" }
                    );
                }
            } finally {
                setIsLoading(false);
                setAbortController(null);
            }
        };

        const handleGenerateMetaDescription = async () => {
            if (isLoading) {
                cancelActiveRequest();
                return;
            }

            const context = collectPostContextForKeyword();
            if (!context.title && (!Array.isArray(context.blocks) || context.blocks.length === 0)) {
                createErrorNotice(
                    __("Er is onvoldoende inhoud om een meta beschrijving te genereren.", "madeit"),
                    { type: "default" }
                );
                return;
            }

            const existingKeyword = getYoastFocusKeyword();

            setIsLoading(true);
            setGeneratedMetaDescription("");
            setYoastMetaDescriptionApplyStatus("");

            const controller =
                typeof AbortController === "undefined" ? undefined : new AbortController();

            setAbortController(controller || null);

            try {
                const completionResponse = await wp.apiFetch({
                    path: "/madeit-ai/v1/chat/completions",
                    method: "POST",
                    data: {
                        messages: [
                            {
                                role: "system",
                                content:
                                    "Je bent een SEO-assistent voor Yoast. Geef exact 1 meta beschrijving terug in het Nederlands, zonder extra uitleg, zonder markdown of aanhalingstekens. Houd de lengte tussen 130 en 160 tekens en verwerk de focus keyword natuurlijk als die beschikbaar is.",
                            },
                            {
                                role: "user",
                                content:
                                    "Titel:\n" +
                                    (context.title || "(geen titel)") +
                                    "\n\nFocus keyword:\n" +
                                    (existingKeyword || "(geen focus keyword)") +
                                    "\n\nInhoud (blocks):\n" +
                                    JSON.stringify(context.blocks),
                            },
                        ],
                    },
                    signal: controller?.signal,
                });

                const payload = completionResponse.data
                    ? completionResponse.data
                    : completionResponse;
                const responseText = String(payload?.choices?.[0]?.message?.content || "").trim();
                const metaDescription = sanitizeMetaDescription(responseText.split("\n")[0] || "");

                if (!metaDescription) {
                    createErrorNotice(
                        __("Er kon geen meta beschrijving worden gegenereerd.", "madeit"),
                        { type: "default" }
                    );
                    return;
                }

                setGeneratedMetaDescription(metaDescription);

                const applyResult = await applyYoastMetaDescription(metaDescription);
                const applied = !!applyResult?.applied;
                if (applied) {
                    setYoastMetaDescriptionApplyStatus(
                        __("Meta beschrijving toegepast in Yoast SEO.", "madeit")
                    );

                    if (applyResult?.restApplied) {
                        setYoastMetaDescriptionApplyStatus(
                            __("Meta beschrijving opgeslagen via REST API. Pagina wordt herladen...", "madeit")
                        );

                        window.setTimeout(() => {
                            window.location.reload();
                        }, 700);
                    }
                } else {
                    setYoastMetaDescriptionApplyStatus(
                        __("Meta beschrijving gegenereerd, maar niet automatisch toegepast in Yoast.", "madeit")
                    );
                }
            } catch (requestError) {
                if (requestError.name === "AbortError") {
                    createErrorNotice(__("Meta beschrijving generatie geannuleerd.", "madeit"), {
                        type: "snackbar",
                    });
                } else {
                    createErrorNotice(
                        requestError.message || __("Onbekende fout bij meta beschrijving generatie.", "madeit"),
                        { type: "default" }
                    );
                }
            } finally {
                setIsLoading(false);
                setAbortController(null);
            }
        };

        const handleGenerateAutoBlocks = async () => {
            if (isLoading) {
                cancelActiveRequest();
                return;
            }

            const prompt = String(autoBlocksPrompt || "").trim();
            if (!prompt) {
                createErrorNotice(__("Geef eerst een beschrijving op voor de blokken.", "madeit"), {
                    type: "default",
                });
                return;
            }

            setIsLoading(true);
            setAutoBlocksStatus("");

            const controller =
                typeof AbortController === "undefined" ? undefined : new AbortController();

            setAbortController(controller || null);

            try {
                const currentBlocks = wp.data.select("core/block-editor").getBlocks() || [];
                const currentStructure = buildLanguageCheckSnapshot(currentBlocks);
                const selectedClientId =
                    wp.data.select("core/block-editor")?.getSelectedBlockClientId?.() || "";

                const parsed = await requestLayoutJson({
                    prompt,
                    selectedClientId,
                    currentStructure,
                    signal: controller?.signal,
                });

                if (!parsed) {
                    createErrorNotice(__("De AI gaf geen valide JSON terug.", "madeit"), {
                        type: "default",
                    });
                    return;
                }

                const sections = normalizeAutoBlockSections(parsed);
                const insertSpec = normalizeAutoInsertSpec(parsed);
                const effectiveClientId = insertSpec.clientId || selectedClientId;
                const madeitBlocks = createMadeitContentBlocksFromSections(sections);

                if (madeitBlocks.length === 0) {
                    createErrorNotice(
                        __("Er konden geen geldige blokken worden opgebouwd uit de AI-output.", "madeit"),
                        { type: "default" }
                    );
                    return;
                }

                const latestBlocks = wp.data.select("core/block-editor").getBlocks() || [];
                const insertionIndex = effectiveClientId
                    ? resolveRootInsertIndexByClientId(
                          latestBlocks,
                          effectiveClientId,
                          insertSpec.position
                      )
                    : null;

                if (Number.isInteger(insertionIndex)) {
                    insertBlocks(madeitBlocks, insertionIndex);
                    setAutoBlocksStatus(
                        __("Klaar. Toegevoegd op positie", "madeit") +
                            " " +
                            String(insertionIndex) +
                            " (" +
                            insertSpec.position +
                            ")."
                    );
                } else {
                    insertBlocks(madeitBlocks);
                    setAutoBlocksStatus(
                        __("Klaar. Toegevoegde root containers:", "madeit") +
                            " " +
                            String(madeitBlocks.length) +
                            (effectiveClientId
                                ? " (fallback append; clientId niet gevonden)"
                                : "")
                    );
                }
            } catch (requestError) {
                if (requestError.name === "AbortError") {
                    createErrorNotice(__("Generatie geannuleerd.", "madeit"), {
                        type: "snackbar",
                    });
                } else {
                    createErrorNotice(
                        requestError.message || __("Onbekende fout bij blokgeneratie.", "madeit"),
                        { type: "default" }
                    );
                }
            } finally {
                setIsLoading(false);
                setAbortController(null);
            }
        };

        const handleDeleteBlock = async () => {
            if (isLoading) {
                cancelActiveRequest();
                return;
            }

            const prompt = String(deleteBlockPrompt || "").trim();
            if (!prompt) {
                createErrorNotice(__("Geef eerst aan welk blok verwijderd moet worden.", "madeit"), {
                    type: "default",
                });
                return;
            }

            setIsLoading(true);
            setDeleteBlockStatus("");

            const controller =
                typeof AbortController === "undefined" ? undefined : new AbortController();

            setAbortController(controller || null);

            try {
                const currentBlocks = wp.data.select("core/block-editor").getBlocks() || [];
                const currentStructure = buildLanguageCheckSnapshot(currentBlocks);
                const parsed = await requestDeleteBlockJson({
                    prompt,
                    currentStructure,
                    signal: controller?.signal,
                });
                const resolvedClientId = sanitizeClientId(parsed?.clientId);

                if (!resolvedClientId) {
                    createErrorNotice(
                        __(
                            "De AI kon geen geldige clientId kiezen voor verwijdering.",
                            "madeit"
                        ),
                        { type: "default" }
                    );
                    return;
                }

                const blockEditorSelect = wp.data.select("core/block-editor");
                const targetBlock = blockEditorSelect.getBlock(resolvedClientId);

                if (!targetBlock) {
                    createErrorNotice(
                        __(
                            "De gekozen clientId bestaat niet meer in de huidige editor.",
                            "madeit"
                        ),
                        { type: "default" }
                    );
                    setDeleteBlockStatus(
                        __("Geen verwijdering uitgevoerd. clientId niet gevonden:", "madeit") +
                            " " +
                            resolvedClientId
                    );
                    return;
                }

                removeBlocks([resolvedClientId], false);
                if (typeof __unstableMarkLastChangeAsPersistent === "function") {
                    __unstableMarkLastChangeAsPersistent();
                }

                setDeleteBlockStatus(
                    __("Blok verwijderd met clientId:", "madeit") + " " + resolvedClientId
                );
            } catch (requestError) {
                if (requestError.name === "AbortError") {
                    createErrorNotice(__("Verwijderen geannuleerd.", "madeit"), {
                        type: "snackbar",
                    });
                } else {
                    createErrorNotice(
                        requestError.message || __("Onbekende fout bij verwijderen.", "madeit"),
                        { type: "default" }
                    );
                }
            } finally {
                setIsLoading(false);
                setAbortController(null);
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
                                    "Je bent een taalassistent. Je ontvangt de actuele Gutenberg block-state als JSON (met clientId, attributes en serializedHtml). Geef ALLEEN geldige JSON terug (geen markdown of extra tekst) met dit formaat: {\"issues\":[{\"source\":\"...\",\"fix\":\"...\",\"clientId\":\"...\",\"positie\":\"...\"}]}. Voeg ALLEEN een issue toe wanneer er een echte taal- of spellingsfout is. Doe GEEN stijlvoorstellen of herschrijvingen als de tekst al correct is. Als er geen echte fouten zijn, geef exact terug: {\"issues\":[]}. In 'source' markeer je de fout met [FOUT]...[/FOUT]. Gebruik ALTIJD de echte Gutenberg clientId van het block met de fout in 'clientId'. 'positie' mag als extra context, maar 'clientId' is verplicht. Baseer je op de huidige state, niet op historische/originalContent velden.",
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

        const handleCtaCheck = async () => {
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
            setCtaResult("");
            setCtaIssues([]);
            setAcceptedCtaIssues({});

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
                                    "Je bent een senior SEO + CRO-assistent voor CTA-optimalisatie. Je ontvangt de actuele Gutenberg block-state als JSON (met clientId, attributes en serializedHtml). Geef ALLEEN geldige JSON terug (geen markdown of extra tekst) met dit formaat: {\"issues\":[{\"source\":\"...\",\"fix\":\"...\",\"clientId\":\"...\",\"positie\":\"...\"}]}. Voeg ALLEEN een issue toe als de wijziging aantoonbaar beter is voor SEO-intentie of conversie-intentie (meer duidelijkheid, sterkere actie, concreter voordeel, hogere klikkans, beter zoekintentie-signaal). Doe GEEN cosmetische of subjectieve herschrijvingen. Als de huidige CTA al goed is of de winst te klein/onzeker is, voeg GEEN issue toe. Als er geen duidelijke verbetering is, geef exact terug: {\"issues\":[]}. Beperk je tot echte CTA-tekst (zoals knoptekst, link-ankers of directe actie-zinnen), niet tot gewone body copy. In 'source' markeer je de huidige CTA met [FOUT]...[/FOUT]. Gebruik ALTIJD de echte Gutenberg clientId van het block in 'clientId'. 'positie' mag als extra context, maar 'clientId' is verplicht.",
                            },
                            {
                                role: "user",
                                content:
                                    "Analyseer deze Gutenberg blocks op CTA-optimalisatie en geef uitsluitend JSON terug volgens het gevraagde formaat:\n\n" +
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

                // eslint-disable-next-line no-console
                console.info("[madeit-cta-check] raw AI response", {
                    hasResponseText: !!responseText,
                    responsePreview: previewText(responseText, 320),
                });

                if (responseText) {
                    const jsonResult = extractJsonFromText(responseText);

                    if (jsonResult) {
                        // eslint-disable-next-line no-console
                        console.info("[madeit-cta-check] parsed issues", {
                            issuesCount: Array.isArray(jsonResult.issues)
                                ? jsonResult.issues.length
                                : 0,
                            issuesPreview: Array.isArray(jsonResult.issues)
                                ? jsonResult.issues.slice(0, 5).map((issue) => ({
                                      clientId: issue?.clientId || null,
                                      source: previewText(issue?.source),
                                      fix: previewText(issue?.fix),
                                  }))
                                : [],
                        });

                        setCtaResult(JSON.stringify(jsonResult, null, 2));
                        setCtaIssues(Array.isArray(jsonResult.issues) ? jsonResult.issues : []);
                    } else {
                        // eslint-disable-next-line no-console
                        console.warn("[madeit-cta-check] failed to parse CTA JSON", {
                            responsePreview: previewText(responseText, 500),
                        });

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
                            "Er konden geen CTA-voorstellen worden gegenereerd. Probeer het opnieuw.",
                            "madeit"
                        ),
                        { type: "default" }
                    );
                }
            } catch (requestError) {
                if (requestError.name === "AbortError") {
                    createErrorNotice(__("De CTA-check is geannuleerd.", "madeit"), {
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

        const handleGenerateAltTags = async () => {
            if (isLoading) {
                cancelActiveRequest();
                return;
            }

            const blockEditorSelect = wp.data.select("core/block-editor");
            const blocks = blockEditorSelect.getBlocks() || [];
            const tasks = collectMissingAltTasks(blocks);
            const yoastKeyword = isYoastSeoActive() ? getYoastFocusKeyword() : "";

            if (tasks.length === 0) {
                createErrorNotice(__("Er zijn geen afbeeldingen zonder alt-tag gevonden.", "madeit"), {
                    type: "default",
                });
                return;
            }

            setIsLoading(true);
            setAltSummary({ total: tasks.length, updated: 0, skipped: 0, failed: 0 });
            setAltProgress({ total: tasks.length, done: 0, current: "" });

            const controller =
                typeof AbortController === "undefined" ? undefined : new AbortController();

            setAbortController(controller || null);

            let updated = 0;
            let skipped = 0;
            let failed = 0;

            for (let i = 0; i < tasks.length; i += 1) {
                const task = tasks[i];

                setAltProgress({
                    total: tasks.length,
                    done: i,
                    current: __("Afbeelding", "madeit") + " " + String(i + 1),
                });

                try {
                    const responsePayload = await wp.apiFetch({
                        path: "/madeit-ai/v1/responses",
                        method: "POST",
                        data: {
                            input: [
                                {
                                    role: "system",
                                    content: [
                                        {
                                            type: "input_text",
                                            text:
                                                yoastKeyword
                                                    ? "Je schrijft alt-teksten voor webafbeeldingen met SEO-focus. Verwerk de focus keyword indien dat natuurlijk en relevant is voor de afbeelding. Geef exact 1 korte alt-tekst terug zonder aanhalingstekens, zonder punt op het einde, en zonder extra uitleg."
                                                    : "Je schrijft alt-teksten voor webafbeeldingen. Geef exact 1 korte alt-tekst terug zonder aanhalingstekens, zonder punt op het einde, en zonder extra uitleg.",
                                        },
                                    ],
                                },
                                {
                                    role: "user",
                                    content: [
                                        {
                                            type: "input_text",
                                            text:
                                                (yoastKeyword
                                                    ? "Yoast focus keyword:\n" + yoastKeyword + "\n\n"
                                                    : "") +
                                                "Context rond de afbeelding:\n" +
                                                (task.contextText || "(geen extra context)") +
                                                "\n\nBestaand bijschrift:\n" +
                                                (task.caption || "(geen bijschrift)"),
                                        },
                                        {
                                            type: "input_image",
                                            image_url: task.url,
                                        },
                                    ],
                                },
                            ],
                        },
                        signal: controller?.signal,
                    });

                    const payload = responsePayload?.data ? responsePayload.data : responsePayload;
                    const altText = sanitizeAltText(extractResponseText(payload));

                    if (!altText) {
                        skipped += 1;
                        continue;
                    }

                    updateBlockAttributes(task.clientId, { alt: altText });
                    if (typeof __unstableMarkLastChangeAsPersistent === "function") {
                        __unstableMarkLastChangeAsPersistent();
                    }
                    updated += 1;
                } catch (responseError) {
                    if (responseError?.name === "AbortError") {
                        createErrorNotice(__("ALT-tag generatie geannuleerd.", "madeit"), {
                            type: "snackbar",
                        });
                        break;
                    }

                    failed += 1;
                    // eslint-disable-next-line no-console
                    console.error("[madeit-alt-tags] image processing failed", {
                        clientId: task.clientId,
                        imageUrl: task.url,
                        error: responseError?.message || "unknown_error",
                    });
                } finally {
                    setAltProgress({
                        total: tasks.length,
                        done: i + 1,
                        current: __("Afbeelding", "madeit") + " " + String(i + 1),
                    });
                }
            }

            setAltSummary({ total: tasks.length, updated, skipped, failed });
            setMissingAltCount(countMissingImageAlts(blockEditorSelect.getBlocks() || []));
            setIsLoading(false);
            setAbortController(null);
        };

        const applyIssueFromList = (issues, issueIndex, setAccepted, logNamespace) => {
            if (!Array.isArray(issues) || !issues[issueIndex]) {
                return;
            }

            const logApplyFailure = (reason, details = {}) => {
                // eslint-disable-next-line no-console
                console.error("[" + logNamespace + "] apply issue failed", {
                    reason,
                    issueIndex,
                    details,
                });
            };

            const issue = issues[issueIndex];
            const blockEditorSelect = wp.data.select("core/block-editor");
            const blocks = blockEditorSelect.getBlocks() || [];
            const position = parseIssuePosition(issue.positie);
            const issueClientId = extractIssueClientId(issue);
            const markedError = extractMarkedError(issue?.source);
            const sourcePlain = stripHtml(String(issue?.source || ""))
                .replace(/\[FOUT\]|\[\/FOUT\]/gi, "")
                .trim();

            // eslint-disable-next-line no-console
            console.info("[" + logNamespace + "] apply start", {
                issueIndex,
                issueClientId,
                position,
                source: previewText(issue?.source),
                fix: previewText(issue?.fix),
                sourcePlain: previewText(sourcePlain),
                markedError: previewText(markedError),
            });

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

            // eslint-disable-next-line no-console
            console.info("[" + logNamespace + "] resolved target block", {
                found: !!targetBlock,
                clientId: targetBlock?.clientId || null,
                name: targetBlock?.name || null,
                attributeKeys: Object.keys(targetBlock?.attributes || {}),
            });

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

            const attributeUpdate = findBestAttributeUpdate(targetBlock, issue, {
                allowDirectReplace: logNamespace === "madeit-cta-check",
                debugNamespace: logNamespace,
            });

            // eslint-disable-next-line no-console
            console.info("[" + logNamespace + "] attribute update result", {
                hasUpdate: !!attributeUpdate,
                key: attributeUpdate?.key || null,
                sourceType: attributeUpdate?.sourceType || "attribute",
                before: previewText(attributeUpdate?.currentValue),
                after: previewText(attributeUpdate?.updatedValue),
            });

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

                const updatedBlock = wp.data
                    .select("core/block-editor")
                    .getBlock(targetBlock.clientId);

                // eslint-disable-next-line no-console
                console.info("[" + logNamespace + "] update applied", {
                    clientId: targetBlock.clientId,
                    key: attributeUpdate.key,
                    persistedValuePreview: previewText(updatedBlock?.attributes?.[attributeUpdate.key]),
                });

                if (typeof __unstableMarkLastChangeAsPersistent === "function") {
                    __unstableMarkLastChangeAsPersistent();
                }
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

            setAccepted((previous) => ({
                ...previous,
                [issueIndex]: true,
            }));
        };

        const focusIssueFromList = (issues, issueIndex) => {
            if (!Array.isArray(issues) || !issues[issueIndex]) {
                return;
            }

            const issue = issues[issueIndex];
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

        const handleAcceptIssue = (issueIndex) => {
            applyIssueFromList(
                languageIssues,
                issueIndex,
                setAcceptedIssues,
                "madeit-language-check"
            );
        };

        const handleFocusIssue = (issueIndex) => {
            focusIssueFromList(languageIssues, issueIndex);
        };

        const handleAcceptCtaIssue = (issueIndex) => {
            applyIssueFromList(
                ctaIssues,
                issueIndex,
                setAcceptedCtaIssues,
                "madeit-cta-check"
            );
        };

        const handleFocusCtaIssue = (issueIndex) => {
            focusIssueFromList(ctaIssues, issueIndex);
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
            handleResetChat,
            blockCount,
            languageResult,
            languageIssues,
            acceptedIssues,
            handleLanguageCheck,
            handleAcceptIssue,
            handleFocusIssue,
            ctaResult,
            ctaIssues,
            acceptedCtaIssues,
            handleCtaCheck,
            handleAcceptCtaIssue,
            handleFocusCtaIssue,
            missingAltCount,
            altProgress,
            altSummary,
            handleGenerateAltTags,
            yoastActive,
            generatedFocusKeyword,
            yoastApplyStatus,
            handleGenerateFocusKeyword,
            generatedMetaTitle,
            yoastMetaApplyStatus,
            handleGenerateMetaTitle,
            generatedMetaDescription,
            yoastMetaDescriptionApplyStatus,
            handleGenerateMetaDescription,
            autoBlocksPrompt,
            setAutoBlocksPrompt,
            autoBlocksStatus,
            handleGenerateAutoBlocks,
            deleteBlockPrompt,
            setDeleteBlockPrompt,
            deleteBlockStatus,
            handleDeleteBlock,
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

                const selectedClientId =
                    wp.data.select("core/block-editor")?.getSelectedBlockClientId?.() || "";
                const currentStructure = buildLanguageCheckSnapshot(
                    wp.data.select("core/block-editor")?.getBlocks?.() || []
                );

                const nextMessages = [
                    ...chatHistory,
                    {
                        role: "user",
                        content: outgoingMessage,
                    },
                ];

                const systemMessage = {
                    role: "system",
                    content:
                        "Je bent een behulpzame AI-assistent. Antwoord in de taal van de gebruiker. Als er twijfel is over de taal, antwoord dan in het Nederlands (Belgisch).",
                };

                const insertionContextMessage = {
                    role: "system",
                    content:
                        "Voor layout-aanvragen: gebruik tool-calls. Root-blokken moeten madeit/block-content zijn met kolommen. De huidige selectie clientId is: " +
                        (selectedClientId || "") +
                        ". Als de gebruiker 'hier' zegt, mag je deze clientId gebruiken voor insert before/after. Voor verwijder-aanvragen gebruik je delete_gutenberg_block met exact 1 clientId. Huidige Gutenberg structuur met clientIds: " +
                        JSON.stringify(currentStructure),
                };

                setChatHistory(nextMessages);
                setUiChat((previous) => [
                    ...previous,
                    {
                        role: "user",
                        content: outgoingMessage,
                    },
                ]);

                try {
                    const modelName =
                        typeof settings !== "undefined" && settings?.ai_editor_model
                            ? settings.ai_editor_model
                            : "";
                    const functions = getFunctionsForModel(modelName);
                    const responseTools = functions.map((tool) => {
                        const functionDef = tool?.function || null;

                        if (tool?.type === "function" && functionDef?.name) {
                            return {
                                type: "function",
                                name: functionDef.name,
                                description: functionDef.description || "",
                                parameters: functionDef.parameters || {
                                    type: "object",
                                    properties: {},
                                },
                            };
                        }

                        return tool;
                    });
                    const responsesInput = buildResponsesInputFromMessages([
                        systemMessage,
                        insertionContextMessage,
                        ...nextMessages,
                    ]);
                    const completionResponse = await wp.apiFetch({
                        path: "/madeit-ai/v1/responses",
                        method: "POST",
                        data: {
                            input: responsesInput,
                            tools: responseTools,
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

                    const layoutToolArgsJson = extractResponseFunctionArgs(payload, [
                        "create_madeit_layout_blocks",
                    ]);
                    const gutenbergToolArgsJson = extractResponseFunctionArgs(payload, [
                        "create_gutenberg_blocks",
                    ]);
                    const deleteToolArgsJson = extractResponseFunctionArgs(payload, [
                        "delete_gutenberg_block",
                    ]);
                    const assistantContentText = extractResponseText(payload);
                    const contentJson = extractJsonFromText(assistantContentText);
                    const layoutPayload = layoutToolArgsJson?.sections
                        ? layoutToolArgsJson
                        : contentJson?.sections
                        ? {
                              sections: contentJson.sections,
                              insert: contentJson.insert,
                          }
                        : null;

                    if (deleteToolArgsJson?.clientId || contentJson?.clientId) {
                        const requestedClientId = sanitizeClientId(
                            deleteToolArgsJson?.clientId || contentJson?.clientId
                        );

                        if (!requestedClientId) {
                            createErrorNotice(
                                __("De AI gaf geen geldige clientId terug voor verwijdering.", "madeit"),
                                { type: "default" }
                            );
                            return;
                        }

                        const blockEditorSelect = wp.data.select("core/block-editor");
                        const targetBlock = blockEditorSelect.getBlock(requestedClientId);

                        if (!targetBlock) {
                            createErrorNotice(
                                __("De gekozen clientId bestaat niet meer in de editor.", "madeit"),
                                { type: "default" }
                            );
                            return;
                        }

                        removeBlocks([requestedClientId], false);
                        if (typeof __unstableMarkLastChangeAsPersistent === "function") {
                            __unstableMarkLastChangeAsPersistent();
                        }

                        const successMessage =
                            __("Blok verwijderd met clientId:", "madeit") + " " + requestedClientId;
                        setUiChat((previous) => [
                            ...previous,
                            {
                                role: "assistant",
                                content: successMessage,
                                blockAdded: true,
                            },
                        ]);

                        setChatHistory((previous) => [
                            ...previous,
                            {
                                role: "assistant",
                                content: successMessage,
                            },
                        ]);

                        return;
                    }

                    if (layoutPayload) {
                        const generatedLayoutPayload = await requestLayoutJson({
                            prompt: outgoingMessage,
                            selectedClientId,
                            currentStructure,
                            signal: controller?.signal,
                        });

                        if (!generatedLayoutPayload) {
                            createErrorNotice(__("De AI gaf geen valide JSON terug voor de layout.", "madeit"), {
                                type: "default",
                            });
                            return;
                        }

                        const sections = normalizeAutoBlockSections(generatedLayoutPayload);
                        const madeitBlocks = createMadeitContentBlocksFromSections(sections);

                        if (madeitBlocks.length === 0) {
                            createErrorNotice(
                                __("Er konden geen geldige layoutblokken worden opgebouwd.", "madeit"),
                                { type: "default" }
                            );
                            return;
                        }

                        const insertSpec = normalizeAutoInsertSpec(generatedLayoutPayload);
                        const effectiveClientId = insertSpec.clientId || selectedClientId;
                        const latestBlocks = wp.data.select("core/block-editor").getBlocks() || [];
                        const insertionIndex = effectiveClientId
                            ? resolveRootInsertIndexByClientId(
                                  latestBlocks,
                                  effectiveClientId,
                                  insertSpec.position
                              )
                            : null;

                        if (Number.isInteger(insertionIndex)) {
                            insertBlocks(madeitBlocks, insertionIndex);
                        } else {
                            insertBlocks(madeitBlocks);
                        }

                        const successMessage = __("Blocks added successfully!", "madeit");
                        setUiChat((previous) => [
                            ...previous,
                            {
                                role: "assistant",
                                content: successMessage,
                                blockAdded: true,
                            },
                        ]);

                        setChatHistory((previous) => [
                            ...previous,
                            {
                                role: "assistant",
                                content: successMessage,
                            },
                        ]);

                        return;
                    }

                    if (
                        Array.isArray(gutenbergToolArgsJson?.blocks) &&
                        gutenbergToolArgsJson.blocks.length > 0
                    ) {
                        const generatedBlocksPayload = await requestBlocksJson({
                            prompt: outgoingMessage,
                            currentStructure,
                            signal: controller?.signal,
                        });

                        if (!Array.isArray(generatedBlocksPayload?.blocks)) {
                            createErrorNotice(
                                __("De AI gaf geen valide JSON terug voor blocks.", "madeit"),
                                { type: "default" }
                            );
                            return;
                        }

                        const generatedBlocks = generatedBlocksPayload.blocks;
                        normalizeTableBodies(generatedBlocks);
                        await insertGeneratedBlocks(generatedBlocks, insertBlocks);

                        const successMessage = __("Blocks added successfully!", "madeit");
                        setUiChat((previous) => [
                            ...previous,
                            {
                                role: "assistant",
                                content: successMessage,
                                blockAdded: true,
                            },
                        ]);

                        setChatHistory((previous) => [
                            ...previous,
                            {
                                role: "assistant",
                                content: successMessage,
                            },
                        ]);

                        return;
                    }

                    if (contentJson?.blocks) {
                        let hasError = false;

                        try {
                            const blocks = contentJson.blocks;

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
                    } else if (assistantContentText) {
                        const assistantContent = assistantContentText;

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
            viewBox: "0 0 64 64",
            fill: "none",
        },
        React.createElement("circle", {
            cx: "32",
            cy: "32",
            r: "30",
            fill: "white",
        }),
        React.createElement("path", {
            d: "M12 20l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5 1.5-3z",
            fill: "black",
            opacity: "0.8",
        }),
        React.createElement("path", {
            d: "M50 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z",
            fill: "black",
            opacity: "0.6",
        }),
        React.createElement("path", {
            d: "M52 46l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5 1.5-3z",
            fill: "black",
            opacity: "0.7",
        }),
        React.createElement("path", {
            d: "M10 48l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z",
            fill: "black",
            opacity: "0.5",
        }),
        React.createElement("text", {
            x: "32",
            y: "38",
            textAnchor: "middle",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "20",
            fontWeight: "700",
            fill: "black",
        }, "AI")
    ),
});