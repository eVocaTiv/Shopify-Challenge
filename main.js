// import {
//     toggleLike,
//     updateLikeInLocalStorage,
//     restoreLikesFromLocalStorage
// } from './storageService';

// app constants
// Ideally should go in separate files, but keeping it here for demo simplicity.
const CONSTANTS = {
  API_KEY: "X605MlDLFx5s0otyuQWAF3vkxqrOAbaGfGwzfs0N",
  NASA_URL:
    "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2",
    FAKE_DELAY_250MS: 250, // for demo purposes.
    FAKE_DELAY_500MS: 500, // for demo purposes.
};

let likes;

// view variables
const grid = document.querySelector(".gallery__grid");

function createLikesArray({ photos }) {
  likes = {};
  photos.forEach((photo) => {
    likes[photo.id] = false;
  });
  console.log(likes);
}

async function fetchImages() {
  const { API_KEY, NASA_URL } = CONSTANTS;
  const url = new URL(NASA_URL + "&api_key=" + API_KEY);

  fetch(url)
    .then((res) => res.json())
    .then((imagesDataJson) => {
      restoreLikesFromLocalStorage(imagesDataJson);
      renderGalleryCards(imagesDataJson);
    });
}

function isImageVisible(image) {
  const { top, bottom } = image.getBoundingClientRect();
  const windowHeight = document.documentElement.clientHeight;

  const topVisible = top > 0 && top < windowHeight;
  const botVisible = bottom > 0 && bottom < windowHeight;

  return topVisible || botVisible;
}

async function lazyLoadImages() {
  const { FAKE_DELAY_250MS } = CONSTANTS;
  let imagesRemainToLazyLoad = false;
  for (let image of document.querySelectorAll(
    ".gallery__image__container > img.lazy"
  )) {
    imagesRemainToLazyLoad = true;
    // start loading the image!
    if (isImageVisible(image)) {
      image.classList.remove("lazy");
      image.src = image.dataset.src;
      image.removeAttribute("data-src");
      // remove placeholder once image fully loads.
      image.onload = function () {
        setTimeout(() => {
          image.style.opacity = 1;
          image.previousElementSibling.remove();
        }, FAKE_DELAY_250MS);
      };
    }
  }
  // performance optimzn. remove listener when all images have loaded.
  if (!imagesRemainToLazyLoad) {
    window.removeEventListener("scroll", lazyLoadImages);
  }
}

function renderGalleryCards({ photos }) {
  // since photos property is an array, so we can use .forEach(() => {});
  const tempGalleryCardsContainer = document.createDocumentFragment();
  photos.forEach((photo) => {
    tempGalleryCardsContainer.appendChild(renderCard(photo));
  });

  // Assumption - the images data is fetched only once.
  const {FAKE_DELAY_500MS} = CONSTANTS;
  setTimeout(() => {
    document.querySelector(".gallery__loader").remove();
    grid.appendChild(tempGalleryCardsContainer);
    lazyLoadImages(); // load images that are visible on page load.
  }, FAKE_DELAY_500MS);
}

function renderCard({ earth_date, img_src, id, rover, camera }) {
  const card = document.createElement("article");
  const cardName = document.createElement("h5");
  const cardImageSection = document.createElement("section");
  const cardImagePlaceholder = document.createElement("img");
  const cardImage = document.createElement("img");
  const cardDataSection = document.createElement("section");
  const cardDate = document.createElement("p");
  const likeButton = document.createElement("button");

  card.setAttribute("class", "gallery__card");
  card.setAttribute("id", `card-${id}`);
  if (likes[id]) card.classList.add("liked-card");

  cardName.textContent = `An image clicked with camera 
    ${camera.full_name} by the rover ${rover.name}`;

  cardDate.setAttribute("class", "gallery__card__date");
  cardDate.textContent = earth_date;

  cardImagePlaceholder.setAttribute("src", "loading-buffering.gif");
  cardImagePlaceholder.setAttribute("class", "gallery__image__placeholder");

  // Making sure loaded images are accessible!
  cardImage.setAttribute("data-src", img_src);
  cardImage.setAttribute("id", `img-${id}`);
  cardImage.setAttribute("class", "lazy gallery__image");
  cardImage.setAttribute(
    "alt",
    `An image clicked with camera 
    ${camera.full_name} by the rover ${rover.name}`
  );
  cardImage.setAttribute(
    "title",
    `An image clicked with camera 
    ${camera.full_name} by the rover ${rover.name}`
  );

  likeButton.setAttribute("class", "gallery__card__like-btn");
  likeButton.dataset.imgId = id;
  likeButton.textContent = likes[id] ? "Liked" : "Like"; // TODO: Change with icon and unlike
  likeButton.addEventListener("click", toggleLike);

  cardDataSection.setAttribute("class", "gallery__card__data");

  cardDataSection.appendChild(cardName);
  cardDataSection.appendChild(cardDate);
  cardDataSection.appendChild(likeButton);

  cardImageSection.setAttribute("class", "gallery__image__container");

  cardImageSection.appendChild(cardImagePlaceholder);
  cardImageSection.appendChild(cardImage);

  card.appendChild(cardImageSection);
  card.appendChild(cardDataSection);
  return card;
}

function initializeApp() {
  // add event listeners.
  //   window.addEventListener("DOMContentLoaded", restoreLikesFromLocalStorage)
  window.addEventListener("DOMContentLoaded", fetchImages);
  // TODO: can debounce w/ 0.2s
  window.addEventListener("scroll", lazyLoadImages);
  window.addEventListener('resize', lazyLoadImages);
}

// LOCAL STORAGE FUNCTIONALITY --------------------------------
// TODO: move to a module
function toggleLike(e) {
  const btn = e.target;
  const { imgId } = btn.dataset;
  console.log(likes);
  likes[imgId] = likes.hasOwnProperty(imgId) ? !likes[imgId] : true;
  console.log(likes);
  document.querySelector(`#card-${imgId}`).classList.toggle("liked-card");
  updateLikeInLocalStorage();
}

function updateLikeInLocalStorage() {
  localStorage.setItem("likes", JSON.stringify(likes));
}

function restoreLikesFromLocalStorage(imagesDataJson) {
  const likesFromStorage = localStorage.getItem("likes");

  if (!likesFromStorage) createLikesArray(imagesDataJson);
  else likes = JSON.parse(localStorage.getItem("likes"));
  console.log("likes now", likes);
}

// LOCAL STORAGE FUNCTION END ---------------------------------

initializeApp();

// Assumptions
// 1. Data fetched only once in bulk
// 2. Api succeeds with valid data i.e no graceful error handling for now.
// 3. Same photos are returned from the api everytime (i.e liking an image overwrite full object
// in localStorage right now for simplicity.)

// Extra features
// 1. Loading state when images data is being fetched from api- DONE.
// 2. Optimized Lazy loading of images. - DONE
// 3. Loading image state when an individual image is loading. - DONE

// 4. Animated like button
// 5. Like persistence using local storage

// TODO
// refactor some code & ordering, fix description / change images.
// remove console.log & TODOS
// improve UI
// host
