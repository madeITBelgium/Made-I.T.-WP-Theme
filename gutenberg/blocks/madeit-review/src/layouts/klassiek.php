<div class="madeit-review-card__content">

	<?php if ($titel !== '') : ?>
		<div class="madeit-review-card__title"><?php echo esc_html($titel); ?></div>
	<?php endif; ?>


	<?php if ($bericht !== '') : ?>
		<div class="madeit-review-card__message"><?php echo wpautop(wp_kses_post($bericht)); ?></div>
	<?php endif; ?>


	<div class="madeit-review-card__meta d-flex align-items-baseline gap-2">
		<strong><?php echo esc_html($naam); ?></strong>
		<?php if ($bedrijf !== '') : ?>
			- <div class="company"> <?php echo esc_html($bedrijf); ?></div>
		<?php endif; ?>
	</div>

	<?php if ($rating > 0) : ?>
		<div class="madeit-review-card__rating">
			<?php echo esc_html(str_repeat('⭐', $rating)); ?>
		</div>
	<?php endif; ?>

</div>