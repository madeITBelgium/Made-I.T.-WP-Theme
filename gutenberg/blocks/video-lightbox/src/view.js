
document.addEventListener('DOMContentLoaded', () => {
	const triggers = document.querySelectorAll(
		'.madeit-video-lightbox__trigger'
	);

	if (!triggers.length) {
		return;
	}

	/**
	 * ---------------------------------------------------------
	 * HELPERS
	 * ---------------------------------------------------------
	 */

	/**
	 * Check if URL is a YouTube URL.
	 */
	function isYouTubeUrl(url) {
		if (!url) {
			return false;
		}

		return (
			url.includes('youtube.com/watch') ||
			url.includes('youtube.com/embed') ||
			url.includes('youtu.be/')
		);
	}

	/**
	 * Get YouTube video ID from URL.
	 */
	function getYouTubeId(url) {
		if (!url) {
			return null;
		}

		try {
			const parsedUrl = new URL(url);

			// youtube.com/watch?v=VIDEO_ID
			if (
				parsedUrl.hostname.includes('youtube.com') &&
				parsedUrl.searchParams.get('v')
			) {
				return parsedUrl.searchParams.get('v');
			}

			// youtube.com/embed/VIDEO_ID
			if (
				parsedUrl.hostname.includes('youtube.com') &&
				parsedUrl.pathname.startsWith('/embed/')
			) {
				return parsedUrl.pathname
					.replace('/embed/', '')
					.split('/')[0];
			}

			// youtu.be/VIDEO_ID
			if (parsedUrl.hostname === 'youtu.be') {
				return parsedUrl.pathname
					.replace('/', '')
					.split('/')[0];
			}
		} catch (error) {
			return null;
		}

		return null;
	}

	/**
	 * Build YouTube embed URL.
	 */
	function getYouTubeEmbedUrl(
		videoId,
		{
			autoplay = true,
			controls = true,
			loop = false,
			muted = false,
		} = {}
	) {
		const params = new URLSearchParams();

		params.set('rel', '0');
		params.set('playsinline', '1');

		params.set(
			'autoplay',
			autoplay ? '1' : '0'
		);

		params.set(
			'controls',
			controls ? '1' : '0'
		);

		params.set(
			'mute',
			muted ? '1' : '0'
		);

		/*
		 * YouTube requires playlist=VIDEO_ID
		 * when loop is enabled.
		 */
		if (loop) {
			params.set('loop', '1');
			params.set('playlist', videoId);
		}

		return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
	}

	/**
	 * ---------------------------------------------------------
	 * CREATE LIGHTBOX
	 * ---------------------------------------------------------
	 */

	const lightbox = document.createElement('div');

	lightbox.className = 'madeit-video-lightbox';

	lightbox.setAttribute(
		'aria-hidden',
		'true'
	);

	lightbox.innerHTML = `
		<div class="madeit-video-lightbox__inner">

			<button
				type="button"
				class="madeit-video-lightbox__close"
				aria-label="Video sluiten"
			>
				<span aria-hidden="true">&times;</span>
			</button>

			<div class="madeit-video-lightbox__media"></div>

		</div>
	`;

	document.body.appendChild(lightbox);

	/**
	 * ---------------------------------------------------------
	 * ELEMENTS
	 * ---------------------------------------------------------
	 */

	const inner = lightbox.querySelector(
		'.madeit-video-lightbox__inner'
	);

	const mediaContainer = lightbox.querySelector(
		'.madeit-video-lightbox__media'
	);

	const closeButton = lightbox.querySelector(
		'.madeit-video-lightbox__close'
	);

	let currentTrigger = null;

	/**
	 * ---------------------------------------------------------
	 * OPEN
	 * ---------------------------------------------------------
	 */

	function openLightbox(trigger) {
		const videoUrl =
			trigger.dataset.videoUrl || '';

		if (!videoUrl) {
			return;
		}

		currentTrigger = trigger;

		/**
		 * Settings
		 */
		const posterUrl =
			trigger.dataset.posterUrl || '';

		const controls =
			trigger.dataset.controls === '1';

		const autoplay =
			trigger.dataset.autoplay === '1';

		const loop =
			trigger.dataset.loop === '1';

		const muted =
			trigger.dataset.muted === '1';

		const aspectRatio =
			trigger.dataset.aspectRatio || '16/9';

		const playButtonSize =
			trigger.dataset.playButtonSize || '80';

		const overlayOpacity =
			trigger.dataset.overlayOpacity || '90';

		/**
		 * Clear previous media.
		 */
		mediaContainer.innerHTML = '';

		/**
		 * CSS variables
		 */
		lightbox.style.setProperty(
			'--madeit-video-lightbox-overlay-opacity',
			String(
				Number(overlayOpacity) / 100
			)
		);

		lightbox.style.setProperty(
			'--madeit-video-lightbox-aspect-ratio',
			aspectRatio
		);

		lightbox.style.setProperty(
			'--madeit-video-lightbox-play-size',
			`${playButtonSize}px`
		);

		/**
		 * -----------------------------------------------------
		 * YOUTUBE
		 * -----------------------------------------------------
		 */

		if (isYouTubeUrl(videoUrl)) {
			const videoId =
				getYouTubeId(videoUrl);

			if (!videoId) {
				return;
			}

			const iframe =
				document.createElement('iframe');

			iframe.className =
				'madeit-video-lightbox__youtube';

			iframe.src =
				getYouTubeEmbedUrl(
					videoId,
					{
						autoplay,
						controls,
						loop,
						muted,
					}
				);

			iframe.title =
				trigger.dataset.videoTitle ||
				'YouTube video';

			iframe.allow =
				'autoplay; encrypted-media; picture-in-picture; fullscreen';

			iframe.allowFullscreen = true;

			iframe.setAttribute(
				'frameborder',
				'0'
			);

			mediaContainer.appendChild(
				iframe
			);
		}

		/**
		 * -----------------------------------------------------
		 * NORMAL VIDEO
		 * -----------------------------------------------------
		 */

		else {
			const video =
				document.createElement('video');

			video.className =
				'madeit-video-lightbox__video';

			video.src = videoUrl;

			video.controls = controls;

			video.loop = loop;

			video.muted =
				muted || autoplay;

			video.autoplay = autoplay;

			video.preload = 'auto';

			video.playsInline = true;

			video.setAttribute(
				'playsinline',
				''
			);

			if (posterUrl) {
				video.poster = posterUrl;
			}

			mediaContainer.appendChild(
				video
			);

			/**
			 * Explicitly start playback.
			 */
			if (autoplay) {
				const playVideo = () => {
					video.play().catch(() => {
						/*
						 * Browser blocked autoplay.
						 * Controls remain available.
						 */
					});
				};

				if (video.readyState >= 2) {
					playVideo();
				} else {
					video.addEventListener(
						'loadeddata',
						playVideo,
						{
							once: true,
						}
					);
				}
			}
		}

		/**
		 * -----------------------------------------------------
		 * OPEN LIGHTBOX
		 * -----------------------------------------------------
		 */

		lightbox.classList.add(
			'is-open'
		);

		lightbox.setAttribute(
			'aria-hidden',
			'false'
		);

		document.body.classList.add(
			'madeit-video-lightbox-open'
		);

		closeButton.focus();
	}

	/**
	 * ---------------------------------------------------------
	 * CLOSE
	 * ---------------------------------------------------------
	 */

	function closeLightbox() {
		mediaContainer.innerHTML = '';

		lightbox.classList.remove(
			'is-open'
		);

		lightbox.setAttribute(
			'aria-hidden',
			'true'
		);

		document.body.classList.remove(
			'madeit-video-lightbox-open'
		);

		if (currentTrigger) {
			currentTrigger.focus();
		}

		currentTrigger = null;
	}

	/**
	 * ---------------------------------------------------------
	 * TRIGGERS
	 * ---------------------------------------------------------
	 */

	triggers.forEach((trigger) => {
		trigger.addEventListener(
			'click',
			(event) => {
				event.preventDefault();

				openLightbox(trigger);
			}
		);
	});

	/**
	 * ---------------------------------------------------------
	 * CLOSE BUTTON
	 * ---------------------------------------------------------
	 */

	closeButton.addEventListener(
		'click',
		closeLightbox
	);

	/**
	 * ---------------------------------------------------------
	 * CLICK OUTSIDE VIDEO
	 * ---------------------------------------------------------
	 */

	lightbox.addEventListener(
		'click',
		(event) => {
			const closeOnOverlay =
				currentTrigger &&
				currentTrigger.dataset.closeOnOverlay === '1';

			if (!closeOnOverlay) {
				return;
			}

			if (
				event.target === lightbox ||
				event.target === inner
			) {
				closeLightbox();
			}
		}
	);

	/**
	 * ---------------------------------------------------------
	 * ESCAPE
	 * ---------------------------------------------------------
	 */

	document.addEventListener(
		'keydown',
		(event) => {
			if (
				event.key === 'Escape' &&
				lightbox.classList.contains(
					'is-open'
				)
			) {
				closeLightbox();
			}
		}
	);
});