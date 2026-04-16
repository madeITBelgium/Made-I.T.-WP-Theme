<?php if ($show_image && $avatar_url !== '') : ?>
	<div class="madeit-review-card__avatar">
		<img
			src="<?php echo esc_url($avatar_url); ?>"
			alt="<?php echo esc_attr($avatar_alt !== '' ? $avatar_alt : $naam); ?>"
			style="<?php echo esc_attr(implode(';', $img_styles)); ?>"
			loading="lazy"
		/>
	</div>
<?php endif; ?>

<div class="madeit-review-card__content">
	<?php if ($titel !== '') : ?>
		<div class="madeit-review-card__title"><?php echo esc_html($titel); ?></div>
	<?php endif; ?>

	<?php if ($rating > 0) : ?>
		<div class="madeit-review-card__rating" aria-label="<?php echo esc_attr(sprintf(__('Rating: %d van 5', 'madeit-review'), $rating)); ?>">
			<?php echo esc_html(str_repeat('⭐', $rating)); ?>
		</div>
	<?php endif; ?>

	<?php if ($bericht !== '') : ?>
		<div class="madeit-review-card__message"><?php echo wpautop(wp_kses_post($bericht)); ?></div>
	<?php endif; ?>

	<div class="madeit-review-card__meta">
		<span class="madeit-review-card__name"><?php echo esc_html($naam); ?></span>
		<?php if ($bedrijf !== '') : ?>
			<span class="madeit-review-card__company"><?php echo esc_html($bedrijf); ?></span>
		<?php endif; ?>
	</div>
</div>
