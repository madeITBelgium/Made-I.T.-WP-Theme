/**
 * save-versions.js
 *
 * Deprecated save-functies voor het content-container block.
 *
 * NAAMGEVING
 * ──────────
 * saveV1  = meest recente deprecated versie (staat bovenaan in `deprecated`)
 * Hogere nummers = progressief oudere versies.
 *
 * WAAROM BESTAAN DEZE?
 * ────────────────────
 * Gutenberg vergelijkt bij het openen van een post de opgeslagen HTML met wat
 * de huidige save() genereert. Als ze niet overeenkomen, toont de editor een
 * "Try Recovery" melding. Om dat te vermijden voor bestaande content, bewaren
 * we hier exacte kopieën van oudere save()-versies.
 *
 * WELKE VERSIES ZIJN ECHT NODIG?
 * ───────────────────────────────
 * Alleen versies die ooit live zijn gegaan op een website zijn strikt nodig.
 * De rest kan veilig worden verwijderd als er geen content meer bestaat die
 * met die versie werd opgeslagen. Twijfel je? Laat ze staan — ze doen geen kwaad.
 *
 * HUIDIGE STATUS
 * ──────────────
 * saveV1  – Recente deprecated versie (size default change 2026-04-17)
 * saveV2  – Responsive spacing via CSS vars (2026-04-08)
 * saveV3  – Spacing als directe inline stijlen (2026-04-08)
 * saveV4  – Zonder default CSS vars (2026-03-26)
 * saveV5  – Wrapper padding zonder whitespace tekst nodes
 * saveV6  – Wrapper padding (containerPadding op outer wrapper)
 * saveV7  – Legacy boxed zonder inner container (2026-03-09)
 * saveV8  – Zeer oude markup met plain `.row` (geen `madeit-container-row`)
 * saveV9  – Legacy zonder `overflow:visible` serialisatie
 * saveV10 – Pre rowGap responsive vars
 * saveV11 – Altijd `background-color: transparent` (2026-02)
 * saveV12 – ⭐ LIVE OP WEBSITES: object spacing, `<div class="row">` (typo)
 * saveV13 – ⭐ LIVE OP WEBSITES: alleroudste versie met numeric attributes
 * saveV14 – Legacy direct row met overflow:visible
 * saveV15 – Legacy wrapper container met inner container
 */

// ─── Recente deprecated versies (intern ontwikkeld, mogelijk niet live) ───────

export { default as saveV1  } from './save-v1-size-default-container';
export { default as saveV2  } from './save-2026-04-08-vars';
export { default as saveV3  } from './save-2026-04-08';
export { default as saveV4  } from './save-2026-03-26';
export { default as saveV5  } from './save-padding-on-wrapper-min';
export { default as saveV6  } from './save-padding-on-wrapper';
export { default as saveV7  } from './save-v7-legacy-boxed-no-inner-container';
export { default as saveV8  } from './save-v8-very-old-markup-plain-row';
export { default as saveV9  } from './save-v9-legacy-no-overflow-serialized';
export { default as saveV10 } from './save-v10-pre-rowgap-responsive-vars';
export { default as saveV11 } from './save-v11-transparent-background-default';

// ─── Versies die live staan op websites ───────────────────────────────────────

/**
 * saveV12 — De versie die op alle huidige live websites staat.
 *
 * Kenmerken:
 * - Object-gebaseerde spacing ({ top, right, bottom, left })
 * - `<div class="row">` (let op: `class` ipv `className` — JSX typo die bewaard moet worden)
 * - Geen `madeit-block-content--frontend` klasse
 * - Geen flex/layout CSS vars
 */
export { default as saveV12 } from './v1';

/**
 * saveV13 — De alleroudste versie met afzonderlijke numerieke attributen.
 *
 * Kenmerken:
 * - Afzonderlijke attributen zoals `containerPaddingTop`, `containerMarginBottom`, etc.
 * - `<div class="row">` (JSX typo)
 * - Geen CSS vars
 */
export { default as saveV13 } from './save-v13-legacy-attributes';

// ─── Overige legacy varianten ─────────────────────────────────────────────────

export { default as saveV14 } from './save-v14-legacy-direct-row-overflow-visible';
export { default as saveV15 } from './save-v15-legacy-wrapper-container-inner-container';