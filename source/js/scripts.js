const tabletMedia = 1250;
let swiper = Swiper;
let init = false;

function swiperCard() {
  if (window.innerWidth <= tabletMedia) {
    if (!init) {
      init = true;
      swiper = new Swiper(".swiper", {
        slidesPerView: 1,
        navigation: {
          nextEl: ".swiper .swiper-button-next",
          prevEl: ".swiper .swiper-button-prev",
        },
      });
    }
  } else if (init) {
    swiper.destroy();
    init = false;
  }
}
swiperCard();
window.addEventListener("resize", swiperCard);

const toggle = document.querySelector(".header__toggle");
const nav = document.querySelector(".nav");

toggle.addEventListener("click", () => {
  console.log("clicked");
  nav.classList.toggle("hidden");
});
