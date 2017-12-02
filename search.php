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

<div class="container">
    <header class="page-header">
        <?php if (have_posts()) : ?>
            <h1 class="page-title"><?php printf(__('Search Results for: %s', 'madeit'), '<span>'.get_search_query().'</span>'); ?></h1>
        <?php else : ?>
            <h1 class="page-title"><?php _e('Nothing Found', 'madeit'); ?></h1>
        <?php endif; ?>
    </header><!-- .page-header -->

    <div id="primary" class="row">
        <div id="main" class="col" role="main">

            <?php
            if (have_posts()) :
                /* Start the Loop */
                while (have_posts()) : the_post();

                    /*
                     * Run the loop for the search to output the results.
                     * If you want to overload this in a child theme then include a file
                     * called content-search.php and that will be used instead.
                     */
                    get_template_part('template-parts/post/content', 'excerpt');

                endwhile; // End of the loop.

                the_posts_pagination([
                    'prev_text'          => madeit_get_svg(['icon' => 'arrow-left']).'<span class="screen-reader-text">'.__('Previous page', 'madeit').'</span>',
                    'next_text'          => '<span class="screen-reader-text">'.__('Next page', 'madeit').'</span>'.madeit_get_svg(['icon' => 'arrow-right']),
                    'before_page_number' => '<span class="meta-nav screen-reader-text">'.__('Page', 'madeit').' </span>',
                ]);

            else : ?>

                <p><?php _e('Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'madeit'); ?></p>
                <?php
                    get_search_form();

            endif;
            ?>
        </div>
        <?php get_sidebar(); ?>
    </div>
</div>

<?php get_footer();
