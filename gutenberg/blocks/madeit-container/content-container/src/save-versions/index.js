/**
 * save-versions/index.js — madeit/block-content
 *
 *   saveVnoResponsiveDir – Standaard markup, geen data-madeit-dir-tablet/mobile
 *   saveVlegacyBoxedInnerRow – Boxed markup met .col wrapper en inner row zonder data attrs
 *   saveVlegacyDirectRowInlineStyle – Directe row + inline margin styles
 *   saveVpre0b – Inner div aanwezig, normale klassen, partial CSS-vars
 *   saveVpre0  – Inner div aanwezig, dubbele klassen (bug)
 *   saveV9     – Inline margin (geen CSS-var), container-fluid + frontend-class
 *   saveV12    – ⭐ LIVE: wrapper = container, geen frontend-class, JSX typo
 *   saveV13    – ⭐ LIVE: numerieke attributen (alleroudst)
 */

export { default as saveVnoResponsiveDir } from './saveVno-responsive-dir';
export { default as saveVlegacyBoxedInnerRow } from './saveVlegacy-boxed-inner-row';
export { default as saveVlegacyBoxedInlineWrapper } from './save-legacy-boxed-inline-wrapper';
export { default as saveVlegacyDirectRowInlineStyle } from './saveVlegacy-direct-row-inline-style';
export { default as saveVpre0b } from './saveV8';
export { default as saveVpre0  } from './saveV7';
export { default as saveV9     } from './saveV3';
export { default as saveV5     } from './saveV5';
export { default as saveV12    } from './saveV2';
export { default as saveV13    } from './saveV1'; 