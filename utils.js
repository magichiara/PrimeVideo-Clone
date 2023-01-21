const ce = (el) => document.createElement(el);
const qs = (el) => document.querySelector(el);
const GET = async (BASE_URL) =>
  await fetch(BASE_URL)
    .then((res) => res.json())
    .then((data) => data);
const IMG_URL = "https://image.tmdb.org/t/p/w200/";

const createCard = (item, parent) => {
  for (let i = 0; i <= 20; i++) {
    const cardEl = ce("div");
    const imgEl = ce("img");

    cardEl.addEventListener("mouseenter", () => {
      const position = getOffset(cardEl);
      const modalEl = qs(".modal");

      if (modalEl) return;
      createModal(item.results[i], position);
    });

    cardEl.className = "card";
    imgEl.className = "card-img";
    imgEl.setAttribute("src", `${IMG_URL}${item.results[i].poster_path}`);
    cardEl.append(imgEl);
    parent.append(cardEl);
  }
};

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  };
}

// LOCAL STORAGE
const addToLocal = (item) => {
  const localData = localStorage.getItem("favourites"); // prendo i dati dal local storage
  const objectData = JSON.parse(localData);
  if (!objectData) {
    const parsedItem = JSON.stringify([item]);
    localStorage.setItem("favourites", parsedItem);
    return;
  }
  const matchData = objectData.find((elem) => elem.id === item.id);
  if (matchData) return;
  objectData.push(item);

  const parsedItem = JSON.stringify(objectData); // salvo i dati dal local storage
  localStorage.setItem("favourites", parsedItem); // salvo i dati dal local storage
};

// CHECK USER AUTHENTICATION
const checkAuth = () => {
  const getItem = localStorage.getItem("auth");
  if (getItem == 1) return true;
  return false;
};

const createModal = (item, position) => {
  const localData = localStorage.getItem("favourites");
  const objectData = JSON.parse(localData);
  const bodyEl = qs("body");
  const imgUrl = "https://image.tmdb.org/t/p/w200/";
  const modalEl = ce("div");
  const imgModalEl = ce("img");
  const totalContainer = ce("div");
  const titleContainer = ce("div");
  const titleModalEl = ce("h3");
  const iconContainer = ce("div");
  const playIcon = ce("span");
  const favIcon = ce("span");
  const descrModalEl = ce("p");
  const yearContainer = ce("div");
  const yearModalEl = ce("h4");
  const starsContEl = ce("div");

  modalEl.className = "modal";
  imgModalEl.className = "modal-img";
  totalContainer.className = "total-container";
  titleContainer.className = "title-container";
  titleModalEl.className = "modal-title";
  iconContainer.className = "icon-container";
  favIcon.className = "material-symbols-outlined";
  playIcon.className = "material-symbols-outlined";
  descrModalEl.className = "modal-descr";
  yearContainer.className = "year-container";
  yearModalEl.className = "modal-year";
  starsContEl.className = "stars";

  modalEl.style.left = `${position.left}px`;
  modalEl.style.top = `${position.top}px`;

  starsContEl.setAttribute("style", `--rating:${item.vote_average}`);
  imgModalEl.setAttribute("src", `${imgUrl}${item.backdrop_path}`);
  imgModalEl.setAttribute("alt", `movie-img`);
  titleModalEl.textContent = item.name;
  descrModalEl.textContent = item.overview;
  yearModalEl.textContent = new Date(item.first_air_date).getFullYear();
  playIcon.textContent = "play_circle";
  favIcon.textContent = "favorite";

  modalEl.addEventListener("mouseout", () => {
    modalEl.remove();
  });

  if (objectData) {
    const matchData = objectData.find((elem) => elem.id === item.id);
    if (matchData) {
      favIcon.className = "material-symbols-outlined fill";
    }
  }

  // ADD TO LOCAL STORAGE
  favIcon.addEventListener("click", () => {
    if (!checkAuth()) return;
    addToLocal(item);
  });

  titleContainer.append(titleModalEl, iconContainer);
  iconContainer.append(playIcon, favIcon);
  yearContainer.append(yearModalEl, starsContEl);
  totalContainer.append(titleContainer, descrModalEl, yearContainer);
  modalEl.append(imgModalEl, totalContainer);
  bodyEl.append(modalEl);
};

export { ce, qs, GET, createCard, addToLocal, checkAuth };
