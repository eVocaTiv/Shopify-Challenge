import {
  updateLikesInLocalStorage,
  restoreLikesFromLocalStorage,
} from "./storageService.js";
import { debounce, lazyLoadImages } from "./helpers.js";
import CONSTANTS from "./constants.js";

// global variables
let likes;
const grid = document.querySelector(".gallery__grid");

// Function to fetch images from NASA's api.
async function fetchImages() {
  const { API_KEY, NASA_URL } = CONSTANTS;
  const url = new URL(NASA_URL + "&api_key=" + API_KEY);

  fetch(url)
    .then((res) => res.json())
    .then((imagesDataJson) => {
      likes = restoreLikesFromLocalStorage(imagesDataJson);
      renderGalleryCards(imagesDataJson);
    });
}

// Function to render a gallery of cards after fetching data.
function renderGalleryCards({ photos }) {
  // since photos property is an array, so we can use .forEach(() => {});
  // create document fragment to minimize reflow.
  const tempGalleryCardsContainer = document.createDocumentFragment();
  const { FAKE_DELAY_500MS } = CONSTANTS;
  photos.forEach((photo) => {
    tempGalleryCardsContainer.appendChild(renderCard(photo));
  });

  // Assumption - the images data is fetched only once.
  setTimeout(() => {
    document.querySelector(".gallery__loader").remove();
    grid.appendChild(tempGalleryCardsContainer);
    lazyLoadImages(); // load images that are visible on page load.
  }, FAKE_DELAY_500MS);
}

// Function to render an individual card.
// Can be further modularized, keeping it as it is for simplicity.
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

  cardName.textContent = `An image clicked with 
    ${camera.full_name} by the rover ${rover.name}`;

  cardDate.setAttribute("class", "gallery__card__date");
  cardDate.textContent = earth_date;

  // Making sure images are accessible!
  cardImagePlaceholder.setAttribute("src", "assets/loading-buffering.gif");
  cardImagePlaceholder.setAttribute("class", "gallery__image__placeholder");
  cardImagePlaceholder.setAttribute(
    "alt",
    "A spinner indicating loading image."
  );
  cardImagePlaceholder.setAttribute(
    "title",
    "A spinner indicating loading image."
  );

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

  likeButton.setAttribute(
    "class",
    "gallery__card__like-btn gallery__card__like-btn--outlined"
  );
  likeButton.dataset.imgId = id;
  likeButton.addEventListener("click", onLikeButtonClicked);

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

// Function to handle a click on like button/heart.
function onLikeButtonClicked({ target }) {
  const { imgId } = target.dataset;
  likes[imgId] = likes.hasOwnProperty(imgId) ? !likes[imgId] : true;
  document.querySelector(`#card-${imgId}`).classList.toggle("liked-card");
  updateLikesInLocalStorage(likes);
}

// Function to kickstart the app.
function initializeApp() {
  window.addEventListener("load", fetchImages);
  window.addEventListener("scroll", debounce(lazyLoadImages));
  window.addEventListener("resize", debounce(lazyLoadImages));
}

initializeApp();

// Assumptions
// 1. Data fetched only once in bulk.
// 2. Api succeeds with valid data i.e no graceful error handling for now.
// 3. Same photos are returned from the api everytime (i.e liking an image overwrite full object
// in localStorage right now for simplicity.)

// Extra features
// 1. Loading state when images data is being fetched from api- DONE.
// 2. Optimized Lazy loading of images. - DONE
// 3. Loading image state when an individual image is loading. - DONE
// 4. Animated like button - DONE
// 5. Like persistence using local storage - DONE

// Thanks for viewing my code, have a great day =).
// -- Kunal Dewan
