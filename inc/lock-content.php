<?php

function madeit_filter_lock_content($content)
{
    $p = new WP_HTML_Tag_Processor( $content );
    if($p->next_tag(['tag_name' => 'div', 'class_name' => 'madeit-lock-content'])) {
        //if cookie madeit_unlock exists, show content
        if(isset($_COOKIE['madeit_unlock'])) {
            $p->remove_class( 'madeit-lock-content' );
            return $p->get_updated_html();
        } else {
            //if cookie madeit_unlock doesn't exist, show lock content
            include_once(__DIR__.'/DomDocument/HTML5DOMDocument.php');
            $dom = new HTML5DOMDocument();
            $dom->loadHTML($content);
            $nodes = $dom->querySelectorAll('.madeit-lock-content');
            foreach ($nodes as $node) {
                $node->parentNode->removeChild($node);

            }

            $content = '<div class="madeit-locked-content">' . $dom->saveHTML() . '</div>';
            ob_start();
            ?>
            <div class="madeit-unlock-content my-3 py-5 border-top">
                <h4 class="mb-2 text-center">Deze inhoud is beveiligd</h4>
                <p class="text-center">Deze inhoud bevat vertrouwelijke informatie. Om deze inhoud te bekijken, moet je jouw e-mailadres invullen. Zo kunnen we jouw identiteit verifiëren.</p>
                <div id="madeit-unlock-loading" class="text-center mb-2" style="display: none;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <form id="madeit-unlock-form">
                	<input type="hidden" name="action" value="madeit_unlock_content">
                	<input type="hidden" name="post_id" id="madeit-unlock-postid" value="<?php echo get_the_ID(); ?>">

                    <div class="form-group mb-2">
                        <input type="email" class="form-control" id="madeit-unlock-email" placeholder="E-mailadres">
                    </div>
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input" type="checkbox" id="madeit-unlock-newsletter">
                        <label class="form-check-label" for="madeit-unlock-newsletter">Ja, ik wil de <?php echo get_bloginfo('name'); ?> nieuwsbrief ontvangen.</label>
                    </div>
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input" type="checkbox" id="madeit-unlock-lead">
                        <label class="form-check-label" for="madeit-unlock-lead">Ja, ik wil dat <?php echo get_bloginfo('name'); ?> mij contacteer voor vrijblijvende info en offerte.</label>
                    </div>
                    <div class="text-center mb-2">
                        <button class="btn btn-primary" type="submit" id="madeit-unlock">Inhoud weergeven</button>
                    </div>
                </form>
            </div>
            <?php
            $content .= ob_get_clean();
        }
    }

    return $content;
}
add_filter('the_content', 'madeit_filter_lock_content');

function madeit_unlock_ajax()
{
    $email = $_POST['email'];
    $post_id = $_POST['post_id'];
    $newsletter = $_POST['newsletter'];
    $lead = $_POST['lead'];
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $url = get_permalink($post_id);

    //set cookie for 1 year
    setcookie('madeit_unlock', $email, time() + (86400 * 365), "/");

    //set comment_author_email_

    $past = time() - YEAR_IN_SECONDS;
    setcookie( 'comment_author_' . COOKIEHASH, '', time() + (86400 * 365));
    setcookie( 'comment_author_email_' . COOKIEHASH, $email, time() + (86400 * 365));
    setcookie( 'comment_author_url_' . COOKIEHASH, time() + (86400 * 365));

    //send mail
    $to = get_option('admin_email');
    $subject = 'Nieuwe unlock';
    $body = "Beste,\n\nEr is een nieuwe unlock voor de pagina " . $url . " met het e-mailadres " . $email . ".\n\n";
    $body .= "\n\n";
    $body .= 'IP: ' . $ip . "\n";
    $body .= 'User agent: ' . $userAgent . "\n";
    $body .= 'Nieuwsbrief: ' . ($newsletter ? 'ja' : 'nee') . "\n";
    $body .= 'Lead: ' . ($lead ? 'ja' : 'nee') . "\n";
    
    if($newsletter || $lead) {
        wp_mail($to, $subject, $body);
    }

    $url .= '?madeit_unlock=1&time=' . time() . '&email=' . $email;

    error_log('UNLOCK: ' . $email . ' - ' . $ip);

    wp_send_json_response(['success' => true, 'url' => $url]);
}
add_action('wp_ajax_madeit_unlock_content', 'madeit_unlock_ajax');
add_action('wp_ajax_nopriv_madeit_unlock_content', 'madeit_unlock_ajax');
