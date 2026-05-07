<div class="madeit-review-card__content">

	<div class="d-flex gap-3" style="margin-bottom: 1rem;">
		<div class="madeit-card__message">
			<?php if ($titel !== '') : ?>
				<div class="madeit-review-card__title"><?php echo esc_html($titel); ?></div>
			<?php endif; ?>

			<?php if ($bericht !== '') : ?>
				<div class="madeit-review-card__message"  style="margin-bottom: 0.5rem;"><?php echo esc_html(wp_trim_words($bericht, 40)); ?> </div>
			<?php endif; ?>

			<span class="madeit-review-card__name"><?php echo esc_html($naam); ?></span>
			
			<?php if ($rating > 0) : ?>
				<div class="madeit-review-card__rating" aria-label="<?php echo esc_attr(sprintf(__('Rating: %d van 5', 'madeit-review'), $rating)); ?>">
					<?php echo esc_html(str_repeat('⭐', $rating)); ?>
				</div>
			<?php endif; ?>
		</div>

		
		<div class="madeit-review-card__meta" style="min-width: 100px; text-align: center; display: flex; flex-direction: column; align-items: center;">
			<?php if (!empty($show_image)) {

				if (!empty($avatar_url)) { ?>
					<div class="madeit-review-card__avatar">
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
					<div class="madeit-review-card__avatar" style="<?php echo esc_attr(implode(';', $initial_styles)); ?>; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold;">
						<span class="initial"><?php echo esc_html($initial); ?></span>
					</div>
				<?php } ?>
			<?php
			}
			?>
		</div>
		
	</div>

</div>