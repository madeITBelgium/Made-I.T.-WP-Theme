(function () {
  function mutationAddedReviewBlock(mutation) {
    if (!mutation || !mutation.addedNodes || !mutation.addedNodes.length) return false;
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      var node = mutation.addedNodes[i];
      if (!node || node.nodeType !== 1) continue;
      try {
        if (typeof node.matches === 'function' && node.matches('.wp-block-madeit-reviews')) return true;
        if (typeof node.querySelector === 'function' && node.querySelector('.wp-block-madeit-reviews')) return true;
      } catch (e) {}
    }
    return false;
  }

  function getSwiperCtorForDocument(doc) {
    try {
      if (doc && doc.defaultView && typeof doc.defaultView.Swiper === 'function') return doc.defaultView.Swiper;
    } catch (e) {}
    if (typeof window.Swiper === 'function') return window.Swiper;
    try {
      if (window.parent && typeof window.parent.Swiper === 'function') return window.parent.Swiper;
    } catch (e) {}
    return null;
  }

  function isEditorCanvasDocument(doc) {
    if (!doc) return false;
    try {
      if (doc.documentElement && doc.documentElement.classList && doc.documentElement.classList.contains('block-editor-iframe__html')) return true;
      if (doc.body && doc.body.classList && doc.body.classList.contains('block-editor-iframe__body')) return true;
    } catch (e) {}
    return false;
  }

  function waitForSwiperInDocument(doc, onReady) {
    if (!doc || typeof onReady !== 'function') return;

    var attempts = 0;
    var maxAttempts = 40; // ~4s at 100ms

    function tick() {
      attempts++;
      if (typeof getSwiperCtorForDocument(doc) === 'function') {
        onReady();
        return;
      }
      if (attempts >= maxAttempts) return;
      try {
        doc.defaultView.setTimeout(tick, 100);
      } catch (e) {
        setTimeout(tick, 100);
      }
    }

    tick();
  }

  function ensureSwiperCssInDocument(doc, onReady) {
    if (!doc || !doc.head) return;
    if (typeof onReady !== 'function') return;

    var cssId = 'madeit-swiper-css';
    var existing = doc.getElementById(cssId);
    if (existing) {
      onReady();
      return;
    }

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      onReady();
    }

    var link = doc.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/swiper@11/swiper-bundle.min.css';
    link.onload = finish;
    link.onerror = finish;
    doc.head.appendChild(link);

    // Fallback: don't wait forever if load events are blocked.
    try {
      doc.defaultView.setTimeout(finish, 250);
    } catch (e) {
      setTimeout(finish, 250);
    }
  }

  function ensureSwiperAssetsInDocument(doc, onReady) {
    if (!doc || !doc.head) return;
    if (typeof onReady !== 'function') return;

    var hasLocal = false;
    try {
      hasLocal = !!(doc.defaultView && typeof doc.defaultView.Swiper === 'function');
    } catch (e) {}
    if (hasLocal) {
      onReady();
      return;
    }

    // Ensure CSS is present (JS might come from parent window).
    ensureSwiperCssInDocument(doc, function () {});

    var jsId = 'madeit-swiper-js';
    var existing = doc.getElementById(jsId);
    if (existing) {
      // If the script exists, wait until Swiper is actually available.
      waitForSwiperInDocument(doc, onReady);
      return;
    }

    var script = doc.createElement('script');
    script.id = jsId;
    script.src = 'https://unpkg.com/swiper@11/swiper-bundle.min.js';
    script.async = true;
    script.onload = function () {
      onReady();
    };
    script.onerror = function () {
      // If CDN fails, don't hard-crash; the editor will still show static markup.
    };
    doc.head.appendChild(script);
  }

  function initReviewSwipersInDocument(doc) {
    if (!doc || !doc.querySelectorAll) return;
    var blocks = doc.querySelectorAll('.wp-block-madeit-reviews');
    if (!blocks || blocks.length === 0) return;

    var SwiperCtor = getSwiperCtorForDocument(doc);
    if (typeof SwiperCtor !== 'function') return;

    blocks.forEach(function (block) {
      var wrapper = block.querySelector('.swiper');
      if (!wrapper) return;

      function removeSwiperDuplicateSlides() {
        // If Swiper previously ran with loop enabled, it may have injected duplicate slides.
        // We remove them to keep counts predictable before we do our own cloning.
        var swiperWrapper = wrapper.querySelector('.swiper-wrapper');
        if (!swiperWrapper) return;
        var duplicates = swiperWrapper.querySelectorAll('.swiper-slide-duplicate');
        if (!duplicates || !duplicates.length) return;
        for (var i = duplicates.length - 1; i >= 0; i--) {
          var node = duplicates[i];
          if (node && node.parentNode) node.parentNode.removeChild(node);
        }
      }

      function ensureEnoughSlidesForLoop(minSlides) {
        // Swiper loop can break or behave oddly with too few slides.
        // We clone the original set of slides until we reach a safe minimum.
        if (!loop) return;
        var swiperWrapper = wrapper.querySelector('.swiper-wrapper');
        if (!swiperWrapper) return;

        removeSwiperDuplicateSlides();

        var children = swiperWrapper.children;
        if (!children || !children.length) return;

        // Collect only real slides.
        var slides = [];
        for (var i = 0; i < children.length; i++) {
          var el = children[i];
          if (el && el.classList && el.classList.contains('swiper-slide')) slides.push(el);
        }
        if (!slides.length) return;

        // Remember the original slide count for this DOM instance.
        // This prevents runaway cloning if init runs multiple times.
        if (!swiperWrapper.dataset.madeitOriginalSlides) {
          swiperWrapper.dataset.madeitOriginalSlides = String(slides.length);
        }
        var originalCount = parseInt(swiperWrapper.dataset.madeitOriginalSlides, 10);
        if (!isFinite(originalCount) || originalCount <= 0) originalCount = slides.length;

        var baseSlides = slides.slice(0, originalCount);
        if (!baseSlides.length) return;

        var target = minSlides;
        if (!isFinite(target) || target <= 0) return;

        var safety = 0;
        // Clone whole sets of originals until we have enough.
        while (slides.length < target && safety < 10) {
          for (var j = 0; j < baseSlides.length; j++) {
            var clone = baseSlides[j].cloneNode(true);
            // Marker for debugging; doesn't affect Swiper.
            clone.setAttribute('data-madeit-cloned', '1');
            swiperWrapper.appendChild(clone);
          }
          // Recount slides.
          slides = [];
          children = swiperWrapper.children;
          for (var k = 0; k < children.length; k++) {
            var el2 = children[k];
            if (el2 && el2.classList && el2.classList.contains('swiper-slide')) slides.push(el2);
          }
          safety++;
        }
      }

      function clampSlidesPerView(value) {
        var parsed = typeof value === 'number' ? value : parseFloat(value);
        if (!isFinite(parsed) || parsed <= 0) return 1;
        return Math.max(1, parsed);
      }

      var slidesDesktop = clampSlidesPerView(block.dataset.slidesDesktop);
      var slidesTablet = clampSlidesPerView(block.dataset.slidesTablet);
      var slidesMobile = clampSlidesPerView(block.dataset.slidesMobile);

      var navigation = block.dataset.navigation === 'true';
      var loop = block.dataset.loop === 'true';

      var autoplayEnabled = block.dataset.autoplay === 'true';
      var autoplaySpeed = parseInt(block.dataset.autoplaySpeed, 10) || 5000;

      var transitionDuration = parseInt(block.dataset.transitionDuration, 10) || 500;

      var paginationEnabled = block.dataset.pagination === 'true';
      function normalizePaginationType(value) {
        if (value === null || typeof value === 'undefined') return 'bullets';
        var v;
        try {
          v = String(value).toLowerCase();
        } catch (e) {
          v = 'bullets';
        }
        if (v === 'bullets' || v === 'fraction' || v === 'progressbar' || v === 'custom' || v === 'numbers') return v;
        return 'bullets';
      }

      var paginationType = normalizePaginationType(block.dataset.paginationType || 'bullets');

      var pauseOnInteraction = block.dataset.pauseOnInteraction !== 'false';

      var inEditorCanvas = isEditorCanvasDocument(doc);

      // If loop is enabled, ensure there are enough slides for the largest slidesPerView.
      // Use a conservative minimum to avoid edge cases with fractional slidesPerView.
      var maxSlidesPerView = inEditorCanvas
        ? slidesDesktop
        : Math.max(slidesDesktop, slidesTablet, slidesMobile);
      var minSlidesForLoop = Math.max(3, Math.ceil(maxSlidesPerView * 2 + 1));
      ensureEnoughSlidesForLoop(minSlidesForLoop);

      // Prevent double initialization.
      // In the editor canvas we may need to re-init because another init ran with wrong params.
      if (wrapper.swiper) {
        if (inEditorCanvas && wrapper.swiper && wrapper.swiper.params) {
          var current = wrapper.swiper.params.slidesPerView;
          var desired = slidesDesktop;
          // Only force if it looks like it got stuck on 1.
          if (desired > 1 && (current === 1 || current === '1')) {
            try {
              if (typeof wrapper.swiper.destroy === 'function') {
                wrapper.swiper.destroy(true, true);
              }
            } catch (e) {}
            wrapper.swiper = null;
          } else {
            try {
              wrapper.swiper.update();
            } catch (e) {}
            return;
          }
        } else {
          try {
            wrapper.swiper.update();
          } catch (e) {}
          return;
        }
      }

      var next = block.querySelector('.swiper-button-next');
      var prev = block.querySelector('.swiper-button-prev');
      var paginationEl = block.querySelector('.swiper-pagination');

      // When rendering numbered pagination we still use Swiper's "bullets" type
      // under the hood. Add a modifier class so CSS can disable the dot styling.
      if (paginationEl && paginationEl.classList) {
        try {
          if (paginationType === 'numbers') {
            paginationEl.classList.add('madeit-swiper-pagination--numbers');
          } else {
            paginationEl.classList.remove('madeit-swiper-pagination--numbers');
          }
        } catch (e) {}
      }

      function getActiveSlidesPerViewForViewport() {
        if (inEditorCanvas) return slidesDesktop;
        var w = 0;
        try {
          w = doc && doc.defaultView ? doc.defaultView.innerWidth : 0;
        } catch (e) {
          w = 0;
        }
        if (!w) {
          try {
            w = window.innerWidth;
          } catch (e2) {
            w = 0;
          }
        }
        if (w >= 1024) return slidesDesktop;
        if (w >= 768) return slidesTablet;
        return slidesMobile;
      }

      function computeDynamicMainBullets() {
        // We want the UI to show only as many bullets as slides currently visible.
        var spv = getActiveSlidesPerViewForViewport();
        var parsed = typeof spv === 'number' ? spv : parseFloat(spv);
        if (!isFinite(parsed) || parsed <= 0) return 1;
        return Math.max(1, Math.ceil(parsed));
      }

      function updateDynamicBullets(swiper) {
        if (!swiper || !swiper.params || !swiper.params.pagination) return;
        if (!paginationEnabled || paginationType !== 'bullets') return;
        try {
          swiper.params.pagination.dynamicBullets = true;
          swiper.params.pagination.dynamicMainBullets = computeDynamicMainBullets();
          if (swiper.pagination && typeof swiper.pagination.render === 'function') swiper.pagination.render();
          if (swiper.pagination && typeof swiper.pagination.update === 'function') swiper.pagination.update();
        } catch (e) {}
      }

      var options = {
        loop: loop,
        speed: transitionDuration,
        spaceBetween: 20,
        watchOverflow: false,
        // In the editor canvas we always want the "desktop" preview (so the UI matches the setting).
        slidesPerView: slidesDesktop,
        breakpoints: inEditorCanvas
          ? undefined
          : {
              0: { slidesPerView: slidesMobile },
              768: { slidesPerView: slidesTablet },
              1024: { slidesPerView: slidesDesktop },
            },
        observer: true,
        observeParents: true,
        navigation: navigation ? { nextEl: next, prevEl: prev } : false,
        pagination:
          paginationEnabled && paginationEl
            ? {
                el: paginationEl,
                clickable: true,
                type: paginationType === 'numbers' ? 'bullets' : paginationType,
                // Show only the bullets that are relevant for the current layout.
                // (e.g. 3 slidesPerView => 3 visible bullets)
                dynamicBullets: paginationType === 'bullets',
                dynamicMainBullets: paginationType === 'bullets' ? computeDynamicMainBullets() : undefined,
                renderBullet:
                  paginationType === 'numbers'
                    ? function (index, className) {
                        return '<span class="' + className + '">' + (index + 1) + '</span>';
                      }
                    : undefined,
              }
            : false,
        autoplay: autoplayEnabled ? { delay: autoplaySpeed, disableOnInteraction: pauseOnInteraction } : false,
        on: {
          init: function (swiper) {
            updateDynamicBullets(swiper);
          },
          breakpoint: function (swiper) {
            updateDynamicBullets(swiper);
          },
          resize: function (swiper) {
            updateDynamicBullets(swiper);
          },
        },
      };

      // In the block editor we want the block to remain selectable.
      // Swiper can stop click propagation / prevent default on touch events.
      if (inEditorCanvas) {
        options.allowTouchMove = false;
        options.simulateTouch = false;
        options.preventClicks = false;
        options.preventClicksPropagation = false;
        options.touchStartPreventDefault = false;
        options.touchStartForcePreventDefault = false;
      }

      var instance;
      try {
        instance = new SwiperCtor(wrapper, options);
      } catch (e) {
        return;
      }

      // Frontend-only sanity check:
      // Sometimes Swiper can compute absurd slide widths if initialized during a bad layout pass.
      // If we detect that, re-init once with safer settings.
      function sanityReinit() {
        if (inEditorCanvas) return;
        if (!instance || instance.destroyed) return;
        var containerWidth = 0;
        var slideWidth = 0;
        try {
          containerWidth = wrapper.getBoundingClientRect().width;
          if (instance.slides && instance.slides[0]) {
            slideWidth = instance.slides[0].getBoundingClientRect().width;
          }
        } catch (e) {}

        if (!containerWidth || !slideWidth) return;

        // "Huge" widths like ~16,777,216px indicate a broken measurement.
        if (slideWidth > 100000 || slideWidth > containerWidth * 50) {
          try {
            instance.destroy(true, true);
          } catch (e) {}
          wrapper.swiper = null;

          var safeOptions = {
            loop: loop,
            speed: transitionDuration,
            slidesPerView: slidesDesktop,
            spaceBetween: 20,
            watchOverflow: false,
            breakpoints: {
              0: { slidesPerView: slidesMobile },
              768: { slidesPerView: slidesTablet },
              1024: { slidesPerView: slidesDesktop },
            },
            navigation: navigation ? { nextEl: next, prevEl: prev } : false,
            pagination:
              paginationEnabled && paginationEl
                ? {
                    el: paginationEl,
                    clickable: true,
                    type: paginationType === 'numbers' ? 'bullets' : paginationType,
                    dynamicBullets: paginationType === 'bullets',
                    dynamicMainBullets: paginationType === 'bullets' ? computeDynamicMainBullets() : undefined,
                    renderBullet:
                      paginationType === 'numbers'
                        ? function (index, className) {
                            return '<span class="' + className + '">' + (index + 1) + '</span>';
                          }
                        : undefined,
                  }
                : false,
            autoplay: autoplayEnabled ? { delay: autoplaySpeed, disableOnInteraction: pauseOnInteraction } : false,
            observer: false,
            observeParents: false,
            on: {
              init: function (swiper) {
                updateDynamicBullets(swiper);
              },
              breakpoint: function (swiper) {
                updateDynamicBullets(swiper);
              },
              resize: function (swiper) {
                updateDynamicBullets(swiper);
              },
            },
          };
          try {
            new SwiperCtor(wrapper, safeOptions);
          } catch (e) {}
        }
      }

      setTimeout(function () {
        try {
          if (instance && typeof instance.update === 'function') instance.update();
        } catch (e) {}
        sanityReinit();
      }, 0);
      setTimeout(function () {
        try {
          if (instance && typeof instance.update === 'function') instance.update();
        } catch (e) {}
        sanityReinit();
      }, 200);
    });
  }

  function initAllContexts() {
    // Current document.
    initReviewSwipersInDocument(document);

    // Block editor canvas iframe(s).
    try {
      var iframes = document.querySelectorAll('iframe[name="editor-canvas"], .block-editor-iframe__container iframe');
      if (iframes && iframes.length) {
        iframes.forEach(function (iframe) {
          if (!iframe || iframe.dataset.madeitSwiperBound === '1') return;
          iframe.dataset.madeitSwiperBound = '1';

          function initIframe() {
            var doc;
            try {
              doc = iframe.contentDocument;
            } catch (e) {
              doc = null;
            }
            if (!doc || !doc.body) return;

            // Ensure CSS exists in the iframe first (styles don't inherit from parent).
            ensureSwiperCssInDocument(doc, function () {
              // Try init (can work using parent window's Swiper).
              initReviewSwipersInDocument(doc);

              // Fallback: inject Swiper JS into the iframe and retry.
              ensureSwiperAssetsInDocument(doc, function () {
                initReviewSwipersInDocument(doc);
              });
            });

            if (typeof iframe.contentWindow.MutationObserver === 'function') {
              var observer = new iframe.contentWindow.MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i++) {
                  var m = mutations[i];
                  if (mutationAddedReviewBlock(m)) {
                    ensureSwiperCssInDocument(doc, function () {
                      // Try init immediately (parent Swiper), then fallback to iframe assets.
                      initReviewSwipersInDocument(doc);
                      ensureSwiperAssetsInDocument(doc, function () {
                        initReviewSwipersInDocument(doc);
                      });
                    });
                    break;
                  }
                }
              });
              observer.observe(doc.body, { childList: true, subtree: true });
            }
          }

          iframe.addEventListener('load', initIframe);
          initIframe();
        });
      }
    } catch (e) {}
  }

  function initReviewSwipers(root) {
    // Backwards-compatible API: accept a root element/document.
    if (root && root.nodeType === 9) {
      // Document.
      initReviewSwipersInDocument(root);
      return;
    }
    initAllContexts();
  }

  // Expose so editor code (or other scripts) can manually re-run after SSR updates.
  window.madeitInitReviewSwipers = initReviewSwipers;

  function scheduleInit() {
    if (scheduleInit._scheduled) return;
    scheduleInit._scheduled = true;
    window.requestAnimationFrame(function () {
      scheduleInit._scheduled = false;
      initAllContexts();
    });
  }

  function bindDocumentObserver() {
    // ServerSideRender injects markup after load in the editor;
    // observe DOM changes and init Swiper when blocks appear.
    if (typeof window.MutationObserver !== 'function') return;
    if (!document.body) return;

    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (mutationAddedReviewBlock(m)) {
          scheduleInit();
          break;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAllContexts();
      bindDocumentObserver();
    });
  } else {
    // DOMContentLoaded already happened.
    initAllContexts();
    bindDocumentObserver();
  }
})();
