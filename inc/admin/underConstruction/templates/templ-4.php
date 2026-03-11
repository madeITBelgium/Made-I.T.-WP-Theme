<style>
    :root {
        --bg-color: <?php echo esc_attr(get_option('under_construction_background_color', '#006699')); ?>;
        --bg-color-2: <?php echo esc_attr(get_option('under_construction_background_color2') ?: get_option('under_construction_background_color', '#006699')); ?>;
        --tekst-color: <?php echo esc_attr(get_option('under_construction_text_color', '#ffffff')); ?>;
    }

    /* WP cover block zet standaard vaak witte tekst; forceer contrastkleur uit instellingen */
    .wp-block-cover,
    .wp-block-cover .wp-block-cover__inner-container,
    .wp-block-cover .wp-block-cover__inner-container * {
        color: var(--tekst-color) !important;
    }

    .website-logo {
        z-index: 3;
        position: absolute;
        right: 20px;
        top: 90%;
        width: 210px;
        height: auto;
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
    h2.heading-top_size {
        font-size: 2.5rem;
        font-weight: 400;
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
                <div class="wp-block-cover" style="min-height:80vh;aspect-ratio:unset;">
                    <img decoding="async" width="740" height="415" class="wp-block-cover__image-background size-full" alt="" src="<?php echo esc_url(get_option('under_construction_background_image', 'https://images.unsplash.com/photo-1747767763480-a5b4c7a82aef?q=80&w=2704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')); ?>" data-object-fit="cover">
                    <span aria-hidden="true" class="wp-block-cover__background has-background-dim-100 has-background-dim" style="background-color: var(--bg-color);"></span>
                    <?php
                    if (get_option('under_construction_logo')) {
                        echo '<div class="website-logo"><img src="' . esc_url(get_option('under_construction_logo')) . '" alt="Logo" class="logo"></div>';
                    } else {
                        // get the logo from the website
                        echo '<div class="website-logo"><img src="' . esc_url( wp_get_attachment_image_src( get_theme_mod( 'custom_logo' ), 'full' )[0] ) . '" alt="Logo" class="logo"></div>';
                    }
                    ?>

                    <div class="container wp-block-cover__inner-container is-layout-constrained wp-block-cover-is-layout-constrained">
                        <h1 class="wp-block-heading heading-top_size" style="max-width: 50%;"><?php echo esc_html(get_option('under_construction_heading', 'Komt er aan!')); ?></h1>
                        <h2 class="wp-block-heading heading-top_size" style="max-width: 50%;"><?php echo esc_html(get_option('under_construction_subheading', 'Blijf op de hoogte')); ?></h2>
                    </div>
                </div>
                <div class="wp-block-cover" style="min-height: 20vh; aspect-ratio: unset;">
                    <span aria-hidden="true" class="wp-block-cover__background has-background-dim-100 has-background-dim" style="background-color: var(--bg-color-2);"></span>

                </div>
            </div>
        </div>
    </div>
  </body>
</html>