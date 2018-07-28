<?php
/**
 * The front page template file.
 *
 * If the user has selected a static page for their homepage, this is what will
 * appear.
 * Learn more: https://codex.wordpress.org/Template_Hierarchy
 *
 * @since 1.0
 */
get_header(); ?>

<?php // Show the selected frontpage content.
if (have_posts()) :
    while (have_posts()) : the_post();
        if(false !== strpos( $post->post_content, '<!-- wp:' )) {
            get_template_part('template-parts/page/content', 'front-page-gutenberg');
        }
        else {
            get_template_part('template-parts/page/content', 'front-page');
        }
    endwhile;
else : // I'm not sure it's possible to have no posts when this page is shown, but WTH.
    get_template_part('template-parts/post/content', 'none');
endif;
?>

<?php
// Get each of our panels and show the post data.
if (0 !== madeit_panel_count() || is_customize_preview()) : // If we have pages to show.
    ?>
    <div class="container-fluid">
        <div class="row">
            <?php
            /**
             * Filter number of front page sections in Twenty Seventeen.
             *
             * @since Twenty Seventeen 1.0
             *
             * @param int $num_sections Number of front page sections.
             */
            $num_sections = apply_filters('madeit_front_page_sections', 4);
            global $madeitcounter;

            // Create a setting and control for each of the sections available in the theme.
            for ($i = 1; $i < (1 + $num_sections); $i++) {
                $madeitcounter = $i;
                madeit_front_page_section(null, $i);
            }
            ?>
        </div>
    </div>
    <?php
endif; // The if ( 0 !== madeit_panel_count() ) ends here.
?>

<?php get_footer();
