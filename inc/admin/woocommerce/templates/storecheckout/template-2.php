<?php
/**
 * Store checkout template 02 - Luxe / premium
 */
?>
<div class="storecheckout-template storecheckout-template--premium">
    <style>
        .storecheckout-template--premium {
            background: linear-gradient(135deg, #fdf7f2 0%, #fff 50%, #f8fafc 100%);
            border: 1px solid #f2d8c7;
        }

        .storecheckout-template--premium .storecheckout-template__badge {
            background: #fef3c7;
            color: #92400e;
        }

        .storecheckout-template--premium .storecheckout-template__panel {
            background: rgba(255, 255, 255, 0.9);
            border-color: #f3e2d8;
        }

        .storecheckout-template--premium .storecheckout-template__button {
            background: linear-gradient(135deg, #b45309, #d97706);
        }

        .storecheckout-template--premium .storecheckout-template__input {
            border-color: #f4d7c3;
            background: #fffaf5;
        }

        .storecheckout-template--premium .storecheckout-template__summary {
            background: linear-gradient(180deg, #fffaf5 0%, #ffffff 100%);
        }
    </style>

    <div class="storecheckout-template__heading">
        <h3 class="storecheckout-template__title">Premium checkout</h3>
        <span class="storecheckout-template__badge">Template 02</span>
    </div>

    <div class="storecheckout-template__content">
        <div class="storecheckout-template__panel">
            <div class="storecheckout-template__form">
                <div>
                    <label class="storecheckout-template__label">Klantgegevens</label>
                    <input class="storecheckout-template__input" type="text" value="Mieke Van den Berg" />
                </div>

                <div class="storecheckout-template__row">
                    <div>
                        <label class="storecheckout-template__label">Land</label>
                        <input class="storecheckout-template__input" type="text" value="België" />
                    </div>
                    <div>
                        <label class="storecheckout-template__label">Telefoon</label>
                        <input class="storecheckout-template__input" type="text" value="+32 495 12 34 56" />
                    </div>
                </div>

                <div>
                    <label class="storecheckout-template__label">Straat + nummer</label>
                    <input class="storecheckout-template__input" type="text" value="Leuvenseweg 38" />
                </div>

                <div class="storecheckout-template__row">
                    <div>
                        <label class="storecheckout-template__label">Stad</label>
                        <input class="storecheckout-template__input" type="text" value="Leuven" />
                    </div>
                    <div>
                        <label class="storecheckout-template__label">Postcode</label>
                        <input class="storecheckout-template__input" type="text" value="3000" />
                    </div>
                </div>
            </div>
        </div>

        <aside class="storecheckout-template__panel storecheckout-template__summary">
            <div style="display:flex; align-items:center; gap:12px; padding-bottom:12px; border-bottom:1px solid #f3e2d8;">
                <div style="width:60px; height:60px; border-radius:12px; background:linear-gradient(135deg, #f7d7bf, #e9d5ff); display:flex; align-items:center; justify-content:center; font-weight:700; color:#7c2d12;">L</div>
                <div>
                    <div style="font-weight:700; color:#1f2937;">Luxury Sieraden</div>
                    <div style="font-size:0.8rem; color:#6b7280;">Maat: M · 1 item</div>
                </div>
            </div>

            <div class="storecheckout-template__item" style="margin-top:12px;">
                <span>Artikel</span>
                <strong>€ 89,00</strong>
            </div>
            <div class="storecheckout-template__item">
                <span>Verzending</span>
                <strong>€ 12,50</strong>
            </div>
            <div class="storecheckout-template__item">
                <span>Verpakking</span>
                <strong>€ 4,00</strong>
            </div>

            <div class="storecheckout-template__totals">
                <div class="storecheckout-template__price">
                    <span>Bedrag</span>
                    <span>€ 105,50</span>
                </div>
                <div class="storecheckout-template__price">
                    <span>Totaal</span>
                    <span>€ 105,50</span>
                </div>
            </div>

            <button class="storecheckout-template__button" type="button">Betaal nu</button>
        </aside>
    </div>
</div>
