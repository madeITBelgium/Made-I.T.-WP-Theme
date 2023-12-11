<?php

function madeit_review_form()
{
    ob_start();
    $name = $_POST['reviewer-name'] ?? $_GET['name'] ?? '';
    $email = $_POST['reviewer-email'] ?? $_GET['email'] ?? '';
    $title = $_POST['review-title'] ?? $_GET['title'] ?? '';
    $description = $_POST['review-description'] ?? $_GET['description'] ?? '';
    $rating = $_POST['review-rating'] ?? $_GET['rating'] ?? 5;
    ?>
    <form action="" id="madeit-review-form" method="POST">
        <div class="loading" style="display: none;">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only"><?php _e('Laden...', 'madeit'); ?></span>
            </div>
        </div>

        <div class="alert alert-success" role="alert" style="display: none;">
            <?php _e('Bedankt voor uw review!', 'madeit'); ?>
        </div>


        <div class="forward" style="display: none;">
            <?php if(defined('MADEIT_REVIEWS_GOOGLE_ID')) { ?>
                <div class="card shadow my-3">
                    <div class="card-body">
                        Het zou ons helpen als je deze review ook op Google achterlaat. Klik op de knop hieronder om naar Google te gaan.<br>
                        <div class="text-center">
                            <a href="https://search.google.com/local/writereview?placeid=<?php echo MADEIT_REVIEWS_GOOGLE_ID; ?>" class="btn btn-primary mt-3">Review op Google achterlaten</a>
                        </div>
                    </div>
                </div>
            <?php } ?>
        </div>

        <div class="form">
            <!-- 5 star rating -->
            <div class="rating mx-auto mb-3" style="width: 20rem">
                <input id="rating-5" type="radio" name="review-rating" value="5" <?php if($rating == 5) { echo 'CHECKED'; } ?> /><label for="rating-5"><i class="fas fa-2x fa-star"></i></label>
                <input id="rating-4" type="radio" name="review-rating" value="4" <?php if($rating == 4) { echo 'CHECKED'; } ?> /><label for="rating-4"><i class="fas fa-2x fa-star"></i></label>
                <input id="rating-3" type="radio" name="review-rating" value="3" <?php if($rating == 3) { echo 'CHECKED'; } ?> /><label for="rating-3"><i class="fas fa-2x fa-star"></i></label>
                <input id="rating-2" type="radio" name="review-rating" value="2" <?php if($rating == 2) { echo 'CHECKED'; } ?> /><label for="rating-2"><i class="fas fa-2x fa-star"></i></label>
                <input id="rating-1" type="radio" name="review-rating" value="1" <?php if($rating == 1) { echo 'CHECKED'; } ?> /><label for="rating-1"><i class="fas fa-2x fa-star"></i></label>
            </div>
            <style>
                .rating {
                    direction: rtl;
                    unicode-bidi: bidi-override;
                    color: #ddd; 
                }
                .rating input {
                    display: none;
                }
                .rating label:hover,
                .rating label:hover ~ label,
                .rating input:checked + label,
                .rating input:checked + label ~ label {
                    color: #ffc107;
                }
                </style>
            <!-- /5 star rating -->

            <!-- Reviewer name -->
            <div class="form-group mb-3">
                <label for="reviewer-name"><?php _e('Naam', 'madeit'); ?></label>
                <input type="text" class="form-control" id="reviewer-name" name="reviewer-name" placeholder="">
            </div>

            <!-- Reviewer email -->
            <div class="form-group mb-3">
                <label for="reviewer-email"><?php _e('E-mailadres', 'madeit'); ?></label>
                <input type="email" class="form-control" id="reviewer-email" name="reviewer-email" placeholder="">
            </div>


            <!-- Review title -->
            <div class="form-group mb-3">
                <label for="review-title"><?php _e('Titel', 'madeit'); ?></label>
                <input type="text" class="form-control" id="review-title" name="review-title" placeholder="">
            </div>

            <!-- Review description -->
            <div class="form-group mb-3">
                <label for="review-description"><?php _e('Beschrijving', 'madeit'); ?></label>
                <textarea class="form-control" id="review-description" name="review-description" rows="3"></textarea>
            </div>

            <!-- submit -->
            <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-primary"><?php _e('Verzenden', 'madeit'); ?></button>
            </div>
        </div>
    </form>
    <?php
    return ob_get_clean();
}
add_shortcode('review_form', 'madeit_review_form');

function madeit_review_save_ajax()
{
    $name = $_POST['reviewer_name'];
    $email = $_POST['email'];
    $rating = $_POST['rating'];
    $title = $_POST['title'];
    $description = $_POST['description'];

    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $emailAdmin = get_option('admin_email');

    wp_mail($emailAdmin, 'Er is een nieuwe review op ' . get_bloginfo('name') . ' achtergelaten.', "Beste,\nEr is een nieuwe review op " . get_bloginfo('name') . " achtergelaten.\n\nNaam: " . $name . "\nE-mailadres: " . $email . "\nRating: " . $rating . "\nTitel: " . $title . "\nBeschrijving: " . $description . "\n\nIP: " . $ip . "\nUser agent: " . $userAgent);
    wp_send_json_success(['success' => true]);
}
add_action('wp_ajax_madeit_submit_review', 'madeit_review_save_ajax');
add_action('wp_ajax_nopriv_madeit_submit_review', 'madeit_review_save_ajax');