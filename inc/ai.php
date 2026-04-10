<?php

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('madeit_ai_debug')) {
    function madeit_ai_debug($label, $data = null): void {
        // if (!defined('WP_DEBUG') || !WP_DEBUG) {
        // 	return;
        // }

        $message = '[madeit-ai] '.$label;
        if (null !== $data) {
            $encoded = wp_json_encode($data);
            if (is_string($encoded) && $encoded !== '') {
                $message .= ' '.$encoded;
            }
        }

        error_log($message);
    }
}

if (!function_exists('madeit_ai_portal_request')) {
    function madeit_ai_portal_request(string $path, array $body, array $args = []) {
        $timeout = isset($args['timeout']) ? max(5, (int) $args['timeout']) : 60;

        $base_url = 'https://portal.madeit.be/';
        $use_jono = false;
        if (defined('MADEIT_AI_SERVER_URL') && is_string(MADEIT_AI_SERVER_URL) && MADEIT_AI_SERVER_URL !== '') {
            $base_url = MADEIT_AI_SERVER_URL;
        } elseif (defined('MADEIT_AI_USE_JONO') && MADEIT_AI_USE_JONO) {
            $base_url = 'https://app.jono.be/';
            $use_jono = true;
        }

        if (!$use_jono && stripos((string) $base_url, 'app.jono.be') !== false) {
            $use_jono = true;
        }

        $url = trailingslashit($base_url).ltrim($path, '/');

        $body['website'] = home_url('/');

        $headers = [
            'Content-Type' => 'application/json',
        ];

        if ($use_jono) {
            $api_key = defined('MADEIT_ADMIN_CHAT_OPENAI_API_KEY') ? trim((string) MADEIT_ADMIN_CHAT_OPENAI_API_KEY) : '';
            if ($api_key === '') {
                return new WP_Error('madeit_ai_missing_jono_key', __('API key ontbreekt voor Jono requests (MADEIT_ADMIN_CHAT_OPENAI_API_KEY).', 'madeit'));
            }

            $headers['Authorization'] = 'Bearer '.$api_key;
        }

        madeit_ai_debug('request', [
            'url' => $url,
            'body' => $body,
        ]);

        $response = wp_remote_post($url, [
            'headers' => $headers,
            'timeout' => $timeout,
            'body' => wp_json_encode($body),
        ]);

        if (is_wp_error($response)) {
            madeit_ai_debug('request_error', [
                'message' => $response->get_error_message(),
            ]);
            return $response;
        }

        $status = wp_remote_retrieve_response_code($response);
        $raw_body = wp_remote_retrieve_body($response);
        $payload = json_decode($raw_body, true);

        if (!is_array($payload)) {
            return new WP_Error('madeit_ai_invalid_response', __('Ongeldige AI response ontvangen.', 'madeit'), [
                'status' => $status,
                'body' => $raw_body,
            ]);
        }

        return $payload;
    }
}

if (!function_exists('madeit_ai_chat_completion')) {
    function madeit_ai_chat_completion(array $messages, array $args = []) {
        $model = isset($args['model']) ? (string) $args['model'] : 'gpt-5.3-chat';
        $temperature = isset($args['temperature']) ? (float) $args['temperature'] : 1;
        $max_tokens = isset($args['max_tokens']) ? max(1, (int) $args['max_tokens']) : 4000;
        $tools = isset($args['tools']) && is_array($args['tools']) ? $args['tools'] : [];

        $body = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => $temperature,
            'max_tokens' => $max_tokens,
            'tools' => $tools,
            'tool_choice' => isset($args['tool_choice']) ? $args['tool_choice'] : (empty($tools) ? null : 'auto'),
        ];

        if (empty($body['tool_choice'])) {
            unset($body['tool_choice']);
        }

        return madeit_ai_portal_request('/api/v1/chat/completions', $body, $args);
    }
}

if (!function_exists('madeit_ai_response_api')) {
    function madeit_ai_response_api($input, array $args = []) {
        $model = isset($args['model']) ? (string) $args['model'] : 'gpt-5.3-chat';
        $temperature = isset($args['temperature']) ? (float) $args['temperature'] : 1;

        $body = [
            'model' => $model,
            'input' => $input,
            'temperature' => $temperature,
        ];

        if (isset($args['tools']) && is_array($args['tools'])) {
            $body['tools'] = $args['tools'];
        }

        if (isset($args['max_output_tokens'])) {
            $body['max_output_tokens'] = max(1, (int) $args['max_output_tokens']);
        }

        return madeit_ai_portal_request('/api/v1/responses', $body, $args);
    }
}

if(!function_exists('madeit_ai_rest_api_init')) {
    function madeit_ai_rest_api_init() {
        register_rest_route('madeit-ai/v1', '/chat/completions', [
            'methods' => 'POST',
            'callback' => 'madeit_rest_ai_rest_chat_completions',
            'permission_callback' => function() {
                return current_user_can('manage_options');
            },
        ]);

        register_rest_route('madeit-ai/v1', '/responses', [
            'methods' => 'POST',
            'callback' => 'madeit_rest_ai_rest_responses',
            'permission_callback' => function() {
                return current_user_can('manage_options');
            },
        ]);
    }
    add_action('rest_api_init', 'madeit_ai_rest_api_init');
}

if(!function_exists('madeit_rest_ai_rest_chat_completions')) {
    function madeit_rest_ai_rest_chat_completions(WP_REST_Request $request) {
        $params = $request->get_json_params();
        $result = madeit_ai_chat_completion($params['messages'] ?? [], $params);
        if (is_wp_error($result)) {
            return new WP_REST_Response([
                'error' => $result->get_error_message(),
                'details' => $result->get_error_data(),
            ], 500);
        }
        return new WP_REST_Response($result, 200);
    }
}

if(!function_exists('madeit_rest_ai_rest_responses')) {
    function madeit_rest_ai_rest_responses(WP_REST_Request $request) {
        $params = $request->get_json_params();
        $result = madeit_ai_response_api($params['input'] ?? '', $params);
        if (is_wp_error($result)) {
            return new WP_REST_Response([
                'error' => $result->get_error_message(),
                'details' => $result->get_error_data(),
            ], 500);
        }
        return new WP_REST_Response($result, 200);
    }
}