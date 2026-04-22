<div class="madeit-review-card__content">
	<?php if ($titel !== '') : ?>
		<div class="madeit-review-card__title mb-3" style="font-size: 1.5rem; font-weight: bold;"><?php echo esc_html($titel); ?></div>
	<?php endif; ?>

	<?php if ($bericht !== '') : ?>
		<p class="message"><?php echo wp_kses_post($bericht); ?></p>
	<?php endif; ?>

	<hr class="separator" style="border: none; border-top: 1px solid var(--madeit-review-card-separator, #ccc); margin: 1rem 0;">

	<div class="meta d-flex align-items-center gap-3">
		<?php if ($show_image && $avatar_url !== '') { ?>
			<div class="madeit-review-card__avatar">
				<img
					src="<?php echo esc_url($avatar_url); ?>"
					alt="<?php echo esc_attr($avatar_alt !== '' ? $avatar_alt : $naam); ?>"
					style="<?php echo esc_attr(implode(';', $img_styles)); ?>"
					loading="lazy"
				/>
			</div>
		<?php } else {
			// show first letter of name if no avatar
			$initial = $naam !== '' ? mb_substr($naam, 0, 1) : '?';
			$initial_bg_color = '#ededed'; // generate a color based on the name
			$initial_styles[] = "background-color: $initial_bg_color";
			?>
			<div class="madeit-review-card__avatar" style="<?php echo esc_attr(implode(';', $initial_styles)); ?>; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold;">
				<span class="initial"><?php echo esc_html($initial); ?></span>
			</div>
		<?php }; ?>

		<div>
			<div class="name"><b><?php echo esc_html($naam); ?></b></div>
			<?php if ($bedrijf !== '') : ?>
				<div class="company"><?php echo esc_html($bedrijf); ?></div>
			<?php endif; ?>
			<?php if ($rating > 0) : ?>
				<div class="rating"><?php echo esc_html(str_repeat('⭐', $rating)); ?></div>
			<?php endif; ?>
		</div>

	</div>


</div>