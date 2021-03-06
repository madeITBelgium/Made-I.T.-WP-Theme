<?php
/**
 * Template for displaying search forms in Made I.T.
 *
 * @since 1.0
 *
 * @version 1.0
 */
?>

<?php $unique_id = esc_attr(uniqid('search-form-')); ?>

<form method="get" role="search" class="form-search" action="<?php echo esc_url(home_url('/')); ?>">
    <div class="form-group">
        <div class="input-group">
            <input type="text" id="<?php echo $unique_id; ?>" class="form-control search-query" placeholder="<?php _e('Search...', 'madeit'); ?>" aria-label="<?php _e('Search', 'madeit'); ?>" value="<?php echo esc_attr(get_search_query()); ?>" name="s">
            <div class="input-group-append">
                <button type="submit" class="btn btn-primary" name="submit" id="searchsubmit" aria-label="<?php _e('Search', 'madeit'); ?>" value="<?php _e('Search', 'madeit'); ?>"><span class="fa fa-search"></span></button>
            </div>
        </div>
    </div>
</form>