<?php
/**
 * Store checkout template 03 - Dark / editorial
 */
?>
<div class="storecheckout-template storecheckout-template--dark">
    <style>
        .storecheckout-template--dark {
            background: #111827;
            border: 1px solid #1f2937;
            color: #f9fafb;
        }

        .storecheckout-template--dark .storecheckout-template__heading {
            border-color: rgba(255, 255, 255, 0.08);
        }

        .storecheckout-template--dark .storecheckout-template__title {
            color: #f9fafb;
        }

        .storecheckout-template--dark .storecheckout-template__badge {
            background: rgba(167, 139, 250, 0.18);
            color: #ddd6fe;
        }

        .storecheckout-template--dark .storecheckout-template__panel {
            background: #1f2937;
            border-color: rgba(255, 255, 255, 0.08);
        }

        .storecheckout-template--dark .storecheckout-template__label {
            color: #d1d5db;
        }

        .storecheckout-template--dark .storecheckout-template__input {
            background: rgba(17, 24, 39, 0.8);
            border-color: rgba(255, 255, 255, 0.08);
            color: #f9fafb;
        }

        .storecheckout-template--dark .storecheckout-template__item,
        .storecheckout-template--dark .storecheckout-template__price {
            color: #f3f4f6;
        }

        .storecheckout-template--dark .storecheckout-template__button {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
        }
    </style>

    <div class="storecheckout-template__heading">
        <h3 class="storecheckout-template__title">Editorial checkout</h3>
        <span class="storecheckout-template__badge">Template 03</span>
    </div>

    <div class="storecheckout-template__content">
        <div class="storecheckout-template__panel">
            <div class="storecheckout-template__form">
                <div>
                    <label class="storecheckout-template__label">Naam</label>
                    <input class="storecheckout-template__input" type="text" value="Eva De Vos" />
                </div>

                <div class="storecheckout-template__row">
                    <div>
                        <label class="storecheckout-template__label">Stad</label>
                        <input class="storecheckout-template__input" type="text" value="Brussel" />
                    </div>
                    <div>
                        <label class="storecheckout-template__label">Land</label>
                        <input class="storecheckout-template__input" type="text" value="België" />
                    </div>
                </div>

                <div>
                    <label class="storecheckout-template__label">Factuuradres</label>
                    <input class="storecheckout-template__input" type="text" value="Avenue Louise 123" />
                </div>

                <div class="storecheckout-template__row">
                    <div>
                        <label class="storecheckout-template__label">Postcode</label>
                        <input class="storecheckout-template__input" type="text" value="1050" />
                    </div>
                    <div>
                        <label class="storecheckout-template__label">BTW</label>
                        <input class="storecheckout-template__input" type="text" value="BE 0123 456 789" />
                    </div>
                </div>
            </div>
        </div>

        <aside class="storecheckout-template__panel storecheckout-template__summary">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.08);">
                <div>
                    <div style="font-size:0.7rem; letter-spacing:0.08em; text-transform:uppercase; color:#c4b5fd;">Bestelling</div>
                    <div style="margin-top:6px; font-weight:700;">#2048</div>
                </div>
                <div style="font-size:0.8rem; color:#d1d5db;">2 items</div>
            </div>

            <div class="storecheckout-template__item" style="margin-top:12px;">
                <span>Canvas tas</span>
                <strong>€ 78,00</strong>
            </div>
            <div class="storecheckout-template__item">
                <span>Textiel pakket</span>
                <strong>€ 54,00</strong>
            </div>
            <div class="storecheckout-template__item">
                <span>Verzending</span>
                <strong>€ 8,00</strong>
            </div>

            <div class="storecheckout-template__totals">
                <div class="storecheckout-template__price">
                    <span>Subtotaal</span>
                    <span>€ 132,00</span>
                </div>
                <div class="storecheckout-template__price">
                    <span>Totaal</span>
                    <span>€ 140,00</span>
                </div>
            </div>

            <button class="storecheckout-template__button" type="button">Voltooien</button>
        </aside>
    </div>
</div>
