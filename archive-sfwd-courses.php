<?php
/**
 * The template for displaying archive pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 * @since 1.0
 *
 * @version 1.0
 */
get_header(); ?>

<div class="container mt-5">
    <div class="row">
        <div class="col">
            <h1 class="text-center mb-4">
                <?php echo post_type_archive_title('', false); ?>
            </h1>
        </div>
    </div>

    <div class="row justify-content-center">
        <?php
        if (have_posts()) { ?>
            <?php
            while (have_posts()) {
                the_post();
                ?>
                <div id="post-<?php the_ID(); ?>" <?php post_class('col-12 col-md-6 col-lg-4 mb-3 border-0'); ?>>
                    <article id="post-<?php the_ID(); ?>" <?php post_class(' blog-post border-0'); ?>>
                        <div class="text-center p-2 border-shadow">
                            <?php
                            if ('' !== get_the_post_thumbnail()) {
                                ?>
                                <div>
                                    <?php the_post_thumbnail('madeit-featured-blog-image'); ?>
                                </div>
                                <?php
                            }
                            the_title('<h2 class="entry-title h4 mb-3">', '</h2>');

                            ?>
                            <a href="<?php the_permalink(); ?>" class="stretched-link btn btn-success">Bekijk cursus</a>
                        </div>
                    </article>
                </div>
                <?php
            }

            madeit_page_pagination();

        } else {
            ?>
            <div class="col-12">
                <?php
                get_template_part('template-parts/post/content', 'none');
                ?>
            </div>
            <?php
        } ?>
    </div>
</div>

<?php get_footer();
