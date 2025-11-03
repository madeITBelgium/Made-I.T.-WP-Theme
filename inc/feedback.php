<?php

function feedback_add_admin_script()
{
    if (!array_intersect(wp_get_current_user()->roles, ['administrator'])) {
        return;
    }

    echo feedback_script();
}
add_action('admin_head', 'feedback_add_admin_script');

function feedback_script()
{
    $scriptHtml = '';
    if (is_user_logged_in()) {
        $user = wp_get_current_user();
        $scriptHtml .= '<script>
        window.feedbucketConfig = {
            reporter: {
                name: "'.esc_js($user->display_name).'",
                email: "'.esc_js($user->user_email).'",
            }
        }
        </script>';
    }

    $scriptHtml .= '
    <script type="text/javascript">
        (function(k) {
            s=document.createElement("script");s.module=true;s.defer=true;
            s.src="'.esc_url('https://www.websitetool.be/feedbucket.js').'";
            s.dataset.feedbucket=k;document.head.appendChild(s);
        })("'.esc_js('MADEIT').'")
    </script>';

    return $scriptHtml;
}
