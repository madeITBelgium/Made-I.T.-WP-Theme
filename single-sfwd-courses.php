<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 * @since 1.0
 *
 * @version 1.0
 */
get_header(); ?>

<div class="container-fluid bg-white">
    <div class="row">
        <div class="col">
            <div class="container">
                <div class="row">
                    <div class="col mt-5 mb-5">
                        <?php
                        /* Start the Loop */
                        while (have_posts()) {
                            the_post();
                            
                            the_title('<h1 class="entry-title text-center mb-4">', '</h1>');
                            ?>
                            <div class="content">
                                <?php
                                the_content();
                                ?>
                            </div>
                            <?php
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php get_footer();
