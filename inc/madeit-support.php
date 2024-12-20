<?php

function madeit_support_footer_notice($text)
{
    $text = '<a href="https://www.madeit.be/contact">Made I.T. Website</a> • <a href="#TB_inline?width=600&height=550&inlineId=modal-madeit-support" title="Made IT Support Ticket aanmaken" class="thickbox">Made I.T. Support Ticket</a> • '.$text;

    return $text;
}
add_filter('update_footer', 'madeit_support_footer_notice', 99, 1);

function madeit_support_init()
{
    add_thickbox();
}
add_action('admin_init', 'madeit_support_init');

function madeit_support_popup()
{
    global $current_user;
    wp_get_current_user(); ?>
    <div id="modal-madeit-support" style="display:none;">
        <div style=" padding: 5px 10px;">
            <p>Heb je een probleem of een vraag over de website? Stel ze hier, het Made I.T. Support team contacteert je zo snel mogelijk.</p>
            <form action="POST" method="" id="madeitSupportForm">
                <input type="hidden" name="action" value="madeit_support_ticket">
                <input type="hidden" name="ms_user_id" value="<?php echo $current_user->ID; ?>">
                <input type="hidden" name="ms_current_page" value="<?php echo get_current_screen()->id; ?>">
                <input type="hidden" name="ms_current_url" value="<?php echo admin_url($_SERVER['REQUEST_URI']); ?>">
                <input type="hidden" name="ms_website" value="<?php echo get_home_url(); ?>">
                <div class="input-text-wrap" style="margin-bottom: 10px;">
                    <label for="ms_name">Naam: *</label><br>
                    <input type="text" name="ms_name" id="ms_name" value="<?php echo $current_user->display_name; ?>" style="width: 100%">
                </div>
                <div class="input-text-wrap" style="margin-bottom: 10px;">
                    <label for="ms_email">E-mailadres: *</label><br>
                    <input type="email" name="ms_email" id="ms_email" value="<?php echo $current_user->user_email; ?>" style="width: 100%">
                </div>
                <div class="input-text-wrap" style="margin-bottom: 10px;">
                    <label for="ms_phone">Telefoonnummer:</label><br>
                    <input type="text" name="ms_phone" id="ms_phone" value="" style="width: 100%">
                </div>
                <div class="input-text-wrap" style="margin-bottom: 10px;">
                    <label for="ms_subject">Onderwerp: *</label><br>
                    <input type="text" name="ms_subject" id="ms_subject" value="" style="width: 100%">
                </div>
                <div class="input-text-wrap" style="margin-bottom: 10px;">
                    <label for="ms_text">Vraag/Onderwerp: *</label><br>
                    <textarea name="ms_text" id="ms_text" style="width: 100%" rows="5"></textarea>
                </div>
                <div style="text-align: center">
                    <input type="submit" name="ms_sent" class="button button-primary" value="Verzenden">
                </div>
            </form>
        </div>
    </div>


    <div id="modal-madeit-pagebuilder-help" style="display:none;">
        <div style=" padding: 5px 10px;">
            <p>
                Deze pagina is opgebouwd met de standaard Editor van WordPress. Made I.T. heeft enkele extra functies toegevoegt. Via deze popup kom je bij de nodige informatie om je verder te helpen met het aanpassen of bouwen van pagina's.
            </p>
            <?php
            //save in transient
            if(!get_transient('madeit_support_pagebuilder')) {
                set_transient('madeit_support_pagebuilder', file_get_contents('https://portal.madeit.be/support-pagebuilder?website=' .get_home_url()), 60*60*24);
            }
            echo get_transient('madeit_support_pagebuilder');
            ?>
        </div>
    </div>

    <script>
        jQuery('#madeitSupportForm').submit(function(e) {
            e.preventDefault();
            
            jQuery.post(ajaxurl, jQuery(this).serialize(), function(response) {
                tb_remove();
                alert('Support ticket is verstuurd. We nemen zo snel mogelijk contact met je op.');
            });
        })
    </script>
    <?php
}
add_action('admin_footer', 'madeit_support_popup');

function madeit_support_ticket_store()
{
    wp_mail('support@madeit.be', 'Support Ticket '.$_POST['ms_subject'].' - '.get_home_url(), json_encode($_POST, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
    wp_die();
}
add_action('wp_ajax_madeit_support_ticket', 'madeit_support_ticket_store');
