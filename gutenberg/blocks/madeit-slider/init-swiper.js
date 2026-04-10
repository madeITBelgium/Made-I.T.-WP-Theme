// init-swiper.js
document.addEventListener('DOMContentLoaded', function () {

  function cssLengthToPx(value, contextEl) {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value === 'number' && Number.isFinite(value)) return value;

    const raw = String(value).trim();
    if (!raw) return null;

    // Plain number: treat as px.
    if (/^[0-9]*\.?[0-9]+$/.test(raw)) {
      const num = parseFloat(raw);
      return Number.isFinite(num) ? num : null;
    }

    // Fast-path for px.
    if (/^[0-9]*\.?[0-9]+px$/.test(raw)) {
      const num = parseFloat(raw);
      return Number.isFinite(num) ? num : null;
    }

    // Fallback: ask the browser to compute the length.
    try {
      const probe = document.createElement('div');
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      probe.style.pointerEvents = 'none';
      probe.style.width = raw;
      (contextEl || document.body).appendChild(probe);
      const px = probe.getBoundingClientRect().width;
      probe.remove();
      return Number.isFinite(px) ? px : null;
    } catch (e) {
      return null;
    }
  }

  document.querySelectorAll('.wp-block-madeit-slider').forEach(function (slider) {
    const wrapper = slider.querySelector('.swiper');
    if (!wrapper) return;

    // Prevent double initialization (can happen with block preview refreshes).
    if (wrapper.swiper) return;

    const swiperWrapperEl = wrapper.querySelector('.swiper-wrapper');

    const next = slider.querySelector('.swiper-button-next');
    const prev = slider.querySelector('.swiper-button-prev');
    const paginationEl = slider.querySelector('.swiper-pagination');

    const slidesDesktop = parseFloat(slider.dataset.slidesDesktop, 10) || 1;
    const slidesTablet = parseFloat(slider.dataset.slidesTablet, 10) || 1;
    const slidesMobile = parseFloat(slider.dataset.slidesMobile, 10) || 1;
    const autoplay = slider.dataset.autoplay === 'true';
    const speed = parseInt(slider.dataset.speed, 10) || 5000;
    const spaceBetween = cssLengthToPx(slider.dataset.spaceBetween, slider) ?? 10;
    const allowTouchMove = slider.dataset.touchSlides !== 'false';
    const navigation = slider.dataset.navigation === 'true';
    const loop = slider.dataset.loop === 'true';
    const pagination = slider.dataset.pagination === 'true';
    const paginationType = slider.dataset.paginationType || 'bullets';
    const paginationDynamic = slider.dataset.paginationDynamic === 'true' || false;
    const paginationMaxBullets = parseInt(slider.dataset.paginationMaxBullets, 10) || 5;


    const crossFade = slider.dataset.crossFade === 'true';
    const effect = slider.dataset.effect || 'slide';
    const isLogoTicker = effect === 'logo';

    function clampSlidesPerView(value) {
      const parsed = typeof value === 'number' ? value : parseFloat(value);
      if (!Number.isFinite(parsed)) return 1;
      return Math.max(1, parsed);
    }

    function getSlidesPerViewForViewport() {
      const width = window.innerWidth || 1024;
      if (width >= 1024) return clampSlidesPerView(slidesDesktop);
      if (width >= 768) return clampSlidesPerView(slidesTablet);
      return clampSlidesPerView(slidesMobile);
    }

    function applyLogoLayoutVars() {
      if (!isLogoTicker) return;
      slider.style.setProperty('--logo-slides-per-view', String(getSlidesPerViewForViewport()));
      slider.style.setProperty('--logo-space-between', `${spaceBetween}px`);
    }

    applyLogoLayoutVars();
    if (isLogoTicker) {
      let resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          applyLogoLayoutVars();
          if (wrapper.swiper && typeof wrapper.swiper.update === 'function') {
            wrapper.swiper.update();
          }
        }, 150);
      }, { passive: true });
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initLogoMarquee() {
      if (!swiperWrapperEl) return;

      // Clean up previous clones/animation (e.g. editor refresh, resize re-init).
      swiperWrapperEl.querySelectorAll('[data-madeit-logo-clone="true"]').forEach((el) => el.remove());
      if (swiperWrapperEl.__madeitLogoAnim && typeof swiperWrapperEl.__madeitLogoAnim.cancel === 'function') {
        swiperWrapperEl.__madeitLogoAnim.cancel();
      }
      swiperWrapperEl.__madeitLogoAnim = null;

      const originals = Array.from(swiperWrapperEl.children).filter((el) =>
        el && el.classList && el.classList.contains('swiper-slide') && el.getAttribute('data-madeit-logo-clone') !== 'true'
      );

      if (originals.length < 2) return;

      // Apply sizing vars before measuring.
      applyLogoLayoutVars();
      swiperWrapperEl.style.gap = `${spaceBetween}px`;

      // Force a reflow so widths are applied before we measure.
      // eslint-disable-next-line no-unused-expressions
      swiperWrapperEl.offsetHeight;

      const containerWidth = wrapper.getBoundingClientRect().width;
      const gapPx = spaceBetween;

      const measureSetWidth = (elements) => {
        let total = 0;
        elements.forEach((el, idx) => {
          total += el.getBoundingClientRect().width;
          if (idx < elements.length - 1) total += gapPx;
        });
        return total;
      };

      const originalSetWidth = measureSetWidth(originals);
      if (!Number.isFinite(originalSetWidth) || originalSetWidth <= 0) return;

      // Clone slides until we can translate by one full set without ever showing a gap.
      let allSlides = Array.from(swiperWrapperEl.children).filter((el) => el && el.classList && el.classList.contains('swiper-slide'));
      let totalWidth = measureSetWidth(allSlides);

      let safety = 0;
      while (totalWidth < (containerWidth + originalSetWidth) && safety < 20) {
        originals.forEach((slideEl) => {
          const clone = slideEl.cloneNode(true);
          clone.setAttribute('data-madeit-logo-clone', 'true');
          swiperWrapperEl.appendChild(clone);
        });
        allSlides = Array.from(swiperWrapperEl.children).filter((el) => el && el.classList && el.classList.contains('swiper-slide'));
        totalWidth = measureSetWidth(allSlides);
        safety++;
      }

      if (prefersReducedMotion) return;

      // `speed` is used as duration for one full cycle.
      const durationMs = Math.max(500, speed);
      swiperWrapperEl.__madeitLogoAnim = swiperWrapperEl.animate(
        [
          { transform: 'translate3d(0,0,0)' },
          { transform: `translate3d(-${originalSetWidth}px,0,0)` },
        ],
        {
          duration: durationMs,
          iterations: Infinity,
          easing: 'linear',
        }
      );
    }

    if (isLogoTicker) {
      initLogoMarquee();
      let resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          initLogoMarquee();
        }, 200);
      }, { passive: true });
      return;
    }

    const logoSlidesCount = wrapper?.querySelectorAll?.('.swiper-slide')?.length || 0;

    const baseOptions = {
      loop: loop,
      spaceBetween: spaceBetween,
      navigation: navigation ? {
        nextEl: next,
        prevEl: prev
      } : false,
      speed: speed,
      allowTouchMove: allowTouchMove,
      crossFade: crossFade,
      effect: effect,
      pagination: pagination && paginationEl ? {
        el: paginationEl,
        clickable: true,
        type: paginationType,
        dynamicBullets: paginationDynamic,
        dynamicMainBullets: paginationMaxBullets || 5,
      } : false,
    };

    const normalOptions = {
      slidesPerView: effect === 'slide' ? slidesDesktop : 1,
      breakpoints: effect === 'slide' ? {
        0: {
          slidesPerView: slidesMobile,
        },
        768: {
          slidesPerView: slidesTablet,
        },
        1024: {
          slidesPerView: slidesDesktop,
        },
      } : undefined,
      autoplay: autoplay ? {
        delay: speed,
        disableOnInteraction: true,
      } : false,
    };

    new Swiper(wrapper, {
      ...baseOptions,
      ...normalOptions,
    });
  });
});

