/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/** @typedef {import('@wordpress/blocks').WPBlockVariation} WPBlockVariation */

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */


const variations = [

    /* ============================
     * 1 COLUMN – 100%
     * ============================ */
    {
        name: 'one-column',
        title: __( '100' ),
        description: __( 'One column' ),
        icon: (
            <svg viewBox="0 0 114 60" width="48" height="48">
                <rect x="0" y="0" width="114" height="60" />
            </svg>
        ),
        innerBlocks: [
            [ 'madeit/block-content-column', { width: 12 } ],
        ],
    },

    /* ============================
     * 2 COLUMNS – 50 / 50
     * ============================ */
    {
        name: 'two-columns-equal',
        title: __( '50 / 50' ),
        description: __( 'Two equal columns' ),
        icon: (
            <svg viewBox="0 0 114 60" width="48" height="48">
                <path d="m56 0H0v60h56V0Zm58 0H58v60h56V0Z" />
            </svg>
        ),
        innerBlocks: [
            [ 'madeit/block-content-column', { width: 6 } ],
            [ 'madeit/block-content-column', { width: 6 } ],
        ],
    },

    /* ============================
     * 2 COLUMNS – 33 / 66
     * ============================ */
    {
        name: 'two-columns-33-66',
        title: __( '33 / 66' ),
        icon: (
            <svg viewBox="0 0 114 60" width="48" height="48">
                <path d="m37 0H0v60h37V0Zm77 0H39v60h75V0Z" />
            </svg>
        ),
        innerBlocks: [
            [ 'madeit/block-content-column', { width: 4 } ],
            [ 'madeit/block-content-column', { width: 8 } ],
        ],
    },

    /* ============================
     * 2 COLUMNS – 66 / 33
     * ============================ */
    {
        name: 'two-columns-66-33',
        title: __( '66 / 33' ),
        icon: (
            <svg viewBox="0 0 114 60" width="48" height="48">
                <path d="m75 0H0v60h75V0Zm39 0H77v60h37V0Z" />
            </svg>
        ),
        innerBlocks: [
            [ 'madeit/block-content-column', { width: 8 } ],
            [ 'madeit/block-content-column', { width: 4 } ],
        ],
    },

    /* ============================
     * 3 COLUMNS – EQUAL
     * ============================ */
    {
        name: 'three-columns',
        title: __( '33 / 33 / 33' ),
        icon: (
            <svg viewBox="0 0 114 60" width="48" height="48">
                <path d="M0 0h37v60H0zM39 0h36v60H39zM77 0h37v60H77z" />
            </svg>
        ),
        innerBlocks: [
            [ 'madeit/block-content-column', { width: 4 } ],
            [ 'madeit/block-content-column', { width: 4 } ],
            [ 'madeit/block-content-column', { width: 4 } ],
        ],
    },

    /* ============================
     * 3 COLUMNS – 25 / 50 / 25
     * ============================ */
    {
        name: 'three-columns-center',
        title: __( '25 / 50 / 25' ),
        icon: (
            <svg viewBox="0 0 114 60" width="48" height="48">
                <path d="M0 0h27v60H0zM29 0h56v60H29zM87 0h27v60H87z" />
            </svg>
        ),
        innerBlocks: [
            [ 'madeit/block-content-column', { width: 3 } ],
            [ 'madeit/block-content-column', { width: 6 } ],
            [ 'madeit/block-content-column', { width: 3 } ],
        ],
    },

    /* ============================
     * 4 COLUMNS – EQUAL
     * ============================ */
    {
        name: 'four-columns',
        title: __( '25 / 25 / 25 / 25' ),
        icon: (
            <svg viewBox="0 0 114 60" width="48" height="48">
                <path d="M0 0h27v60H0zM29 0h27v60H29zM58 0h27v60H58zM87 0h27v60H87z" />
            </svg>
        ),
        innerBlocks: [
            [ 'madeit/block-content-column', { width: 3 } ],
            [ 'madeit/block-content-column', { width: 3 } ],
            [ 'madeit/block-content-column', { width: 3 } ],
            [ 'madeit/block-content-column', { width: 3 } ],
        ],
    },

    /* ============================
     * 2 + 2 GRID (STACKED)
     * ============================ */
    {
        name: 'two-by-two',
        title: __( '2 x 2 grid' ),
        icon: (
            <svg viewBox="0 0 114 60" width="48" height="48">
                <path d="M0 0h56v29H0zM58 0h56v29H58zM0 31h56v29H0zM58 31h56v29H58z" />
            </svg>
        ),
        innerBlocks: [
            [ 'madeit/block-content-column', { width: 6 } ],
            [ 'madeit/block-content-column', { width: 6 } ],
            [ 'madeit/block-content-column', { width: 6 } ],
            [ 'madeit/block-content-column', { width: 6 } ],
        ],
    },

];

export default variations;
