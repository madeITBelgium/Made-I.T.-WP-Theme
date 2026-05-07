<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- template variables set by calling function
defined( 'ABSPATH' ) || exit;

$results  = \MadeIT\Security\Settings::get( 'madeit_security_vulnaudit_results', [] );
$summary  = \MadeIT\Security\Settings::get( 'madeit_security_vulnaudit_summary', [] );
$last_run = \MadeIT\Security\Settings::get( 'madeit_security_vulnaudit_last_run', '' );

$score = $summary['score'] ?? 0;
$grade = $summary['grade'] ?? '—';
$total = $summary['total'] ?? 0;
$pass  = $summary['pass']  ?? 0;
$crit  = $summary['critical'] ?? 0;
$high  = $summary['high']     ?? 0;
$med   = $summary['medium']   ?? 0;
$low   = $summary['low']      ?? 0;

// Group results by category.
$grouped = [];
foreach ( $results as $r ) {
	$cat = $r['category'] ?? 'Other';
	$grouped[ $cat ][] = $r;
}

// Grade colour.
$grade_color = '#c0392b';
if ( $score >= 90 ) $grade_color = '#1e8449';
elseif ( $score >= 75 ) $grade_color = '#27ae60';
elseif ( $score >= 60 ) $grade_color = '#e67e22';
elseif ( $score >= 40 ) $grade_color = '#d35400';
?>
<div class="madeit-security-page-header">
	<div class="madeit-security-page-header__left">
		<span class="madeit-security-shield-icon">🛡️</span>
		<div><h1 class="madeit-security-page-title">Vulnerability Audit</h1><p class="madeit-security-page-sub">Configuration, exposure &amp; integrity checks</p></div>
	</div>
	<div class="madeit-security-page-header__right">
		<button id="madeit-security-run-vuln-audit" class="madeit-security-btn madeit-security-btn--primary">
			<span class="madeit-security-btn__label">Run Full Audit</span>
			<span class="madeit-security-btn__spinner" style="display:none;">⟳ Running…</span>
		</button>
	</div>
</div>

<div class="madeit-security-page-content">

<!-- ── Score + stat cards ───────────────────────────────────────────── -->
<?php if ( $total > 0 ) : ?>
<div class="madeit-security-stat-cards" style="margin-bottom:20px;">
	<div class="madeit-security-stat-card" style="border-left:4px solid <?php echo esc_attr( $grade_color ); ?>;">
		<div class="madeit-security-stat-card__value" style="font-size:32px;color:<?php echo esc_attr( $grade_color ); ?>;"><?php echo esc_html( $grade ); ?></div>
		<div class="madeit-security-stat-card__label">Security Grade</div>
		<div class="madeit-security-stat-card__sub"><?php echo esc_html( $score ); ?>% — <?php echo esc_html( $pass ); ?>/<?php echo esc_html( $total ); ?> passed</div>
	</div>
	<div class="madeit-security-stat-card madeit-security-stat-card--red">
		<div class="madeit-security-stat-card__value"><?php echo esc_html( $crit ); ?></div>
		<div class="madeit-security-stat-card__label">Critical</div>
	</div>
	<div class="madeit-security-stat-card madeit-security-stat-card--orange">
		<div class="madeit-security-stat-card__value"><?php echo esc_html( $high ); ?></div>
		<div class="madeit-security-stat-card__label">High</div>
	</div>
	<div class="madeit-security-stat-card">
		<div class="madeit-security-stat-card__value"><?php echo esc_html( $med + $low ); ?></div>
		<div class="madeit-security-stat-card__label">Medium / Low</div>
	</div>
</div>

<div class="madeit-security-score-bar-wrap" style="margin-bottom:24px;">
	<div class="madeit-security-score-bar">
		<div class="madeit-security-score-bar__fill" style="width:<?php echo esc_attr( $score ); ?>%; background:<?php echo esc_attr( $grade_color ); ?>;"></div>
	</div>
	<span class="madeit-security-score-label"><?php echo esc_html( $pass ); ?>/<?php echo esc_html( $total ); ?> checks passed (<?php echo esc_html( $score ); ?>%)</span>
</div>
<?php else : ?>
<div class="madeit-security-panel" style="text-align:center;padding:48px 24px;">
	<p style="font-size:15px;color:var(--c-text-3);margin:0 0 16px;">No audit results yet. Click <strong>Run Full Audit</strong> to scan your site.</p>
</div>
<?php endif; ?>

<!-- ── Results grouped by category ──────────────────────────────────── -->
<?php if ( ! empty( $grouped ) ) : ?>
<?php foreach ( $grouped as $cat => $items ) :
	$cat_pass  = count( array_filter( $items, fn( $i ) => $i['pass'] ) );
	$cat_total = count( $items );
?>
<div class="madeit-security-panel" style="margin-bottom:16px;">
	<div class="madeit-security-panel__header">
		<h3 class="madeit-security-panel__title"><?php echo esc_html( $cat ); ?></h3>
		<span class="madeit-security-badge <?php echo ( $cat_pass === $cat_total ) ? 'madeit-security-badge--green' : 'madeit-security-badge--orange'; ?>">
			<?php echo esc_html( $cat_pass ); ?>/<?php echo esc_html( $cat_total ); ?>
		</span>
	</div>
	<div class="madeit-security-table-wrapper">
		<table class="madeit-security-table">
			<thead><tr><th style="width:32px;"></th><th>Check</th><th style="width:80px;">Severity</th><th>Details</th><th style="width:100px;">Action</th></tr></thead>
			<tbody>
			<?php foreach ( $items as $item ) :
				$sev_class = match ( $item['severity'] ) {
					'critical' => 'madeit-security-badge--red',
					'high'     => 'madeit-security-badge--orange',
					'medium'   => 'madeit-security-badge--orange',
					'low'      => 'madeit-security-badge--blue',
					default    => '',
				};
			?>
				<tr class="<?php echo $item['pass'] ? '' : 'madeit-security-row--warning'; ?>">
					<td style="text-align:center;font-size:15px;">
						<?php echo $item['pass'] ? '<span style="color:#1e8449;">✓</span>' : '<span style="color:#c0392b;">✗</span>'; ?>
					</td>
					<td>
						<strong><?php echo esc_html( $item['label'] ); ?></strong>
					</td>
					<td>
						<?php if ( ! $item['pass'] ) : ?>
							<span class="madeit-security-badge <?php echo esc_attr( $sev_class ); ?>"><?php echo esc_html( ucfirst( $item['severity'] ) ); ?></span>
						<?php else : ?>
							<span class="madeit-security-badge madeit-security-badge--green">Pass</span>
						<?php endif; ?>
					</td>
					<td><small><?php echo esc_html( $item['detail'] ); ?></small></td>
					<td>
						<?php if ( ! $item['pass'] && ! empty( $item['option'] ) ) : ?>
							<button class="madeit-security-btn madeit-security-btn--sm madeit-security-btn--primary madeit-security-toggle-setting"
							        data-option="<?php echo esc_attr( $item['option'] ); ?>"
							        data-value="1">Enable</button>
						<?php elseif ( ! $item['pass'] ) : ?>
							<span class="madeit-security-text-muted" title="<?php echo esc_attr( $item['fix'] ); ?>">Manual</span>
						<?php else : ?>
							<span class="madeit-security-text-muted">—</span>
						<?php endif; ?>
					</td>
				</tr>
			<?php endforeach; ?>
			</tbody>
		</table>
	</div>
</div>
<?php endforeach; ?>
<?php endif; ?>

<?php if ( $last_run ) : ?>
<p class="madeit-security-text-muted" style="text-align:center;margin-top:16px;font-size:12px;">
	Last audit: <?php echo esc_html( $last_run ); ?>
</p>
<?php endif; ?>

</div><!-- /.madeit-security-page-content -->
