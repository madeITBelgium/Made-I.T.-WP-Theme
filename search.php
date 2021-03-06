<?php
/**
 * The template for displaying search results pages.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 * @since 1.0
 *
 * @version 1.0
 */
get_header(); ?>

<div class="container voffset6">
    <div id="primary" class="row">
        <div id="main" class="col" role="main">
            <header class="page-header">
                <?php if (have_posts()) { ?>
                    <h1 class="page-title"><?php printf(__('Search Results for: %s', 'madeit'), '<span>'.get_search_query().'</span>'); ?></h1>
                <?php } else { ?>
                    <h1 class="page-title"><?php _e('Nothing Found', 'madeit'); ?></h1>
                <?php } ?>
            </header><!-- .page-header -->

            <?php
            if (have_posts()) {
                /* Start the Loop */
                while (have_posts()) {
                    the_post();

                    /*
                     * Run the loop for the search to output the results.
                     * If you want to overload this in a child theme then include a file
                     * called content-search.php and that will be used instead.
                     */
                    get_template_part('template-parts/post/content', 'excerpt');
                } // End of the loop.

                madeit_page_pagination();
            } else { ?>

                <p><?php _e('Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'madeit'); ?></p>
                <?php
                    get_search_form();

            }
            ?>
        </div>
        <?php get_sidebar(); ?>
    </div>
</div>

<?php get_footer();
