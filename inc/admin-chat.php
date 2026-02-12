<?php
/**
 * Admin chat bubble for WordPress dashboard.
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('madeit_admin_chat_footer_unhide_link')) {
    function madeit_admin_chat_footer_unhide_link($text)
    {
        // Link is shown/hidden via JS depending on localStorage flag.
        $text .= ' • <a href="#" id="madeit-admin-chat-unhide" style="display:none">Toon Admin Chat</a>';

        return $text;
    }
}
add_filter('admin_footer_text', 'madeit_admin_chat_footer_unhide_link', 100, 1);

if (!function_exists('madeit_admin_chat_enqueue')) {
    function madeit_admin_chat_enqueue() {
        wp_register_style('madeit-admin-chat', false, [], MADEIT_VERSION);
        wp_enqueue_style('madeit-admin-chat');
        wp_add_inline_style('madeit-admin-chat', '
            #madeit-admin-chat-bubble{position:fixed;right:24px;bottom:24px;z-index:9999;width:56px;height:56px;border-radius:50%;background:#476a8a;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.2)}
            #madeit-admin-chat-bubble:hover{transform:translateY(-1px)}
            #madeit-admin-chat-panel{position:fixed;right:24px;bottom:90px;width:320px;max-height:60vh;background:#fff;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.2);display:none;flex-direction:column;overflow:hidden;z-index:9999}
            #madeit-admin-chat-panel.is-open{display:flex}
            #madeit-admin-chat-header{background:#476a8a;color:#fff;padding:12px 14px;display:flex;align-items:center;justify-content:space-between}
            #madeit-admin-chat-body{padding:12px;overflow:auto;display:flex;flex-direction:column;gap:8px;flex:1}
            .madeit-admin-chat-message{padding:8px 10px;border-radius:10px;background:#f3f4f6;color:#111;max-width:85%;align-self:flex-start;font-size:12px;line-height:1.4}
            .madeit-admin-chat-message.is-own{background:#e8f0ff;color:#0b2a6b;align-self:flex-end}
            #madeit-admin-chat-form{display:flex;gap:8px;padding:10px;border-top:1px solid #eef0f2}
            #madeit-admin-chat-input{flex:1;border:1px solid #cfd6dd;border-radius:8px;padding:8px 10px;font-size:12px}
            #madeit-admin-chat-send{background:#476a8a;border:none;color:#fff;border-radius:8px;padding:8px 12px;cursor:pointer;font-size:12px}
            #madeit-admin-chat-close{background:transparent;border:none;color:#fff;font-size:16px;cursor:pointer}
            #madeit-admin-chat-reset{background:rgba(255,255,255,.15);border:none;color:#fff;font-size:11px;border-radius:8px;padding:4px 8px;cursor:pointer;margin-right:6px}
            #madeit-admin-chat-reset:hover{background:rgba(255,255,255,.25)}
            #madeit-admin-chat-expand{background:rgba(255,255,255,.15);border:none;color:#fff;font-size:11px;border-radius:8px;padding:4px 8px;cursor:pointer;margin-right:6px}
            #madeit-admin-chat-expand:hover{background:rgba(255,255,255,.25)}
            #madeit-admin-chat-panel.is-expanded{right:20px;left:20px;bottom:20px;top:20px;width:auto;max-height:none}
            #madeit-admin-chat-panel.is-expanded #madeit-admin-chat-body{max-height:none}
            #madeit-admin-chat-status{padding:6px 12px;font-size:12px;color:#6b7280;display:none;border-top:1px solid #eef0f2}
            #madeit-admin-chat-status.is-loading{display:block}
            #madeit-admin-chat-panel.is-loading #madeit-admin-chat-send{opacity:.6;cursor:not-allowed}
            #madeit-admin-chat-panel.is-loading #madeit-admin-chat-input{opacity:.6}
            #madeit-admin-chat-hide{background:rgba(255,255,255,.15);border:none;color:#fff;font-size:11px;border-radius:8px;padding:4px 8px;cursor:pointer;margin-right:6px}
            #madeit-admin-chat-hide:hover{background:rgba(255,255,255,.25)}
            #madeit-admin-chat-bubble.is-hidden{display:none}
            #madeit-admin-chat-panel.is-hidden{display:none !important}
        ');

        wp_register_script('madeit-admin-chat', false, [], MADEIT_VERSION, true);
        wp_enqueue_script('madeit-admin-chat');
        wp_localize_script('madeit-admin-chat', 'madeit_admin_chat', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('madeit_admin_chat_nonce'),
        ]);
        wp_add_inline_script('madeit-admin-chat', '
            (function(){
                var bubble = document.getElementById("madeit-admin-chat-bubble");
                var panel = document.getElementById("madeit-admin-chat-panel");
                var unhideLink = document.getElementById("madeit-admin-chat-unhide");
                var closeBtn = document.getElementById("madeit-admin-chat-close");
                var expandBtn = document.getElementById("madeit-admin-chat-expand");
                var resetBtn = document.getElementById("madeit-admin-chat-reset");
                var hideBtn = document.getElementById("madeit-admin-chat-hide");
                var form = document.getElementById("madeit-admin-chat-form");
                var input = document.getElementById("madeit-admin-chat-input");
                var body = document.getElementById("madeit-admin-chat-body");
                var status = document.getElementById("madeit-admin-chat-status");

                if(!bubble || !panel) return;

                var storageKey = "madeit_admin_chat_messages";
                var hiddenKey = "madeit_admin_chat_hidden";

                function saveMessages(){
                    var messages = [];
                    body.querySelectorAll(".madeit-admin-chat-message").forEach(function(node){
                        messages.push({
                            text: node.textContent,
                            role: node.classList.contains("is-own") ? "user" : "assistant"
                        });
                    });
                    try{localStorage.setItem(storageKey, JSON.stringify(messages));}catch(e){}
                }

                function loadMessages(){
                    try{
                        var raw = localStorage.getItem(storageKey);
                        if(!raw) return;
                        var messages = JSON.parse(raw) || [];
                        messages.forEach(function(msg){
                            if(!msg) return;
                            if(msg.role){
                                addMessage(msg.text, msg.role);
                            }else{
                                addMessage(msg.text, msg.own ? "user" : "assistant");
                            }
                        });
                    }catch(e){}
                }

                function escapeHtml(value){
                    return value
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/\'/g, "&#039;");
                }

                function markdownToHtml(value){
                    var html = escapeHtml(value || "");
                    html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
                    html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
                    html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");
                    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
                    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
                    html = html.replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, \'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>\');
                    html = html.replace(/^(?:- |\* )(.*)$/gm, \'<li>$1</li>\');
                    if (/<li>/.test(html)) {
                        html = html.replace(/(<li>.*<\/li>)/gs, \'<ul>$1</ul>\');
                    }
                    html = html.replace(/\n/g, "<br>");
                    return html;
                }

                function addMessage(text, role){
                    if(!text) return;
                    var item = document.createElement("div");
                    var isOwn = role === "user";
                    item.className = "madeit-admin-chat-message" + (isOwn ? " is-own" : "");
                    item.innerHTML = markdownToHtml(text);
                    body.appendChild(item);
                    body.scrollTop = body.scrollHeight;
                }

                function getHistory(){
                    try{
                        var raw = localStorage.getItem(storageKey);
                        if(!raw) return [];
                        var parsed = JSON.parse(raw) || [];
                        return parsed.map(function(msg){
                            if(msg && msg.role){
                                return {role: msg.role, content: msg.text};
                            }
                            if(msg && typeof msg.own !== "undefined"){
                                return {role: msg.own ? "user" : "assistant", content: msg.text};
                            }
                            return null;
                        }).filter(Boolean).slice(-10);
                    }catch(e){
                        return [];
                    }
                }

                function ajax(action, data){
                    data = data || {};
                    data.action = action;
                    data._ajax_nonce = (window.madeit_admin_chat && madeit_admin_chat.nonce) ? madeit_admin_chat.nonce : "";

                    return fetch((window.madeit_admin_chat ? madeit_admin_chat.ajax_url : ""), {
                        method: "POST",
                        headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
                        body: new URLSearchParams(data).toString()
                    }).then(function(res){return res.json();});
                }

                function toggle(open){
                    if(open){
                        panel.classList.add("is-open");
                    }else{
                        panel.classList.remove("is-open");
                    }
                }

                function setLoading(isLoading){
                    if(!panel) return;
                    if(isLoading){
                        panel.classList.add("is-loading");
                        if(status){
                            status.textContent = "Bezig met antwoorden...";
                            status.classList.add("is-loading");
                        }
                        if(input){
                            input.setAttribute("disabled", "disabled");
                        }
                    }else{
                        panel.classList.remove("is-loading");
                        if(status){
                            status.textContent = "";
                            status.classList.remove("is-loading");
                        }
                        if(input){
                            input.removeAttribute("disabled");
                            input.focus();
                        }
                    }
                }

                bubble.addEventListener("click", function(){
                    var isOpen = panel.classList.contains("is-open");
                    toggle(!isOpen);
                });

                function setHidden(isHidden){
                    if(isHidden){
                        try{localStorage.setItem(hiddenKey, "1");}catch(e){}
                        bubble.classList.add("is-hidden");
                        panel.classList.add("is-hidden");
                        panel.classList.remove("is-open");
                        if(unhideLink){
                            unhideLink.style.display = "inline";
                        }
                    }else{
                        try{localStorage.removeItem(hiddenKey);}catch(e){}
                        bubble.classList.remove("is-hidden");
                        panel.classList.remove("is-hidden");
                        if(unhideLink){
                            unhideLink.style.display = "none";
                        }
                    }
                }

                try{
                    if(localStorage.getItem(hiddenKey) === "1"){
                        setHidden(true);
                    }
                }catch(e){}

                if(unhideLink){
                    unhideLink.addEventListener("click", function(e){
                        e.preventDefault();
                        setHidden(false);
                        // Optionally open the panel so it is obvious the chat is back.
                        toggle(true);
                    });
                }

                if(closeBtn){
                    closeBtn.addEventListener("click", function(){
                        toggle(false);
                    });
                }

                if(expandBtn){
                    expandBtn.addEventListener("click", function(){
                        var expanded = panel.classList.toggle("is-expanded");
                        expandBtn.textContent = expanded ? "Klein" : "Groot";
                    });
                }

                if(resetBtn){
                    resetBtn.addEventListener("click", function(){
                        if(!confirm("Weet je zeker dat je de chat wil resetten?")) return;
                        try{localStorage.removeItem(storageKey);}catch(e){}
                        while(body.firstChild){
                            body.removeChild(body.firstChild);
                        }
                    });
                }

                if(hideBtn){
                    hideBtn.addEventListener("click", function(){
                        setHidden(true);
                    });
                }

                function applyClientActions(actions){
                    if(!actions || !actions.length) return;
                    if(!window.wp || !wp.data || !wp.blocks) return;

                    var editor = wp.data.select("core/editor");
                    var blockEditor = wp.data.dispatch("core/block-editor");
                    if(!editor || !blockEditor) return;

                    var currentPostId = editor.getCurrentPostId && editor.getCurrentPostId();

                    actions.forEach(function(action){
                        if(!action || action.type !== "insert_block") return;
                        if(action.page_id && currentPostId && action.page_id !== currentPostId) return;

                        if(action.block_serialized){
                            var blocks = wp.blocks.parse(action.block_serialized);
                            if(blocks && blocks.length){
                                blockEditor.insertBlocks(blocks);
                            }
                        }
                    });
                }

                if(form){
                    form.addEventListener("submit", function(e){
                        e.preventDefault();
                        if(panel.classList.contains("is-loading")) return;
                        var value = input.value.trim();
                        if(!value) return;
                        addMessage(value, "user");
                        input.value = "";
                        saveMessages();

                        setLoading(true);

                        var history = getHistory();
                        history.push({role: "user", content: value});

                        ajax("madeit_admin_chat_send", {message: value, messages: JSON.stringify(history)}).then(function(resp){
                            if(resp && resp.success && resp.data && resp.data.message){
                                addMessage(resp.data.message, "assistant");
                                saveMessages();
                                if(resp.data.client_actions){
                                    applyClientActions(resp.data.client_actions);
                                }
                            }
                            setLoading(false);
                        }).catch(function(){
                            addMessage("Kon bericht niet verzenden.", "assistant");
                            setLoading(false);
                        });
                    });
                }

                function poll(){
                    ajax("madeit_admin_chat_receive", {}).then(function(resp){
                        if(resp && resp.success && Array.isArray(resp.data)){
                            resp.data.forEach(function(msg){
                                if(msg && msg.text){
                                    addMessage(msg.text, "assistant");
                                }
                            });
                            if(resp.data.length){
                                saveMessages();
                            }
                        }
                    }).catch(function(){});
                }

                setInterval(poll, 10000);

                loadMessages();
            })();
        ');
    }
}
add_action('admin_enqueue_scripts', 'madeit_admin_chat_enqueue');

if (!function_exists('madeit_admin_chat_markup')) {
    function madeit_admin_chat_markup() {
        if (!current_user_can('read')) {
            return;
        }
        ?>
        <div id="madeit-admin-chat-bubble" aria-label="Open chat" title="Open chat">
            <span class="dashicons dashicons-format-chat"></span>
        </div>
        <div id="madeit-admin-chat-panel" aria-live="polite" aria-label="Admin chat">
            <div id="madeit-admin-chat-header">
                <strong>Admin Chat</strong>
                <div>
                    <button id="madeit-admin-chat-expand" aria-label="Vergroot chat">Groot</button>
                    <button id="madeit-admin-chat-reset" aria-label="Reset chat">Reset</button>
                    <button id="madeit-admin-chat-hide" aria-label="Verberg chat">Verberg</button>
                    <button id="madeit-admin-chat-close" aria-label="Close chat">&times;</button>
                </div>
            </div>
            <div id="madeit-admin-chat-body"></div>
            <div id="madeit-admin-chat-status" aria-live="polite"></div>
            <form id="madeit-admin-chat-form" autocomplete="off">
                <input id="madeit-admin-chat-input" type="text" placeholder="Typ een bericht..." />
                <button id="madeit-admin-chat-send" type="submit">Verstuur</button>
            </form>
        </div>
        <?php
    }
}
add_action('admin_footer', 'madeit_admin_chat_markup');

if (!function_exists('madeit_admin_chat_send')) {
    function madeit_admin_chat_send() {
        check_ajax_referer('madeit_admin_chat_nonce');

        if (!current_user_can('read')) {
            wp_send_json_error(['message' => 'Unauthorized'], 403);
        }

        $message = isset($_POST['message']) ? sanitize_text_field(wp_unslash($_POST['message'])) : '';
        $raw_messages = isset($_POST['messages']) ? wp_unslash($_POST['messages']) : '';

        if ('' === $message) {
            wp_send_json_error(['message' => 'Empty message'], 400);
        }

        $messages = [];
        if (!empty($raw_messages)) {
            $decoded = json_decode($raw_messages, true);
            if (is_array($decoded)) {
                foreach ($decoded as $item) {
                    if (!is_array($item) || empty($item['role']) || empty($item['content'])) {
                        continue;
                    }
                    $role = $item['role'];
                    if (!in_array($role, ['user', 'assistant', 'system'], true)) {
                        continue;
                    }
                    $messages[] = [
                        'role' => $role,
                        'content' => sanitize_text_field($item['content']),
                    ];
                }
            }
        }

        if (empty($messages)) {
            $messages[] = [
                'role' => 'user',
                'content' => $message,
            ];
        }

        $reply = madeit_admin_chat_openai_reply($messages);

        if (is_array($reply)) {
            $payload = [
                'message' => $reply['message'] ?? '',
            ];
            if (!empty($reply['client_actions'])) {
                $payload['client_actions'] = $reply['client_actions'];
            }
            wp_send_json_success($payload);
        }

        wp_send_json_success([
            'message' => $reply,
        ]);
    }
}
add_action('wp_ajax_madeit_admin_chat_send', 'madeit_admin_chat_send');

if (!function_exists('madeit_admin_chat_receive')) {
    function madeit_admin_chat_receive() {
        check_ajax_referer('madeit_admin_chat_nonce');

        if (!current_user_can('read')) {
            wp_send_json_error(['message' => 'Unauthorized'], 403);
        }

        // No server-side storage yet; return empty list.
        wp_send_json_success([]);
    }
}
add_action('wp_ajax_madeit_admin_chat_receive', 'madeit_admin_chat_receive');

if (!function_exists('madeit_admin_chat_openai_reply')) {
    function madeit_admin_chat_openai_reply($messages) {
        if (empty(MADEIT_ADMIN_CHAT_OPENAI_API_KEY)) {
            return 'OpenAI API key ontbreekt.';
        }

        $site_info = madeit_admin_chat_tool_get_site_info();
        $extra_context = madeit_admin_chat_extra_context();
        $screen_id = '';
        $screen_base = '';
        $context_post_id = 0;
        $context_post_type = '';
        if (function_exists('get_current_screen')) {
            $screen = get_current_screen();
            if ($screen) {
                $screen_id = $screen->id;
                $screen_base = $screen->base;
                $context_post_type = $screen->post_type ?? '';
            }
        }
        if (isset($_GET['post'])) {
            $context_post_id = (int) $_GET['post'];
        } elseif (isset($GLOBALS['post']) && $GLOBALS['post'] instanceof WP_Post) {
            $context_post_id = (int) $GLOBALS['post']->ID;
        }
        if (empty($context_post_type) && $context_post_id > 0) {
            $context_post_type = get_post_type($context_post_id);
        }
        $current_url = (is_ssl() ? 'https://' : 'http://').($_SERVER['HTTP_HOST'] ?? '').($_SERVER['REQUEST_URI'] ?? '');
        $current_user = wp_get_current_user();
        $role = !empty($current_user->roles) ? $current_user->roles[0] : 'guest';
        $system_prompt = 'Je bent een behulpzame admin-assistent voor WordPress. Antwoord kort en duidelijk in het Vlaams, in Markdown. Gebruik altijd Markdown links als je een URL vermeldt. ';
        $system_prompt .= 'De gebruiker is ingelogd met rol: '.$role.'. Geef geen login-instructies. ';
        $system_prompt .= 'Basis info: Site naam: '.$site_info['name'].', URL: '.$site_info['url'].', WordPress: '.$site_info['wp_version'].', Thema: '.$site_info['theme'].', Locale: '.$site_info['locale'].'.';
        $system_prompt .= ' Huidige admin scherm: '.$screen_id.' ('.$screen_base.'). Huidige URL: '.$current_url.'.';
        if ($context_post_id > 0 && !empty($context_post_type)) {
            $system_prompt .= ' Huidige inhoud: post_type '.$context_post_type.', post_id '.$context_post_id.'. Gebruik dit standaard voor acties op de huidige pagina, vraag geen extra ID als het hier staat.';
        }
        if (!empty($extra_context)) {
            $system_prompt .= ' Extra context: '.$extra_context;
        }

        array_unshift($messages, [
            'role' => 'system',
            'content' => $system_prompt,
        ]);

        $tools = madeit_admin_chat_get_tools();
        $messages = array_slice($messages, -12);

        $payload = madeit_admin_chat_openai_request($messages, $tools);
        if (!is_array($payload)) {
            return [
                'message' => 'Ik kan nu geen antwoord ophalen.',
            ];
        }

        $message = $payload['choices'][0]['message'] ?? null;
        if (empty($message)) {
            return [
                'message' => 'Geen antwoord ontvangen.',
            ];
        }

        $client_actions = [];
        if (!empty($message['tool_calls'])) {
            $tool_messages = [];
            foreach ($message['tool_calls'] as $call) {
                if (empty($call['id']) || empty($call['function']['name'])) {
                    continue;
                }
                $name = $call['function']['name'];
                $args = [];
                if (!empty($call['function']['arguments'])) {
                    $decoded = json_decode($call['function']['arguments'], true);
                    if (is_array($decoded)) {
                        $args = $decoded;
                    }
                }

                $result = madeit_admin_chat_run_tool($name, $args);
                if (is_array($result) && !empty($result['client_action'])) {
                    $client_actions[] = $result['client_action'];
                }

                $tool_messages[] = [
                    'role' => 'tool',
                    'tool_call_id' => $call['id'],
                    'name' => $name,
                    'content' => wp_json_encode($result),
                ];
            }

            $messages[] = $message;
            $messages = array_merge($messages, $tool_messages);

            $payload = madeit_admin_chat_openai_request($messages, $tools);
            if (!is_array($payload)) {
                return [
                    'message' => 'Ik kan nu geen antwoord ophalen.',
                    'client_actions' => $client_actions,
                ];
            }
            $message = $payload['choices'][0]['message'] ?? null;
        }

        if (empty($message['content'])) {
            return [
                'message' => 'Geen antwoord ontvangen.',
                'client_actions' => $client_actions,
            ];
        }

        return [
            'message' => sanitize_text_field($message['content']),
            'client_actions' => $client_actions,
        ];
    }
}

if (!function_exists('madeit_admin_chat_extra_context')) {
    function madeit_admin_chat_extra_context() {
        $theme = wp_get_theme();
        $base_context = [
            'Thema: '.$theme->get('Name'),
            'Thema versie: '.$theme->get('Version'),
            'Thema URI: '.$theme->get('ThemeURI'),
            'Als je iets niet weet of extra hulp nodig hebt, contacteer Made I.T. via info@madeit.be.',
            'Gutenberg block madeit/block-content (Content Container): belangrijkste blok om rijen met kolommen op te bouwen; je kan meerdere containers onder elkaar plaatsen; gebruik background color en padding voor afstand.',
            'Gutenberg block madeit/block-content-column (Content Column): kolom binnen een Content Container; ondersteunt width (0-12), padding en background/text colors.',
        ];
        $context = apply_filters('madeit_admin_chat_extra_context', $base_context);
        if (is_string($context)) {
            $context = [$context];
        }
        if (!is_array($context)) {
            return '';
        }

        $items = [];
        foreach ($context as $item) {
            if (is_string($item)) {
                $item = trim($item);
                if ($item !== '') {
                    $items[] = $item;
                }
            }
        }

        if (empty($items)) {
            return '';
        }

        // Keep context compact to avoid bloating the prompt.
        $items = array_slice($items, 0, 20);

        return implode(' | ', $items);
    }
}

if (!function_exists('madeit_admin_chat_openai_request')) {
    function madeit_admin_chat_openai_request($messages, $tools) {
        madeit_admin_chat_debug('request_payload', [
            'model' => MADEIT_ADMIN_CHAT_OPENAI_MODEL,
            'message_count' => is_array($messages) ? count($messages) : 0,
            'tool_count' => is_array($tools) ? count($tools) : 0,
        ]);

        $body = [
            'model' => MADEIT_ADMIN_CHAT_OPENAI_MODEL,
            'messages' => $messages,
            'temperature' => 1,
            'max_tokens' => 10_000,
            'tools' => $tools,
            'tool_choice' => 'auto',
            'reasoning' => ["effort" => "low"],
        ];

        madeit_admin_chat_debug('request_body', [
            'body' => $body,
        ]);

        $response = wp_remote_post('https://app.jono.be/api/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer '.MADEIT_ADMIN_CHAT_OPENAI_API_KEY,
                'Content-Type'  => 'application/json',
            ],
            'timeout' => 20,
            'body' => wp_json_encode($body),
        ]);

        if (is_wp_error($response)) {
            madeit_admin_chat_debug('request_error', [
                'message' => $response->get_error_message(),
                'data' => $response->get_error_data(),
            ]);
            return null;
        }

        $status = wp_remote_retrieve_response_code($response);
        $raw_body = wp_remote_retrieve_body($response);
        madeit_admin_chat_debug('response', [
            'status' => $status,
            'body' => $raw_body,
        ]);

        $payload = json_decode($raw_body, true);
        if (empty($payload) || empty($payload['choices'][0]['message'])) {
            madeit_admin_chat_debug('response_parse_error', [
                'status' => $status,
                'body' => $raw_body,
            ]);
            return null;
        }

        return $payload;
    }
}

if (!function_exists('madeit_admin_chat_debug')) {
    function madeit_admin_chat_debug($label, $data = null) {
        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            return;
        }
        $message = '[madeit-admin-chat] '.$label;
        if (null !== $data) {
            $message .= ' '.wp_json_encode($data);
        }
        error_log($message);
    }
}

if (!function_exists('madeit_admin_chat_get_tools')) {
    function madeit_admin_chat_get_tools() {
        return [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_site_info',
                    'description' => 'Haal basisinformatie van de website op (naam, URL, WordPress versie, thema, locale).',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => new stdClass(),
                        'required' => [],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_post_types',
                    'description' => 'Geef een lijst van publieke post types met labels.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => new stdClass(),
                        'required' => [],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_posts',
                    'description' => 'Haal recente posts op. Optionele filters: post_type, status, per_page, search.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'post_type' => [
                                'type' => 'string',
                                'description' => 'Post type slug, bv. post of page.',
                            ],
                            'status' => [
                                'type' => 'string',
                                'description' => 'Post status, bv. publish of draft.',
                            ],
                            'per_page' => [
                                'type' => 'integer',
                                'description' => 'Aantal items (max 20).',
                            ],
                            'search' => [
                                'type' => 'string',
                                'description' => 'Zoekterm.',
                            ],
                        ],
                        'required' => [],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_plugins',
                    'description' => 'Geef de lijst van geïnstalleerde plugins met status.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => new stdClass(),
                        'required' => [],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_pages',
                    'description' => 'Haal pagina\'s op met edit-link en view-link. Optionele filters: status, per_page, search, parent_id.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'status' => [
                                'type' => 'string',
                                'description' => 'Pagina status, bv. publish of draft.',
                            ],
                            'per_page' => [
                                'type' => 'integer',
                                'description' => 'Aantal items (max 20).',
                            ],
                            'search' => [
                                'type' => 'string',
                                'description' => 'Zoekterm.',
                            ],
                            'parent_id' => [
                                'type' => 'integer',
                                'description' => 'Parent pagina ID.',
                            ],
                        ],
                        'required' => [],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'create_page',
                    'description' => 'Maak een nieuwe pagina aan met titel en optioneel content, status, slug en parent_id.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'title' => [
                                'type' => 'string',
                                'description' => 'Titel van de pagina.',
                            ],
                            'content' => [
                                'type' => 'string',
                                'description' => 'Inhoud van de pagina (optioneel).',
                            ],
                            'status' => [
                                'type' => 'string',
                                'description' => 'Status, bv. draft of publish.',
                            ],
                            'slug' => [
                                'type' => 'string',
                                'description' => 'Slug voor de pagina (optioneel).',
                            ],
                            'parent_id' => [
                                'type' => 'integer',
                                'description' => 'Parent pagina ID (optioneel).',
                            ],
                        ],
                        'required' => ['title'],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_page_blocks',
                    'description' => 'Haal Gutenberg blokken op van een pagina op basis van page_id. Geeft blokken met name en attributes terug.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'page_id' => [
                                'type' => 'integer',
                                'description' => 'ID van de pagina.',
                            ],
                        ],
                        'required' => ['page_id'],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'add_block_to_page',
                    'description' => 'Voeg een Gutenberg blok toe aan een pagina. Vereist page_id en block_name. Optioneel attributes, inner_html en position (append/prepend).',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'page_id' => [
                                'type' => 'integer',
                                'description' => 'ID van de pagina.',
                            ],
                            'block_name' => [
                                'type' => 'string',
                                'description' => 'Block name, bv. core/paragraph of madeit/block-container.',
                            ],
                            'attributes' => [
                                'type' => 'object',
                                'description' => 'Block attributes object.',
                            ],
                            'inner_html' => [
                                'type' => 'string',
                                'description' => 'Inner HTML content voor het blok.',
                            ],
                            'position' => [
                                'type' => 'string',
                                'description' => 'append of prepend.',
                            ],
                        ],
                        'required' => ['block_name'],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'set_page_meta',
                    'description' => 'Genereer en bewaar meta titel en meta beschrijving voor een pagina in Yoast of RankMath. Optioneel eigen title/description doorgeven.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'page_id' => [
                                'type' => 'integer',
                                'description' => 'ID van de pagina.',
                            ],
                            'title' => [
                                'type' => 'string',
                                'description' => 'Meta titel (optioneel).',
                            ],
                            'description' => [
                                'type' => 'string',
                                'description' => 'Meta beschrijving (optioneel).',
                            ],
                            'provider' => [
                                'type' => 'string',
                                'description' => 'yoast, rankmath, of auto (default).',
                            ],
                        ],
                        'required' => ['page_id'],
                        'additionalProperties' => false,
                    ],
                ],
            ],
        ];
    }
}

if (!function_exists('madeit_admin_chat_run_tool')) {
    function madeit_admin_chat_run_tool($name, $args) {
        switch ($name) {
            case 'get_site_info':
                return madeit_admin_chat_tool_get_site_info();
            case 'get_post_types':
                return madeit_admin_chat_tool_get_post_types();
            case 'get_posts':
                return madeit_admin_chat_tool_get_posts($args);
            case 'get_plugins':
                return madeit_admin_chat_tool_get_plugins();
            case 'get_pages':
                return madeit_admin_chat_tool_get_pages($args);
            case 'create_page':
                return madeit_admin_chat_tool_create_page($args);
            case 'get_page_blocks':
                return madeit_admin_chat_tool_get_page_blocks($args);
            case 'add_block_to_page':
                return madeit_admin_chat_tool_add_block_to_page($args);
            case 'set_page_meta':
                return madeit_admin_chat_tool_set_page_meta($args);
            default:
                return ['error' => 'Unknown tool'];
        }
    }
}

if (!function_exists('madeit_admin_chat_tool_get_site_info')) {
    function madeit_admin_chat_tool_get_site_info() {
        return [
            'name' => get_bloginfo('name'),
            'url' => home_url('/'),
            'wp_version' => get_bloginfo('version'),
            'theme' => wp_get_theme()->get('Name'),
            'locale' => get_locale(),
            'timezone' => get_option('timezone_string'),
        ];
    }
}

if (!function_exists('madeit_admin_chat_tool_get_post_types')) {
    function madeit_admin_chat_tool_get_post_types() {
        $types = get_post_types(['public' => true], 'objects');
        $result = [];
        foreach ($types as $type) {
            $result[] = [
                'name' => $type->name,
                'label' => $type->label,
                'description' => $type->description,
            ];
        }
        return $result;
    }
}

if (!function_exists('madeit_admin_chat_tool_get_posts')) {
    function madeit_admin_chat_tool_get_posts($args) {
        $post_type = isset($args['post_type']) ? sanitize_key($args['post_type']) : 'post';
        $status = isset($args['status']) ? sanitize_key($args['status']) : 'publish';
        $per_page = isset($args['per_page']) ? (int) $args['per_page'] : 5;
        $per_page = min(max($per_page, 1), 20);
        $search = isset($args['search']) ? sanitize_text_field($args['search']) : '';

        $posts = get_posts([
            'post_type' => $post_type,
            'post_status' => $status,
            'posts_per_page' => $per_page,
            's' => $search,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        $result = [];
        foreach ($posts as $post) {
            $result[] = [
                'id' => $post->ID,
                'title' => get_the_title($post),
                'type' => $post->post_type,
                'status' => $post->post_status,
                'date' => get_the_date('c', $post),
                'link' => get_permalink($post),
                'excerpt' => wp_trim_words($post->post_content, 24),
            ];
        }

        return $result;
    }
}

if (!function_exists('madeit_admin_chat_tool_get_plugins')) {
    function madeit_admin_chat_tool_get_plugins() {
        if (!current_user_can('activate_plugins')) {
            return ['error' => 'Geen permissies om plugins te bekijken.'];
        }

        if (!function_exists('get_plugins')) {
            require_once ABSPATH.'wp-admin/includes/plugin.php';
        }

        $plugins = get_plugins();
        $active = get_option('active_plugins', []);
        $result = [];
        foreach ($plugins as $path => $plugin) {
            $result[] = [
                'name' => $plugin['Name'] ?? $path,
                'version' => $plugin['Version'] ?? '',
                'active' => in_array($path, $active, true),
            ];
        }

        return $result;
    }
}

if (!function_exists('madeit_admin_chat_tool_get_pages')) {
    function madeit_admin_chat_tool_get_pages($args) {
        $status = isset($args['status']) ? sanitize_key($args['status']) : 'publish';
        $per_page = isset($args['per_page']) ? (int) $args['per_page'] : 10;
        $per_page = min(max($per_page, 1), 20);
        $search = isset($args['search']) ? sanitize_text_field($args['search']) : '';
        $parent_id = isset($args['parent_id']) ? (int) $args['parent_id'] : 0;

        $query_args = [
            'post_type' => 'page',
            'post_status' => $status,
            'posts_per_page' => $per_page,
            's' => $search,
            'orderby' => 'date',
            'order' => 'DESC',
        ];
        if ($parent_id > 0) {
            $query_args['post_parent'] = $parent_id;
        }

        $pages = get_posts($query_args);
        $result = [];
        foreach ($pages as $page) {
            $result[] = [
                'id' => $page->ID,
                'title' => get_the_title($page),
                'status' => $page->post_status,
                'date' => get_the_date('c', $page),
                'edit_link' => admin_url('post.php?post='.$page->ID.'&action=edit'),
                'view_link' => get_permalink($page),
            ];
        }

        return $result;
    }
}

if (!function_exists('madeit_admin_chat_tool_create_page')) {
    function madeit_admin_chat_tool_create_page($args) {
        if (!current_user_can('edit_pages')) {
            return ['error' => 'Geen permissies om pagina\'s aan te maken.'];
        }

        $title = isset($args['title']) ? sanitize_text_field($args['title']) : '';
        if ('' === $title) {
            return ['error' => 'Titel ontbreekt.'];
        }

        $content = isset($args['content']) ? wp_kses_post($args['content']) : '';
        $status = isset($args['status']) ? sanitize_key($args['status']) : 'draft';
        $slug = isset($args['slug']) ? sanitize_title($args['slug']) : '';
        $parent_id = isset($args['parent_id']) ? (int) $args['parent_id'] : 0;

        $postarr = [
            'post_type' => 'page',
            'post_title' => $title,
            'post_content' => $content,
            'post_status' => $status,
            'post_parent' => $parent_id,
        ];
        if (!empty($slug)) {
            $postarr['post_name'] = $slug;
        }

        $post_id = wp_insert_post($postarr, true);
        if (is_wp_error($post_id)) {
            return ['error' => $post_id->get_error_message()];
        }

        return [
            'id' => $post_id,
            'edit_link' => admin_url('post.php?post='.$post_id.'&action=edit'),
            'view_link' => get_permalink($post_id),
            'status' => get_post_status($post_id),
            'title' => get_the_title($post_id),
        ];
    }
}

if (!function_exists('madeit_admin_chat_tool_get_page_blocks')) {
    function madeit_admin_chat_tool_get_page_blocks($args) {
        if (!current_user_can('edit_pages')) {
            return ['error' => 'Geen permissies om pagina\'s te bekijken.'];
        }

        $page_id = isset($args['page_id']) ? (int) $args['page_id'] : 0;
        if ($page_id <= 0) {
            return ['error' => 'Ongeldig page_id.'];
        }

        $post = get_post($page_id);
        if (!$post || $post->post_type !== 'page') {
            return ['error' => 'Pagina niet gevonden.'];
        }

        $blocks = parse_blocks($post->post_content);
        $result = [];
        foreach ($blocks as $block) {
            $result[] = [
                'block_name' => $block['blockName'],
                'attrs' => $block['attrs'],
                'inner_html' => $block['innerHTML'],
            ];
        }

        return [
            'page_id' => $page_id,
            'title' => get_the_title($page_id),
            'edit_link' => admin_url('post.php?post='.$page_id.'&action=edit'),
            'blocks' => $result,
        ];
    }
}

if (!function_exists('madeit_admin_chat_tool_add_block_to_page')) {
    function madeit_admin_chat_tool_add_block_to_page($args) {
        if (!current_user_can('edit_pages')) {
            return ['error' => 'Geen permissies om pagina\'s te wijzigen.'];
        }

        $page_id = isset($args['page_id']) ? (int) $args['page_id'] : 0;
        if ($page_id <= 0 && isset($_GET['post'])) {
            $page_id = (int) $_GET['post'];
        }
        $block_name = isset($args['block_name']) ? sanitize_text_field($args['block_name']) : '';
        if ($page_id <= 0 || '' === $block_name) {
            return ['error' => 'page_id of context ontbreekt, en block_name is verplicht.'];
        }

        $post = get_post($page_id);
        if (!$post || $post->post_type !== 'page') {
            return ['error' => 'Pagina niet gevonden.'];
        }

        $attributes = isset($args['attributes']) && is_array($args['attributes']) ? $args['attributes'] : [];
        $inner_html = isset($args['inner_html']) ? (string) $args['inner_html'] : '';
        $position = isset($args['position']) ? sanitize_key($args['position']) : 'append';

        if ('core/heading' === $block_name) {
            $level = isset($attributes['level']) ? (int) $attributes['level'] : 2;
            if ($level < 1 || $level > 6) {
                $level = 2;
            }
            $attributes['level'] = $level;
            $text = trim(wp_strip_all_tags($inner_html));
            if ('' === $text) {
                $text = 'Heading';
            }
            $inner_html = sprintf(
                '<h%d class="wp-block-heading">%s</h%d>',
                $level,
                esc_html($text),
                $level
            );
        }

        if ('core/paragraph' === $block_name) {
            if (!preg_match('/<p\b/i', $inner_html)) {
                $content = wp_kses_post($inner_html);
                $inner_html = '<p class="wp-block-paragraph">'.$content.'</p>';
            }
        }

        $block = [
            'blockName' => $block_name,
            'attrs' => $attributes,
            'innerBlocks' => [],
            'innerHTML' => $inner_html,
            'innerContent' => [$inner_html],
        ];

        $blocks = parse_blocks($post->post_content);
        if ('prepend' === $position) {
            array_unshift($blocks, $block);
        } else {
            $blocks[] = $block;
        }

        // Normalize/validate block structure via round-trip before saving.
        $blocks = parse_blocks(serialize_blocks($blocks));
        $updated = serialize_blocks($blocks);
        $updated_id = wp_update_post([
            'ID' => $page_id,
            'post_content' => $updated,
        ], true);

        if (is_wp_error($updated_id)) {
            return ['error' => $updated_id->get_error_message()];
        }

        return [
            'page_id' => $page_id,
            'status' => get_post_status($page_id),
            'edit_link' => admin_url('post.php?post='.$page_id.'&action=edit'),
            'client_action' => [
                'type' => 'insert_block',
                'page_id' => $page_id,
                'block_serialized' => serialize_blocks([$block]),
            ],
        ];
    }
}

if (!function_exists('madeit_admin_chat_tool_set_page_meta')) {
    function madeit_admin_chat_tool_set_page_meta($args) {
        if (!current_user_can('edit_pages')) {
            return ['error' => 'Geen permissies om pagina\'s te wijzigen.'];
        }

        $page_id = isset($args['page_id']) ? (int) $args['page_id'] : 0;
        if ($page_id <= 0) {
            return ['error' => 'Ongeldig page_id.'];
        }

        $post = get_post($page_id);
        if (!$post || $post->post_type !== 'page') {
            return ['error' => 'Pagina niet gevonden.'];
        }

        $provider = isset($args['provider']) ? sanitize_key($args['provider']) : 'auto';
        if (!in_array($provider, ['auto', 'yoast', 'rankmath'], true)) {
            $provider = 'auto';
        }

        $title = isset($args['title']) ? sanitize_text_field($args['title']) : '';
        $description = isset($args['description']) ? sanitize_text_field($args['description']) : '';

        if ($title === '' || $description === '') {
            $ai_meta = madeit_admin_chat_generate_meta_with_ai($post, madeit_admin_chat_tool_get_site_info());
            if ($title === '' && !empty($ai_meta['title'])) {
                $title = $ai_meta['title'];
            }
            if ($description === '' && !empty($ai_meta['description'])) {
                $description = $ai_meta['description'];
            }
        }

        if ($title === '') {
            $title = get_the_title($page_id);
        }
        if ($description === '') {
            $excerpt = wp_strip_all_tags($post->post_excerpt);
            if ($excerpt === '') {
                $excerpt = wp_strip_all_tags($post->post_content);
            }
            $description = wp_html_excerpt($excerpt, 160, '');
        }

        $title = trim($title);
        $description = trim($description);

        if (!function_exists('is_plugin_active')) {
            require_once ABSPATH.'wp-admin/includes/plugin.php';
        }

        $applied = [];

        if ($provider === 'yoast' || $provider === 'auto') {
            if ($provider === 'auto' || is_plugin_active('wordpress-seo/wp-seo.php')) {
                update_post_meta($page_id, '_yoast_wpseo_title', $title);
                update_post_meta($page_id, '_yoast_wpseo_metadesc', $description);
                $applied[] = 'yoast';
            }
        }

        if ($provider === 'rankmath' || $provider === 'auto') {
            if ($provider === 'auto' || is_plugin_active('seo-by-rank-math/rank-math.php')) {
                update_post_meta($page_id, 'rank_math_title', $title);
                update_post_meta($page_id, 'rank_math_description', $description);
                $applied[] = 'rankmath';
            }
        }

        if (empty($applied)) {
            return [
                'error' => 'Geen SEO plugin gevonden (Yoast of RankMath) voor opslaan.',
                'title' => $title,
                'description' => $description,
            ];
        }

        return [
            'page_id' => $page_id,
            'title' => $title,
            'description' => $description,
            'providers' => $applied,
        ];
    }
}

if (!function_exists('madeit_admin_chat_generate_meta_with_ai')) {
    function madeit_admin_chat_generate_meta_with_ai($post, $site_info) {
        if (empty(MADEIT_ADMIN_CHAT_OPENAI_API_KEY)) {
            return [];
        }

        if (!$post instanceof WP_Post) {
            return [];
        }

        $content = wp_strip_all_tags($post->post_content);
        $content = wp_html_excerpt($content, 1500, '');
        $excerpt = wp_strip_all_tags($post->post_excerpt);
        if ($excerpt === '') {
            $excerpt = wp_html_excerpt(wp_strip_all_tags($post->post_content), 300, '');
        }

        $messages = [
            [
                'role' => 'system',
                'content' => 'Je bent een SEO assistent voor WordPress. Geef enkel JSON terug met exact deze keys: "title" en "description". Max 60 tekens voor titel, max 160 tekens voor description. Geen Markdown, geen extra tekst.',
            ],
            [
                'role' => 'user',
                'content' => 'Website: '.$site_info['name'].' ('.$site_info['url'].')\nPagina: '.$post->post_title.'\nURL: '.get_permalink($post).'\nUittreksel: '.$excerpt.'\nInhoud (ingekort): '.$content,
            ],
        ];

        $payload = madeit_admin_chat_openai_request($messages, []);
        if (!is_array($payload)) {
            return [];
        }

        $content = $payload['choices'][0]['message']['content'] ?? '';
        if (!is_string($content) || $content === '') {
            return [];
        }

        $content = trim($content);
        $content = preg_replace('/^```(json)?/i', '', $content);
        $content = preg_replace('/```$/', '', $content);
        $content = trim($content);

        $decoded = json_decode($content, true);
        if (!is_array($decoded)) {
            return [];
        }

        $title = isset($decoded['title']) ? sanitize_text_field($decoded['title']) : '';
        $description = isset($decoded['description']) ? sanitize_text_field($decoded['description']) : '';

        if ($title === '' && $description === '') {
            return [];
        }

        return [
            'title' => $title,
            'description' => $description,
        ];
    }
}
