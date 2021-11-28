<?php

function madeit_support_footer_notice($text) {
    $text = '<a href="https://www.madeit.be/contact">Made I.T. Website</a> • <a href="#TB_inline?width=600&height=550&inlineId=modal-madeit-support" title="Made IT Support Ticket aanmaken" class="thickbox">Made I.T. Support Ticket</a> • ' . $text;
    return $text;
}
add_filter('update_footer', 'madeit_support_footer_notice', 99, 1);

function madeit_support_init() {
    add_thickbox();
}
add_action('admin_init', 'madeit_support_init');

function madeit_support_popup() {
    global $current_user;
    wp_get_current_user();
    ?>
    <div id="modal-madeit-support" style="display:none;">
        <p>Heb je een probleem of een vraag over de website? Stel ze hier, het Made I.T. Support team contacteert je zo snel mogelijk.</p>
        <form action="POST" method="" id="madeitSupportForm">
            <input type="hidden" name="action" value="madeit_support_ticket">
            <input type="hidden" name="ms_user_id" value="<?php echo $current_user->ID; ?>">
            <input type="hidden" name="ms_current_page" value="<?php echo get_current_screen()->id; ?>">
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

function madeit_support_ticket_store() {
    wp_mail('support@madeit.be', 'Support Ticket ' . $_POST['ms_subject'] . ' - ' . get_home_url(), print_r($_POST, true));
    echo json_encode(['success' => true]);
	wp_die();
}
add_action('wp_ajax_madeit_support_ticket', 'madeit_support_ticket_store');
