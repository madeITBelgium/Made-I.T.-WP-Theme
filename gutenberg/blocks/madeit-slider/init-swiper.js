// init-swiper.js
document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.wp-block-madeit-slider').forEach(function (slider) {
    const wrapper = slider.querySelector('.swiper');
    const next = slider.querySelector('.swiper-button-next');
    const prev = slider.querySelector('.swiper-button-prev');

    const slidesDesktop = parseFloat(slider.dataset.slidesDesktop, 10) || 1;
    const slidesTablet = parseFloat(slider.dataset.slidesTablet, 10) || 1;
    const slidesMobile = parseFloat(slider.dataset.slidesMobile, 10) || 1;
    const autoplay = slider.dataset.autoplay === 'true';
    const speed = parseInt(slider.dataset.speed) || 5000;
    const navigation = slider.dataset.navigation === 'true';
    const loop = slider.dataset.loop === 'true';
    const pagination = slider.dataset.pagination === 'true';
    const paginationType = slider.dataset.paginationType || 'bullets';
    const paginationDynamic = slider.dataset.paginationDynamic === 'true' || false;
    const paginationMaxBullets = parseInt(slider.dataset.paginationMaxBullets, 10) || 5;


    const crossFade = slider.dataset.crossFade === 'true';
    const effect = slider.dataset.effect || 'slide';

    new Swiper(wrapper, {
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
      loop: loop,
      spaceBetween: 10,
      autoplay: autoplay ? {
      delay: speed,
      disableOnInteraction: true,
      } : false,
      navigation: navigation ? {
      nextEl: next,
      prevEl: prev
      } : false,
      speed: speed,

      crossFade: crossFade,
      effect: effect,
      
      pagination: pagination ? {
        el: '.swiper-pagination',
        clickable: true,
        type: paginationType,
        dynamicBullets: paginationDynamic,
        dynamicMainBullets: paginationMaxBullets || 5,
      } : false,

    });
  });
});

