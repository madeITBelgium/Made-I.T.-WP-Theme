<style>
    :root {
        --bg-color: #f0f0f0;
        --tekst-color: #333;
        --gradient_1: linear-gradient(135deg, #f0f0f0, #ffffff);
    }

    .website-logo {
        z-index: 3;
        position: absolute;
        left: 20px;
        top: 20px;
        width: auto;
        height: 150px;
    }
    .website-logo img {
        width: 100%;
        height: 100%;
    }
    h1.heading-top_size {
        font-size: 3.75rem;
        text-transform: uppercase;
        margin: 30px 0;
        font-weight: 700;
    }
    h1.heading-top_size::before {
        content: '';
        display: block;
        width: 50%;
        height: auto;
        aspect-ratio: 1 / 1;
        border: 5px solid #f0f0f0;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
    }
    h2.heading-top_size {
        font-size: 2.5rem;
        font-weight: 400;
    }
    .scroll-down {
        position: absolute;
        z-index: 4;
        bottom: 1%;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    /* ANitmaion scroll down */
    .scroll-down:after {
        content: '';
        position: absolute;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.5);
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.7;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    .scroll-down svg {
        width: 24px;
        height: 24px;
        transition: transform 0.3s ease;
    }
    .scroll-down:hover svg {
        transform: translateY(5px);
    }
</style>


<!DOCTYPE html>
<html lang="BE">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nieuwe Website Binnenkort Online! | <?php echo get_bloginfo('name') ?></title>
        <link rel="stylesheet" href="/wp-content/themes/madeit/assets/bootstrap-5/style.css?ver=0.0.2">
        <link rel="stylesheet" href="/wp-includes/css/dist/block-library/style.min.css?ver=6.8.1">
  </head>
  <body>
      <div class="wp-block-madeit-block-content container-fluid">
        <div class="row">
            <div class="wp-block-madeit-block-content-column" style="padding-left:0px;padding-right:0px">
                <div class="wp-block-cover" style="min-height:100vh;aspect-ratio:unset;">
                    <img decoding="async" width="740" height="415" class="wp-block-cover__image-background size-full" alt="" src="<?php echo esc_url(get_option('under_construction_background_image', 'https://images.unsplash.com/photo-1747767763480-a5b4c7a82aef?q=80&w=2704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')); ?>" data-object-fit="cover">
                    <span aria-hidden="true" class="wp-block-cover__background has-background-dim-70 has-background-dim" style="background-color: <?php echo esc_attr(get_option('under_construction_background_color', '#000000')); ?>"></span>
                    <div class="website-logo">
                        <img src="<?php echo esc_url( wp_get_attachment_image_src( get_theme_mod( 'custom_logo' ), 'full' )[0] ); ?>" alt="Logo" class="logo">
                    </div>
                    <div class="wp-block-cover__inner-container is-layout-constrained wp-block-cover-is-layout-constrained">
                        <h2 class="wp-block-heading heading-top_size has-text-align-center"><?php echo esc_html(get_option('under_construction_topheading', 'Onze nieuwe site')); ?></h2>
                        <h1 class="wp-block-heading heading-top_size has-text-align-center"><?php echo esc_html(get_option('under_construction_heading', 'Komt er aan!')); ?></h1>
                        <h2 class="wp-block-heading heading-top_size has-text-align-center"><?php echo esc_html(get_option('under_construction_subheading', 'Blijf op de hoogte')); ?></h2>
                    </div>
                    <div class="scroll-down">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="wp-block-madeit-block-content container" style="margin-top:50px;margin-bottom:50px;text-align: center;">
        <div class="row">
            <div class="wp-block-madeit-block-content-column">
                <h2 class="wp-block-heading has-text-align-center"><?php echo esc_html(get_option('under_construction_title', '')); ?></h2>
                <div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
                <p class="has-text-align-center"><?php echo esc_html(get_option('under_construction_description', '')); ?></p>
                <div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>

                <p class="has-text-align-center"><?php echo esc_html(get_option('under_construction_newsletter', '')); ?></p>

                <div class="wp-block-madeitforms-input-field">
                    <input class="madeit-forms-input-field" type="email" name="field-1" required="" placeholder="E-mailadress">
                </div>

                <div style="height:30px" aria-hidden="true" class="wp-block-spacer"></div>

                <ul class="wp-block-social-links has-icon-color is-style-logos-only is-content-justification-center is-layout-flex wp-container-core-social-links-is-layout-16018d1d wp-block-social-links-is-layout-flex">
                    <?php if (get_option('under_construction_facebook')) : ?>
                    <li style="color: #1a1a1a; " class="wp-social-link wp-social-link-facebook has-default-text-color wp-block-social-link">
                        <a href="<?php echo esc_url(get_option('under_construction_facebook')); ?>" class="wp-block-social-link-anchor">
                            <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z"></path></svg>
                        </a>
                    </li>
                    <?php endif; ?>
                    <?php if (get_option('under_construction_twitter')) : ?>
                    <li style="color: #1a1a1a; " class="wp-social-link wp-social-link-instagram has-default-text-color wp-block-social-link">
                        <a href="<?php echo esc_url(get_option('under_construction_twitter')); ?>" class="wp-block-social-link-anchor">
                            <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z"></path></svg>
                        </a>
                    </li>
                    <?php endif; ?>
                    <?php if (get_option('under_construction_instagram')) : ?>
                    <li style="color: #1a1a1a; " class="wp-social-link wp-social-link-linkedin has-default-text-color wp-block-social-link">
                        <a href="<?php echo esc_url(get_option('under_construction_instagram')); ?>" class="wp-block-social-link-anchor">
                            <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"></path></svg>
                        </a>
                    </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </div>
  </body>
</html>