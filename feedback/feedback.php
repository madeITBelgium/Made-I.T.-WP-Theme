<?php

// 3. AJAX FRONTEND FORM HANDLING
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script('html2canvas', 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js', [], null, true);
    wp_enqueue_script('feedback-front', get_template_directory_uri() . '/feedback/feedback.js', ['html2canvas'], '1.0', true);

    wp_localize_script('feedback-front', 'feedback_ajax', [
        'ajax_url' => admin_url('admin-ajax.php'),
    ]);

    // style
    wp_enqueue_style('feedback-style', get_template_directory_uri() . '/feedback/feedback.css');
});

add_shortcode('feedback_button', function() {
    ob_start();
    ?>
    <div id="feedBee-cntr">
        <button id="feedbackBtn">
            <img src="/wp-content/uploads/2025/05/system-solid-21-bug-loop-bug.gif" alt="">
            <span style="--i:0;"></span>
            <span style="--i:1;"></span>
            <span style="--i:2;"></span>
        </button>
        <div id="clickOverlay" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9998;background:rgba(0,0,0,0.1);cursor:crosshair;"></div>
        
        <!-- <div id="FeedBee_success" class="">✅ Bedankt voor je feedback!</div> -->

        <div id="feedbackForm">
            <div class="banner">
                <div class="brand">
                    <img src="/wp-content/uploads/2025/05/system-solid-21-bug-loop-bug.gif" alt="">
                    <h3><b>FeedBee</b></h3>
                </div>
                <button id="closeFeedbackForm">
                    <div class="x">
                        <div class="line1"></div>
                        <div class="line2"></div>
                    </div>
                </button>
            </div>
            <div class="content">
                <div class="form-field">
                    <label for="feedbackTitle">Titel</label>
                    <input id="feedbackTitle" type="text" placeholder="Geef een titel aan je feedback...">
                </div>
                <div class="form-field">
                    <label for="feedbackText">Beschrijving</label>
                    <textarea id="feedbackText" placeholder="Beschrijf het probleem..."></textarea>
                </div>
                <div class="form-field">
                    <label for="feedbackType">Type</label>
                    <select id="feedbackType">
                        <option value="BUG">🐞 BUG</option>
                        <option value="Verbetering">✨ Verbetering</option>
                        <option value="Vraag">❓ Vraag</option>
                        <option value="Overig">📌 Overig</option>
                    </select>
                </div>
                
                <button id="submitFeedback" class="btn btn-success">Verstuur</button>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
});

// 5. AUTOMATISCH TOEVOEGEN AAN ELKE PAGINA
add_action('wp_footer', function() {
    $website = rtrim(home_url(), '/');
    //strip http:// or https://
    $website = preg_replace('#^https?://#', '', $website);
    $website = preg_replace('#^www\.#', '', $website);
    $website = preg_replace('#/$#', '', $website);

    //pass to javascript
    ?>
    <script>
        var website = '<?php echo $website; ?>';
    </script>
    <?php
    echo do_shortcode('[feedback_button]');
});
