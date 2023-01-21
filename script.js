import { ce, qs, GET, createCard, addToLocal, checkAuth } from "./utils.js";

// GLOBAL VARIABLES
const POP_URL = `https://api.themoviedb.org/3/tv/popular?api_key=f75f83be5da67c1e1bee412861887cdb&language=en-US&page=`;
const HEROIMG_URL = "https://image.tmdb.org/t/p/w500/";
const openBrowseEl = qs(".header-browse");
const openSearchEl = qs(".fa-magnifying-glass");
const openFavEl = qs(".fav-icon");
const openAuthEl = qs(".fa-user");
const browseContEl = qs(".browse-container");
const searchContEl = qs(".search-container");
const favContEl = qs(".fav-container");
const authContEl = qs(".auth-container");
const bestofFiltered = [];
const lastFiltered = [];
const heroSectEl = qs(".hero");
const firstGalleryEl = qs(".first-container");
const secondGalleryEl = qs(".second-container");
const loginFormEl = qs(".login-modal");
const signInEl = qs(".signin-voice");
const closeModalEl = qs(".close-modal");
const carouselEl = qs(".carousel");
const signUpEl = qs(".signup-voice");
const logOutEl = qs(".logout");
let page = 1;

const checkLog = () => {
  const logData = localStorage.getItem("auth");
  console.log(logData);
  if (logData == 0) {
    logOutEl.classList.add("hidden-auth");
  } else {
    signInEl.classList.add("hidden-auth");
    signUpEl.classList.add("hidden-auth");
  }
};

// BROWSE BAR EVENT
openBrowseEl.addEventListener("click", () => {
  const activeEl = document.querySelectorAll(".active");
  if (browseContEl.classList.contains("active")) {
    browseContEl.classList.remove("active");
    return;
  }
  for (let i = 0; i < activeEl.length; i++) {
    activeEl[i].classList.remove("active");
  }
  browseContEl.classList.add("active");
});

// SEARCH BAR EVENT
openSearchEl.addEventListener("click", () => {
  const activeEl = document.querySelectorAll(".active");
  if (searchContEl.classList.contains("active")) {
    searchContEl.classList.remove("active");
    return;
  }
  for (let i = 0; i < activeEl.length; i++) {
    activeEl[i].classList.remove("active");
  }
  searchContEl.classList.add("active");
});

// FAV BAR EVENT
openFavEl.addEventListener("click", () => {
  const activeEl = document.querySelectorAll(".active");
  if (favContEl.classList.contains("active")) {
    favContEl.classList.remove("active");
    return;
  }
  for (let i = 0; i < activeEl.length; i++) {
    activeEl[i].classList.remove("active");
  }
  favContEl.classList.add("active");
});

// AUTH BAR EVENT
openAuthEl.addEventListener("click", () => {
  const activeEl = document.querySelectorAll(".active");
  if (authContEl.classList.contains("active")) {
    authContEl.classList.remove("active");
    return;
  }
  for (let i = 0; i < activeEl.length; i++) {
    activeEl[i].classList.remove("active");
  }
  authContEl.classList.add("active");
  checkLog();
});

// AUTHENTICATION FORM
const loginForm = document.forms.loginform;
const elemLogin = loginForm.elements;

const openLoginModal = () => {
  // Open & Close functions
  loginFormEl.classList.remove("hidden");
};
const closeLoginModal = () => {
  loginFormEl.classList.add("hidden");
};

signInEl.addEventListener("click", () => {
  // Auth Events
  authContEl.classList.toggle("active");
  openLoginModal();
});

closeModalEl.addEventListener("click", () => {
  closeLoginModal();
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userData = {
    user: elemLogin.username.value,
    psw: elemLogin.password.value,
  };
  closeLoginModal();
  localStorage.setItem("auth", 1);
  location.reload();
});

logOutEl.addEventListener("click", () => {
  logOut();
  openAuthEl.style.color = "#fefefe";
});

const logOut = () => {
  localStorage.setItem("auth", 0);
  location.reload();
};

// HERO SECTION
const displayHero = (item) => {
  for (let i = 0; i < 5; i++) {
    const imgEl = ce("img");
    imgEl.className = "hero-img";
    imgEl.setAttribute("src", `${HEROIMG_URL}${item.results[i].backdrop_path}`);
    imgEl.setAttribute("alt", "hero-img");

    carouselEl.append(imgEl);
  }
  heroSectEl.append(carouselEl);
};

GET(POP_URL)
  .then((data) => displayHero(data))
  .then((data) => {
    const prevBtn = qs(".prev");
    const nextBtn = qs(".next");
    let curSlide = 0;
    const carouselImgs = document.querySelectorAll(".hero-img");
    carouselImgs.forEach((item, idx) => {
      item.style.transform = `translateX(${idx * 100}%)`;
    });

    const checkImg = () => {
      return carouselImgs.length;
    };

    prevBtn.addEventListener("click", () => {
      if (curSlide === 0) return;
      curSlide--;
      carouselImgs.forEach((item, idx) => {
        item.style.transform = `translateX(${100 * (idx - curSlide)}%`;
      });
    });

    nextBtn.addEventListener("click", () => {
      const slideImg = checkImg();
      if (curSlide === slideImg - 1) return;
      curSlide++;
      carouselImgs.forEach((item, idx) => {
        item.style.transform = `translateX(${100 * (idx - curSlide)}%`;
      });
    });
  });

// GET DATA - LAST 10 YEARS
const getLastData = (page) => {
  GET(POP_URL + page).then((item) => filteredLastData(item.results));
};

const getDiff = (year) => {
  const tvYear = new Date(year).getFullYear();
  const thisYear = new Date().getFullYear();
  return thisYear - tvYear;
};

const filteredLastData = (tvlist) => {
  tvlist.forEach((item) => {
    const sub = getDiff(item.first_air_date);
    if (sub < 10) {
      lastFiltered.push(item);
    }
  });
  if (lastFiltered.length < 20) {
    page++;
    getLastData(page);
  } else {
    GET(POP_URL).then((data) => createCard(data, firstGalleryEl));
  }
};
getLastData(page);

// GET DATA - FROM 90 TO 00
const getBestofData = (page) => {
  GET(POP_URL + page).then((item) => filteredData(item.results));
};

const filteredData = (tvlist) => {
  tvlist.forEach((item) => {
    const tvYear = new Date(item.first_air_date).getFullYear();
    if (tvYear >= 1990 && tvYear <= 2000) {
      bestofFiltered.push(item);
    }
  });
  if (bestofFiltered.length < 20) {
    page++;
    getBestofData(page);
  } else {
    GET(POP_URL + page).then((item) => createCard(item, secondGalleryEl));
  }
};

getBestofData(page);
