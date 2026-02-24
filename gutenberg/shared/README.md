# Made I.T. Gutenberg Shared Components

Deze map bevat herbruikbare editor-components voor meerdere Gutenberg blocks in dit theme.

## Beschikbaar

- `ControlHeader` (incl. reset-knop + breakpoint switcher)
- `BreakpointSwitcher` (desktop/tablet/mobile knoppen)

> Let op: deze components zijn bewust geschreven zonder JSX (met `createElement`).
> Daardoor kun je ze veilig importeren vanuit elke block zonder dat je `wp-scripts` config hoeft aan te passen.

## Styling

De editor-styling voor deze controls wordt **1x globaal** geladen via [gutenberg/loader.php](../loader.php) en staat in [gutenberg/shared/editor-controls.css](editor-controls.css).

Je hoeft die styling dus niet meer per block te kopiëren of apart te importeren.

## Import paths

De import is altijd relatief vanaf jouw block file (meestal `src/edit.js`).

Je kan direct importeren (zoals hieronder), of via de “barrel export” (aanrader):

```js
import { ControlHeader, BreakpointSwitcher } from '../../../shared';
```

### Blokken op dit niveau

Pad: `wp-content/themes/madeit/gutenberg/blocks/<block>/src/edit.js`

Gebruik:

```js
import { ControlHeader, BreakpointSwitcher } from '../../../shared';

// of (direct)
// import ControlHeader from '../../../shared/ControlHeader';
// import BreakpointSwitcher from '../../../shared/BreakpointSwitcher';
```

### Blokken met extra submap

Pad: `wp-content/themes/madeit/gutenberg/blocks/<groep>/<block>/src/edit.js`

Gebruik:

```js
import { ControlHeader, BreakpointSwitcher } from '../../../../shared';

// of (direct)
// import ControlHeader from '../../../../shared/ControlHeader';
// import BreakpointSwitcher from '../../../../shared/BreakpointSwitcher';
```

Voorbeelden in deze repo:

- `blocks/madeit-tabs/src/edit.js` → `../../../shared/...`
- `blocks/madeit-slider/src/edit.js` → `../../../shared/...`
- `blocks/madeit-container/content-container/src/edit.js` → `../../../../shared/...`

## Gebruik

### ControlHeader (meest gebruikt)

```jsx
<ControlHeader
    title={ __( 'Max width' ) }
    breakpoint={ activeMaxWidthBreakpoint }
    onBreakpointChange={ setActiveMaxWidthBreakpoint }
    onReset={ resetMaxWidth }
/>
```

Props:

- `title`: string/React node
- `breakpoint`: `'desktop' | 'tablet' | 'mobile'`
- `onBreakpointChange`: `(bp) => void`
- `afterBreakpoint`: optional React node
- `onReset`: optional `() => void`
- `resetLabel`: optional string

### BreakpointSwitcher (los gebruiken)

```jsx
<BreakpointSwitcher
    active={ activeBreakpoint }
    onChange={ setActiveBreakpoint }
/>
```
