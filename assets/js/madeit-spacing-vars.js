( function () {
	'use strict';

	function getInline( el, prop ) {
		if ( ! el || ! el.style ) return '';
		return ( el.style[ prop ] || '' ).trim();
	}

	function getVar( el, name ) {
		if ( ! el || ! el.style ) return '';
		return ( el.style.getPropertyValue( name ) || '' ).trim();
	}

	function setVarIfMissing( el, name, value ) {
		if ( ! el || ! el.style ) return;
		if ( ! value ) return;
		if ( getVar( el, name ) ) return;
		el.style.setProperty( name, value );
	}

	function migrateBlock( blockEl ) {
		// Outer wrapper: margin/padding vars (desktop) from inline styles.
		var inlineMarginTop = getInline( blockEl, 'marginTop' );
		var inlineMarginBottom = getInline( blockEl, 'marginBottom' );
		if ( inlineMarginTop || inlineMarginBottom ) {
			setVarIfMissing( blockEl, '--madeit-container-margin-top-desktop', inlineMarginTop || '0px' );
			setVarIfMissing( blockEl, '--madeit-container-margin-bottom-desktop', inlineMarginBottom || '0px' );
		}

		var inlinePadTop = getInline( blockEl, 'paddingTop' );
		var inlinePadRight = getInline( blockEl, 'paddingRight' );
		var inlinePadBottom = getInline( blockEl, 'paddingBottom' );
		var inlinePadLeft = getInline( blockEl, 'paddingLeft' );
		if ( inlinePadTop || inlinePadRight || inlinePadBottom || inlinePadLeft ) {
			setVarIfMissing( blockEl, '--madeit-container-padding-top-desktop', inlinePadTop || '0px' );
			setVarIfMissing( blockEl, '--madeit-container-padding-right-desktop', inlinePadRight || '0px' );
			setVarIfMissing( blockEl, '--madeit-container-padding-bottom-desktop', inlinePadBottom || '0px' );
			setVarIfMissing( blockEl, '--madeit-container-padding-left-desktop', inlinePadLeft || '0px' );
		}

		// Row wrapper: row padding vars (desktop) from inline styles.
		var rowEl = blockEl.querySelector( '.madeit-container-row' );
		if ( ! rowEl ) return;

		var inlineRowPadTop = getInline( rowEl, 'paddingTop' );
		var inlineRowPadRight = getInline( rowEl, 'paddingRight' );
		var inlineRowPadBottom = getInline( rowEl, 'paddingBottom' );
		var inlineRowPadLeft = getInline( rowEl, 'paddingLeft' );
		if ( inlineRowPadTop || inlineRowPadRight || inlineRowPadBottom || inlineRowPadLeft ) {
			setVarIfMissing( rowEl, '--madeit-container-row-padding-top-desktop', inlineRowPadTop || '0px' );
			setVarIfMissing( rowEl, '--madeit-container-row-padding-right-desktop', inlineRowPadRight || '0px' );
			setVarIfMissing( rowEl, '--madeit-container-row-padding-bottom-desktop', inlineRowPadBottom || '0px' );
			setVarIfMissing( rowEl, '--madeit-container-row-padding-left-desktop', inlineRowPadLeft || '0px' );
		}
	}

	function run() {
		var blocks = document.querySelectorAll( '.wp-block-madeit-block-content' );
		if ( ! blocks || ! blocks.length ) return;
		for ( var i = 0; i < blocks.length; i++ ) {
			migrateBlock( blocks[ i ] );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', run );
	} else {
		run();
	}
} )();
