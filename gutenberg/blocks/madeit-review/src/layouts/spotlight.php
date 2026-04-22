<div class="madeit-review-card__content">

	<div class="d-flex align-items-center gap-3">
		<?php if (!empty($show_image)) {

			if (!empty($avatar_url)) { ?>
				<div class="madeit-review-card__avatar" style="width: 50%">
					<img
						src="<?php echo esc_url($avatar_url); ?>"
						alt="<?php echo esc_attr(!empty($avatar_alt) ? $avatar_alt : $naam); ?>"
						style="<?php echo esc_attr(implode(';', $img_styles)); ?>"
						loading="lazy"
					/>
				</div>
			<?php } else { 
				// show first letter of name if no avatar
				$initial = !empty($naam) ? mb_substr($naam, 0, 1) : '?';
				$initial_bg_color = '#ededed'; // generate a color based on the name
				$initial_styles[] = "background-color: $initial_bg_color";
				?>

				<div class="avatar-container" style="width: 50%; height: stretch; position: relative;">
					<div class="madeit-review-card__avatar" style="<?php echo esc_attr(implode(';', $initial_styles)); ?>; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; position: absolute; left: 0; right: 0; top: 0; bottom: 0;">
						<span class="initial"><?php echo esc_html($initial); ?></span>
					</div>
				</div>
			<?php } ?>
		<?php
		}
		?>

		<div class="madeit-review-card__meta">
			<?php if ($titel !== '') : ?>
				<div class="madeit-review-card__title"><?php echo esc_html($titel); ?></div>
			<?php endif; ?>

			<?php if ($bericht !== '') : ?>
				<div class="madeit-review-card__message"><?php echo wpautop(wp_kses_post($bericht)); ?></div>
			<?php endif; ?>

			<div class="madeit-review-card__meta">
				<span class="madeit-review-card__name"><?php echo esc_html($naam); ?></span> <br>
				<?php if ($bedrijf !== '') : ?>
					<div class="company"><?php echo esc_html($bedrijf); ?></div>
				<?php endif; ?>
				
				<?php if ($rating > 0) : ?>
					<div class="madeit-review-card__rating" aria-label="<?php echo esc_attr(sprintf(__('Rating: %d van 5', 'madeit-review'), $rating)); ?>">
						<?php echo esc_html(str_repeat('⭐', $rating)); ?>
					</div>
				<?php endif; ?>
			</div>
		</div>

	</div>

</div>