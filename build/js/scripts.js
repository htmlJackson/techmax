const tabletMedia=1250;let swiper=Swiper,init=!1;function swiperCard(){if(window.innerWidth<=1250)init||(init=!0,swiper=new Swiper(".swiper",{slidesPerView:1,navigation:{nextEl:".swiper .swiper-button-next",prevEl:".swiper .swiper-button-prev"}}));else if(init){document.querySelectorAll(".swiper").forEach((e=>e.swiper.destroy())),init=!1}}swiperCard(),window.addEventListener("resize",swiperCard);const toggle=document.querySelector(".header__toggle"),nav=document.querySelector(".nav");toggle.addEventListener("click",(()=>nav.classList.toggle("hidden")));