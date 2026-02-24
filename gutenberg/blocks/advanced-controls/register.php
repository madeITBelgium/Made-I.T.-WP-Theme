<?php

require_once __DIR__ . '/advanced-controls.php';

// don't show in the block inserter
add_filter( 'block_categories_all', function ( $categories ) {
    return array_filter( $categories, function ( $category ) {
        return $category['slug'] !== 'madeit';
    } );
} );