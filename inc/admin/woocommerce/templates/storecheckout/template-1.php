<?php
/**
 * Store checkout template 01 - Minimal & modern
 */
?>
<div class="storecheckout-template storecheckout-template--minimal">
    <style>
        .storecheckout-template {
            margin-top: 20px;
            padding: 16px;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            background: #ffffff;
            box-shadow: 0 8px 24px rgba(16, 24, 40, 0.06);
        }

        .storecheckout-template + .storecheckout-template {
            margin-top: 26px;
        }

        .storecheckout-template__heading {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 1px solid #edf0f3;
        }

        .storecheckout-template__title {
            margin: 0;
            font-size: 1.1rem;
            font-weight: 700;
            color: #111827;
        }

        .storecheckout-template__badge {
            display: inline-flex;
            align-items: center;
            padding: 5px 10px;
            border-radius: 999px;
            background: #eef2ff;
            color: #4338ca;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        .storecheckout-template__content {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 22px;
        }

        .storecheckout-template__panel {
            padding: 18px;
            border-radius: 16px;
            background: #f9fafb;
            border: 1px solid #edf2f7;
        }

        .storecheckout-template__form {
            display: grid;
            gap: 14px;
        }

        .storecheckout-template__row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .storecheckout-template__label {
            display: block;
            margin-bottom: 6px;
            font-size: 0.76rem;
            font-weight: 600;
            color: #374151;
        }

        .storecheckout-template__input {
            width: 100%;
            height: 42px;
            border: 1px solid #dbe0e6;
            border-radius: 10px;
            background: #ffffff;
            padding: 0 12px;
            color: #111827;
            font-size: 0.9rem;
        }

        .storecheckout-template__summary {
            display: grid;
            gap: 16px;
        }

        .storecheckout-template__item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            color: #1f2937;
            font-size: 0.92rem;
        }

        .storecheckout-template__item strong {
            font-weight: 700;
        }

        .storecheckout-template__totals {
            margin-top: 10px;
            padding-top: 14px;
            border-top: 1px solid #e5e7eb;
            display: grid;
            gap: 8px;
        }

        .storecheckout-template__price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #111827;
            font-weight: 600;
        }

        .storecheckout-template__button {
            width: 100%;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: #ffffff;
            padding: 12px 20px;
            font-weight: 700;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .storecheckout-template__content,
            .storecheckout-template__row {
                grid-template-columns: 1fr;
            }
        }
    </style>

    <div class="storecheckout-template__heading">
        <h3 class="storecheckout-template__title">Minimal checkout</h3>
        <span class="storecheckout-template__badge">Template 01</span>
    </div>

    <div class="storecheckout-template__content">
        <div class="storecheckout-template__panel">
            <div class="storecheckout-template__form">
                <div>
                    <label class="storecheckout-template__label">E-mail</label>
                    <input class="storecheckout-template__input" type="text" value="klant@voorbeeld.be" />
                </div>

                <div class="storecheckout-template__row">
                    <div>
                        <label class="storecheckout-template__label">Voornaam</label>
                        <input class="storecheckout-template__input" type="text" value="Johan" />
                    </div>
                    <div>
                        <label class="storecheckout-template__label">Achternaam</label>
                        <input class="storecheckout-template__input" type="text" value="Peeters" />
                    </div>
                </div>

                <div>
                    <label class="storecheckout-template__label">Adres</label>
                    <input class="storecheckout-template__input" type="text" value="Stationsstraat 12" />
                </div>

                <div class="storecheckout-template__row">
                    <div>
                        <label class="storecheckout-template__label">Postcode</label>
                        <input class="storecheckout-template__input" type="text" value="2000" />
                    </div>
                    <div>
                        <label class="storecheckout-template__label">Gemeente</label>
                        <input class="storecheckout-template__input" type="text" value="Antwerpen" />
                    </div>
                </div>
            </div>
        </div>

        <aside class="storecheckout-template__panel storecheckout-template__summary">
            <div class="storecheckout-template__item">
                <span>Product 1</span>
                <strong>€ 24,00</strong>
            </div>
            <div class="storecheckout-template__item">
                <span>Product 2</span>
                <strong>€ 39,00</strong>
            </div>
            <div class="storecheckout-template__item">
                <span>Verzendkosten</span>
                <strong>€ 6,95</strong>
            </div>

            <div class="storecheckout-template__totals">
                <div class="storecheckout-template__price">
                    <span>Subtotaal</span>
                    <span>€ 63,00</span>
                </div>
                <div class="storecheckout-template__price">
                    <span>Totaal</span>
                    <span>€ 69,95</span>
                </div>
            </div>

            <button class="storecheckout-template__button" type="button">Afrekenen</button>
        </aside>
    </div>
</div>
