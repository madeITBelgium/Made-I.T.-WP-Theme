<style>
    @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600&display=swap');
		:root {
			--desaturated-red: hsl(0, 36%, 70%);
			--soft-red: hsl(0, 93%, 68%);
			--dark-grayish-red: hsl(0, 6%, 24%);
			--gradient_1: linear-gradient(135deg, hsl(0, 0%, 100%), hsl(0, 100%, 98%));
			--gradient_2: linear-gradient(135deg, hsl(0, 80%, 86%), hsl(0, 74%, 74%));
		}

		body {
			margin: 0px;
			padding: 0px;
			font-family: 'Josefin Sans', sans-serif;
			font-size: 16px;
		}
		main {
			width: 100%;
			height: 100vh;
			display: flex;
			flex-direction: row;
		}
		.left-panel {
			width: 65%;
			height: 100%;
			/* background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='830' height='800'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='95.861%25' x2='10.913%25' y1='2.476%25' y2='101.718%25'%3E%3Cstop offset='0%25' stop-color='%23FFF1F1'/%3E%3Cstop offset='100%25' stop-color='%23FFF'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='95.937%25' x2='10.848%25' y1='2.476%25' y2='101.718%25'%3E%3Cstop offset='0%25' stop-color='%23FFF1F1'/%3E%3Cstop offset='100%25' stop-color='%23FFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='url(%23a)' d='M0 800c48.557-184.991 167.048-301.57 355.473-349.737C543.898 402.096 688.074 252.008 788 0v800H0z' transform='rotate(180 394 400)'/%3E%3Cpath fill='red' d='M413 800c25.696-97.814 88.4-159.455 188.112-184.924C700.824 589.608 777.12 510.25 830 377v423H413z'/%3E%3C/g%3E%3C/svg%3E"); */
            background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
		}
		.left-panel .left-panel-wrapper {
			width: 70%;
			height: 80%;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.left-panel .left-panel-wrapper .left-panel-logo {
			align-self: flex-start;
    		height: 15%;
			max-width: 200px;
		}
        .left-panel .left-panel-wrapper .left-panel-logo img {
            height: 100%;
            width: 100%;
			object-fit: contain;
        }
		.left-panel .left-panel-wrapper .left-panel-title {
			align-self: flex-start;
    		height: 40%;
		}
		.left-panel .left-panel-wrapper .left-panel-title h1 {
			font-size: 30px;
			text-transform: uppercase;
			font-weight: 400;
			letter-spacing: 20px;
			color: var(--dark-grayish-red);
		}
		.left-panel .left-panel-wrapper .left-panel-title h1 span {
			display: block;
			margin-bottom: 10px;
		}
		.left-panel .left-panel-wrapper .left-panel-title h1 span:first-child {
			color: var(--desaturated-red);
			font-weight: 300;
			margin-bottom: 10px;
		}
		.left-panel .left-panel-wrapper .left-panel-text {
			align-self: flex-start;
    		height: 20%;
		}
		.left-panel .left-panel-wrapper .left-panel-text p {
			color: var(--desaturated-red);
			line-height: 35PX;
			width: 50%;
			display: inline-block;
		}
		.left-panel .left-panel-wrapper .left-panel-form {
			align-self: flex-start;
			height: 25%;
			display: flex;
			flex-direction: row;
		}
		.left-panel .left-panel-wrapper .left-panel-form .left-panel-input {
			position: relative;
		}
		.left-panel .left-panel-wrapper .left-panel-form .left-panel-input input {
			display: block;
			margin-bottom: 10px;
			width: 270px;
   		 	padding: 10px 80px 10px 25px;
			box-sizing: content-box;
			border: 2px solid lightgrey;
			outline: none;
			border-radius: 25px;
			position: relative;
		}
		input::placeholder {
			color: var(--desaturated-red);
		}
		.left-panel .left-panel-wrapper .left-panel-form .left-panel-input span {
			color: var(--soft-red);
			font-size: 14PX;
			margin-left: 25px;
			display: none;
		}
		.left-panel .left-panel-wrapper .left-panel-form .left-panel-input div {
			width: 20px;
			height: 20px;
			background: var(--soft-red);
			display: inline-block;
			position: absolute;
			z-index: 1;
			top: 10px;
			right: 55px;
			border-radius: 50%;
			text-align: center;
			display: none;
		}
		.left-panel .left-panel-wrapper .left-panel-form .left-panel-input div img {
			width: 18px;
		}
		.left-panel .left-panel-wrapper .left-panel-form .left-panel-button {
			position: relative;
		}
		.left-panel .left-panel-wrapper .left-panel-form .left-panel-button button {
			background: var(--gradient_2);
			width: 70px;
			padding: 12px 10px;
			border: 0px;
			outline: none;
			border-radius: 25px;
			cursor: pointer;
			text-align: center;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			position: absolute;
			left: -45px;
			box-shadow: 2px 2px 9px 0px hsl(0deg 36% 70%);
		}
		.left-panel .left-panel-wrapper .left-panel-form .left-panel-button button img {
			width: 10px;
		}
		.left-panel .left-panel-wrapper .left-panel-form .left-panel-button button:hover {
			background: #f8cecf;
		}
		.right-panel {
			width: 35%;
			height: 100%;
			background: url(<?php echo esc_url(get_option('under_construction_background_image', '')); ?>);
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
		}
		.left-panel-img {
			width: 35%;
			height: 100%;
			/* background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='830' height='800'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='95.861%25' x2='10.913%25' y1='2.476%25' y2='101.718%25'%3E%3Cstop offset='0%25' stop-color='%23FFF1F1'/%3E%3Cstop offset='100%25' stop-color='%23FFF'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='95.937%25' x2='10.848%25' y1='2.476%25' y2='101.718%25'%3E%3Cstop offset='0%25' stop-color='%23FFF1F1'/%3E%3Cstop offset='100%25' stop-color='%23FFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='url(%23a)' d='M0 800c48.557-184.991 167.048-301.57 355.473-349.737C543.898 402.096 688.074 252.008 788 0v800H0z' transform='rotate(180 394 400)'/%3E%3Cpath fill='url(%23b)' d='M413 800c25.696-97.814 88.4-159.455 188.112-184.924C700.824 589.608 777.12 510.25 830 377v423H413z'/%3E%3C/g%3E%3C/svg%3E"); */
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			display: none;
            fill: red;
		}


		@media (max-width: 1440px) {
			
		}
		@media (max-width: 375px) {
			.right-panel {
				display: none;
			}
			main {
				height: auto;
			}
			.left-panel {
				width: 100%;
    			background: var(--gradient_1);
			}
			.left-panel .left-panel-wrapper {
				width: 100%;
			}
			.left-panel .left-panel-wrapper .left-panel-logo {
				width: 100%;
				height: 85px;
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			.left-panel .left-panel-wrapper .left-panel-logo img {
				margin-left: 35px;
			}
			.left-panel .left-panel-wrapper .left-panel-img {
				display: block;
				width: 100%;
    			height: 240px;
			}
			.left-panel .left-panel-wrapper .left-panel-title {
				width: 100%;
				margin-left: auto;
				margin-right: auto;
			}
			.left-panel .left-panel-wrapper .left-panel-title h1 {
				font-size: 40px;
				font-weight: 700;
				text-align: center;
				margin: 50px 0px 15px;
				letter-spacing: 15px;
			}
			.left-panel .left-panel-wrapper .left-panel-text {
				width: 100%;
			}
			.left-panel .left-panel-wrapper .left-panel-text p {
				width: 100%;
				text-align: center;
				line-height: 27px;
			}
			.left-panel .left-panel-wrapper .left-panel-form {
				width: 100%;
				margin: 30px 0px 70px;
				display: flex;
				flex-direction: row;
				justify-content: center;
			}
			.left-panel .left-panel-wrapper .left-panel-form .left-panel-input input {
				width: 180px;
				margin-left: -20px;
			}
		}
</style>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nieuwe Website Binnenkort Online! | <?php // get website name ?></title>
</head>
<body>
    <main>
        <div class="left-panel">
            <div class="left-panel-wrapper">
                <div class="left-panel-logo" style="margin: auto;">
                    <?php 
                        echo '<div class="website-logo"><img src="' . esc_url( wp_get_attachment_image_src( get_theme_mod( 'custom_logo' ), 'full' )[0] ) . '" alt="Logo" class="logo"></div>';
                    ?>
                </div>
                <div class="left-panel-img"></div>
                <div class="left-panel-title" style="text-align: center; margin-bottom: 30px; margin-top: 50px; margin-left: auto; margin-right: auto;">
                    <h1><?php echo esc_html(get_option('under_construction_title', 'COMING SOON')); ?></h1>
					<p><?php echo esc_html(get_option('under_construction_message', 'We zijn momenteel bezig met het bouwen van onze website. Kom snel terug!')); ?></p>
                </div>
                
				<div class="left-panel-social" style="margin-bottom: 30px;">
					<p style="color: var(--desaturated-red); margin-bottom: 10px;"><?php echo esc_html(get_option('under_construction_social_media_announcement', 'Volg ons op social media')); ?></p>
					<ul class="wp-block-social-links has-icon-color is-style-logos-only is-content-justification-center is-layout-flex wp-container-core-social-links-is-layout-16018d1d wp-block-social-links-is-layout-flex" style="display: flex; flex-direction: row; justify-content: center; gap: 20px; list-style: none; padding-left: 0px; margin: auto;">
						<?php if (get_option('under_construction_facebook')) : ?>
						<li style="color: #1a1a1a; " class="wp-social-link wp-social-link-facebook has-default-text-color wp-block-social-link">
							<a href="<?php echo esc_url(get_option('under_construction_facebook')); ?>" class="wp-block-social-link-anchor">
								<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z"></path></svg>
							</a>
						</li>
						<?php endif; ?>
						<?php if (get_option('under_construction_twitter')) : ?>
						<li style="color: #1a1a1a; " class="wp-social-link wp-social-link-twitter has-default-text-color wp-block-social-link">
							<a href="<?php echo esc_url(get_option('under_construction_twitter')); ?>" class="wp-block-social-link-anchor">
								<svg width="24" height="24" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg>
							</a>
						</li>
						<?php endif; ?>
						<?php if (get_option('under_construction_instagram')) : ?>
						<li style="color: #1a1a1a; " class="wp-social-link wp-social-link-instagram has-default-text-color wp-block-social-link">
							<a href="<?php echo esc_url(get_option('under_construction_instagram')); ?>" class="wp-block-social-link-anchor">
								<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z"></path></svg>
							</a>
						</li>
						<?php endif; ?>
						<?php if (get_option('under_construction_linkedin')) : ?>
						<li style="color: #1a1a1a; " class="wp-social-link wp-social-link-linkedin has-default-text-color wp-block-social-link">
							<a href="<?php echo esc_url(get_option('under_construction_linkedin')); ?>" class="wp-block-social-link-anchor">
								<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"></path></svg>
							</a>
						</li>
						<?php endif; ?>
					</ul>
				</div>

            </div>
        </div>
        <div class="right-panel"></div>
    </main>
</body>
</html>
