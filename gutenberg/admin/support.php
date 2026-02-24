<?php
if (!defined('ABSPATH')) {
    exit;
}


if (!function_exists('madeit_blocks_support_page')) {
    function madeit_blocks_support_page() {
        ?>
        <div class="wrap madeit-support-page" style="max-width: 1400px; margin: 50px auto; ">

            <h1>Made I.T. Support Center</h1>

            <p class="description">
                Hulp nodig met de Made I.T. Gutenberg blocks of dit thema?  
                Hier vind je documentatie, updates en directe support.
            </p>

            <div class="madeit-grid">

                <!-- TODO -->
                <div class="madeit-card">
                    <h2>📘 Documentatie</h2>
                    <p>Handleidingen en voorbeelden van al onze blocks.</p>
                    <a class="button button-primary" href="https://crm.madeit.be/knowledge/article/158" target="_blank">
                        Bekijk documentatie
                    </a>
                </div>

                 <!-- TODO -->
                <div class="madeit-card">
                    <h2>💬 Support aanvragen</h2>
                    <p>Problemen of vragen? Neem rechtstreeks contact op met ons team.</p>
                    <a href="#" class="button" id="madeit-open-support" OnClick="document.getElementById('supportForm').style.display='block';">
                        Support ticket aanmaken
                    </a>

                    <div id="supportForm" class="card" style="opacity: 1; transition: opacity 0.5s; position: fixed; inset: 0px; margin: auto; max-width: 50%; height: max-content; z-index: 10000;">
                        <div class="card-body">
                            <h2>Suport ticket aanmaken</h2>
                            <p>Maak hier een support ticket aan voor hulp of vragen.</p>
                            <form action="https://n8n.madeit.be/webhook-test/7f1c05d9-f64d-4335-8b4b-ad6c6bf77403" method="post">
                                <div class="d-flex">
                                    <div class="w-50" style="width: 50%;">
                                        <label for="firstname" class="form-label">Voornaam</label>
                                        <input type="text" class="form-control" id="firstname" name="firstname" required="">
                                    </div>
                                    <div class="w-50" style="width: 50%;">
                                        <label for="lastname" class="form-label">Achternaam</label>
                                        <input type="text" class="form-control" id="lastname" name="lastname" required="">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">E-mail</label>
                                    <input type="email" class="form-control" id="email" name="email" required="">
                                </div>
                                <div class="mb-3">
                                    <label for="subject" class="form-label">Onderwerp</label>
                                    <input type="text" class="form-control" id="subject" name="subject" required="">
                                </div>
                                <div class="mb-3">
                                    <label for="description" class="form-label">Omschrijving</label>
                                    <textarea class="form-control" id="description" name="description" rows="4" required=""></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Verstuur</button>
                                <button class="btn btn-secondary btnClose">Sluiten</button>
                            </form>

                        </div>
                    </div>

                    
                    <script>
                        document.addEventListener('DOMContentLoaded', function () {

                            document.querySelectorAll('.btnClose').forEach(function(button){
                                button.addEventListener('click', function(e){
                                    e.preventDefault();
                                    document.getElementById('supportForm').style.display='none';
                                });
                            });

                        });
                    </script>
                </div>

                <div class="madeit-card">
                    <h2>🆕 Wat is nieuw?</h2>
                    <p>Bekijk recente updates en nieuwe functies.</p>
                    <a class="button" href="?page=madeit-blocks-updates">
                        Bekijk updates
                    </a>
                </div>

                <div class="madeit-card">
                    <h2>🧱 Blocks overzicht</h2>
                    <p>Beheer welke Made I.T. blocks actief zijn.</p>
                    <a class="button" href="?page=madeit-blocks">
                        Naar blocks
                    </a>
                </div>

            </div>

            <hr />

            <div class="madeit-grid two">

                <div class="madeit-card">
                    <h2>🖥 Systeeminformatie</h2>
                    <ul class="madeit-system-info">
                        <li><strong>WordPress:</strong> <?php echo get_bloginfo('version'); ?></li>
                        <li><strong>PHP:</strong> <?php echo phpversion(); ?></li>
                        <li><strong>Theme:</strong> <?php echo wp_get_theme(); ?></li>
                        <li><strong>Child theme:</strong> <?php echo is_child_theme() ? 'Ja' : 'Nee'; ?></li>
                    </ul>

                    <button class="button" id="madeit-copy-system">
                        Kopieer systeeminfo
                    </button>
                    <script>
                        document.getElementById('madeit-copy-system').addEventListener('click', function(){
                            const infoItems = document.querySelectorAll('.madeit-system-info li');
                            let infoText = '';
                            infoItems.forEach(function(item){
                                infoText += item.textContent + '\n';
                            });
                            navigator.clipboard.writeText(infoText).then(function(){
                                alert('Systeeminformatie gekopieerd naar klembord!');
                            });
                        });
                    </script>
                </div>

                 <!-- TODO -->
                <div class="madeit-card">
                    <h2>📋 Laatste updates</h2>
                    <ul>
                        <?php
                        $max_updates = 6;
                        $rendered = 0;

                        if (function_exists('madeit_get_all_changelogs')) {
                            $versions = madeit_get_all_changelogs();

                            foreach ($versions as $version => $blocks) {
                                foreach ($blocks as $block_entry) {
                                    if ($rendered >= $max_updates) {
                                        break 2;
                                    }

                                    $block_title = is_array($block_entry) && isset($block_entry['block'])
                                        ? (string) $block_entry['block']
                                        : '';

                                    $change_items = is_array($block_entry) && isset($block_entry['items']) && is_array($block_entry['items'])
                                        ? $block_entry['items']
                                        : [];

                                    $summary = '';
                                    foreach ($change_items as $change_item) {
                                        if (!is_string($change_item)) {
                                            continue;
                                        }

                                        $candidate = trim($change_item);
                                        if ($candidate === '') {
                                            continue;
                                        }

                                        if (substr($candidate, -1) === ':') {
                                            continue;
                                        }

                                        $candidate = preg_replace('/^[-•]\s*/u', '', $candidate);
                                        $summary = (string) $candidate;
                                        break;
                                    }

                                    if ($summary === '' && !empty($change_items) && is_string($change_items[0])) {
                                        $summary = trim((string) $change_items[0]);
                                        $summary = preg_replace('/^[-•]\s*/u', '', $summary);
                                    }

                                    if ($summary === '') {
                                        continue;
                                    }

                                    $version_text = (string) $version;
                                    $label = 'v' . $version_text;
                                    if ($block_title !== '') {
                                        $label .= ' — ' . $block_title;
                                    }
                                    ?>
                                    <li><strong><?php echo esc_html($label); ?>:</strong> <?php echo esc_html($summary); ?></li>
                                    <?php
                                    $rendered++;
                                }
                            }
                        }

                        if ($rendered === 0) {
                            echo '<li>' . esc_html__('Geen recente updates gevonden.', 'madeit') . '</li>';
                        }
                        ?>
                    </ul>
                </div>

            </div>

            <hr />

            <div class="madeit-card">
                <h2>❓ Veelgestelde vragen</h2>

                <details>
                    <summary>Waarom zie ik een block niet?</summary>
                    <p>Controleer of het block geactiveerd is in Made I.T → Blocks.</p>
                </details>

                <details>
                    <summary>Hoe krijg ik updates?</summary>
                    <p>Updates worden automatisch geleverd via het theme.</p>
                </details>

                <details>
                    <summary>Kan ik blocks uitschakelen?</summary>
                    <p>Ja, via Made I.T → Blocks beheer je per block de status.</p>
                </details>

            </div>

        </div>

        <style>.madeit-support-page .madeit-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
            gap: 20px;
            margin: 25px 0;
        }

        .madeit-card {
            background: #fff;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e5e5e5;
        }

        .madeit-card h2 {
            margin-top: 0;
        }

        .madeit-grid.two {
            grid-template-columns: 1fr 1fr;
        }

        details summary {
            cursor: pointer;
            font-weight: 600;
        }


        .madeit-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.45);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }

        .madeit-modal-overlay.is-open {
            display: flex;
        }

        .madeit-modal {
            background: #fff;
            padding: 30px;
            border-radius: 14px;
            width: 100%;
            max-width: 520px;
            position: relative;
            box-shadow: 0 10px 40px rgba(0,0,0,.2);
        }

        .madeit-modal-close {
            position: absolute;
            top: 12px;
            right: 14px;
            border: none;
            background: none;
            font-size: 26px;
            cursor: pointer;
        }

        .madeit-modal form {
            display: flex;
            flex-direction: column;
        }
        .madeit-modal input,
        .madeit-modal textarea {
            margin-bottom: 15px;
            font-size: 16px;
        }
        .card {
            border-radius: .5rem;
            border: none;
            box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;

        }

        #supportForm {
            display: none;
        }
        .card-body {
            padding: 1.5rem;
        }
        
        .form-label {
                margin-bottom: .5rem
            }

        .form-control {
            display: block;
            width: 100%;
            padding: .375rem .75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: .25rem;
            transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out
        }
        textarea.form-control {
            min-height: calc(1.5em + .75rem + calc(1px * 2));
            margin-bottom: 1rem;
        }

        .btn {
            display: inline-block;
            font-weight: 400;
            color: #212529;
            text-align: center;
            vertical-align: middle;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            background-color: transparent;
            border: 1px solid transparent;
            padding: .375rem .75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: .25rem;
            transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out
        }
        .btn-primary {
            color: #fff;
            background-color: #0d6efd;
            border-color: #0d6efd
        }
        .btn-primary:hover {
            color: #fff;
            background-color: #0b5ed7;
            border-color: #0a58ca
        }
        .btn-secondary {
            color: #fff;
            background-color: #6c757d;
            border-color: #6c757d
        }
        .btn-secondary:hover {
            color: #fff;
            background-color: #5c636a;
            border-color: #565e64
        }
        .mb-3 {
            margin-bottom: 1rem !important
        }

        </style>
        <?php
    }
}