
<style>
@font-face {
    font-family: 'Gotham';
    src: url('/wp-content/themes/website_name/fonts/Gotham-Bold.eot');
    src: url('/wp-content/themes/website_name/fonts/Gotham-Bold.eot?#iefix') format('embedded-opentype'),
        url('/wp-content/themes/website_name/fonts/Gotham-Bold.woff2') format('woff2'),
        url('/wp-content/themes/website_name/fonts/Gotham-Bold.woff') format('woff'),
        url('/wp-content/themes/website_name/fonts/Gotham-Bold.ttf') format('truetype'),
        url('/wp-content/themes/website_name/fonts/Gotham-Bold.svg#Gotham-Bold') format('svg');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
}

:root {
    --bg-color: <?php echo esc_attr(get_option('under_construction_background_color', '#006699')); ?>;
    --tekst-color: <?php echo esc_attr(get_option('under_construction_text_color', '#ffffff')); ?>;
}

html,
body {
  margin: 0;
  height: 100%;
  color: var(--tekst-color);
}
body {
  font-family: "Gotham", sans-serif;
  font-weight: bold;
  overflow: hidden;
}
.vertical-container {
  display: table;
  width: 100%;
  height: 100%;
}
.vertical-body {
  display: table-cell;
  vertical-align: middle;
  width: 100%;
}

.background {
  background-color: var(--bg-color);
  animation: popup 2s;
}
.container {
  padding: 0 10px;
  margin: 0 auto;
  max-width: 960px;
  text-align: center;
  animation: blur 2s;
}
.title {
  font-size: 40px;
  margin-bottom: 0;
  animation: popup 2s;
  color: var(--tekst-color);
}
.logo {
  max-width: 200px;
  height: auto;
  margin-top: 20px;
  animation: popup 2s;
}

@keyframes blur {
  0% {
    filter: blur(12px);
  }
  100% {
    filter: blur(0px);
  }
}

@keyframes popup {
  0% {
    transform: scale(1.2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

<!DOCTYPE html>
<html lang="BE">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nieuwe Website Binnenkort Online! | <?php // get website name ?></title>
  </head>
  <body>
      <div class="vertical-container background" id="main">
          <div class="vertical-body">
                <div class="container">
                    <h1 class="title"><?php echo esc_html(get_option('under_construction_title', 'COMING SOON')); ?></h1>
                    <p><?php echo esc_html(get_option('under_construction_message', 'This website is under construction.')); ?></p>
                    <div style="height: 150px;"></div>
                    <?php if ($logo = get_option('under_construction_logo')) : ?>
                        <img src="<?php echo esc_url($logo); ?>" alt="Logo" class="logo">
                    <?php endif; ?>
                </div>
          </div>
      </div>
  </body>
</html>
