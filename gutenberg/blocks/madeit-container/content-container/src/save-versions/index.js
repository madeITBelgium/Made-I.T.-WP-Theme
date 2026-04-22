/**
 * Deprecated save implementations for the content-container block.
 *
 * Naming convention:
 * - `saveV1` is the most recent deprecated save in the `deprecated` array
 * - Higher numbers are progressively older.
 *
 * Keep these functions behavior-identical: they exist purely to avoid block
 * validation errors for already-saved content.
 */

import saveV1 from './save-v1-size-default-container';

import saveV2 from './save-2026-04-08-vars';
import saveV3 from './save-2026-04-08';
import saveV4 from './save-2026-03-26';
import saveV5 from './save-padding-on-wrapper-min';
import saveV6 from './save-padding-on-wrapper';

import saveV7 from './save-v7-legacy-boxed-no-inner-container';
import saveV8 from './save-v8-very-old-markup-plain-row';
import saveV9 from './save-v9-legacy-no-overflow-serialized';
import saveV10 from './save-v10-pre-rowgap-responsive-vars';
import saveV11 from './save-v11-transparent-background-default';

import saveV12 from './v1';
import saveV13 from './save-v13-legacy-attributes';

import saveV14 from './save-v14-legacy-direct-row-overflow-visible';
import saveV15 from './save-v15-legacy-wrapper-container-inner-container';

export {
    saveV1,
    saveV2,
    saveV3,
    saveV4,
    saveV5,
    saveV6,
    saveV7,
    saveV8,
    saveV9,
    saveV10,
    saveV11,
    saveV12,
    saveV13,
    saveV14,
    saveV15,
};
