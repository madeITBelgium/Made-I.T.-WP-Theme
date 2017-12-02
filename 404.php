<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 * @since 1.0
 *
 * @version 1.0
 */
get_header(); ?>

<div class="container">
    <div id="primary" class="row">
        <div id="main" class="col" role="main">
            <section class="error-404 not-found">
                <header class="page-header">
                    <h1 class="page-title"><?php _e('Oops! That page can&rsquo;t be found.', 'madeit'); ?></h1>
                </header><!-- .page-header -->
                <div class="page-content">
                    <p><?php _e('It looks like nothing was found at this location. Maybe try a search?', 'madeit'); ?></p>
                    <?php get_search_form(); ?>
                </div><!-- .page-content -->
            </section><!-- .error-404 -->
        </div><!-- #main -->
    </div><!-- #primary -->
</div><!-- .wrap -->

<?php get_footer();
