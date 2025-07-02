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
		}
        .left-panel .left-panel-wrapper .left-panel-logo img {
            height: 100%;
            width: auto;
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
                <div class="left-panel-logo">
                    <?php if ($logo = get_option('under_construction_logo')) : ?>
                        <img src="<?php echo esc_url($logo); ?>" alt="Logo" class="logo">
                    <?php endif; ?>
                </div>
                <div class="left-panel-img"></div>
                <div class="left-panel-title" style="margin-bottom: 30px; margin-top: 50px;">
                    <h1><?php echo esc_html(get_option('under_construction_title', 'COMING SOON')); ?></h1>
					<p><?php echo esc_html(get_option('under_construction_message', 'We zijn momenteel bezig met het bouwen van onze website. Kom snel terug!')); ?></p>
                </div>
                <div class="left-panel-form">
                    <div class="left-panel-input">
                        <input type="email" id="emailAddr" placeholder="Email Address">
                        <span id="error_msg">Please provide a valid email</span>
                        <div id="error_icon"><img src="https://rvs-base-apparel-coming-soon.netlify.app/images/icon-error.svg" alt=""></div>
                    </div>
                    <div class="left-panel-button">
						<form action="mailto:someone@example.com" method="post" enctype="text/plain">
							<button id="formButton">
								<img src="https://rvs-base-apparel-coming-soon.netlify.app/images/icon-arrow.svg" style="width: 10px;" alt="error icon">
							</button>
						</form>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-panel"></div>
    </main>
</body>
</html>
