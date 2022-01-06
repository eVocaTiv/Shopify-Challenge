// app constants
// Ideally should go in separate files, but keeping it here for demo simplicity.
const CONSTANTS = {
  API_KEY: "X605MlDLFx5s0otyuQWAF3vkxqrOAbaGfGwzfs0N",
  NASA_URL:
    "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2",
  FAKE_DELAY_MS: 500, // for demo purposes.
};

// view variables
const grid = document.querySelector(".gallery__grid");
let totalImagesCount = 0;

async function fetchImages() {
  const { API_KEY, NASA_URL } = CONSTANTS;
  const url = new URL(NASA_URL + "&api_key=" + API_KEY);

  fetch(url)
    .then((res) => res.json())
    .then((imagesDataJson) => renderGalleryCards(imagesDataJson));
}

function isImageVisible(image) {
  const { top, bottom } = image.getBoundingClientRect();
  const windowHeight = document.documentElement.clientHeight;

  const topVisible = top > 0 && top < windowHeight;
  const botVisible = bottom > 0 && bottom < windowHeight;
  if (topVisible || botVisible) {
    // console.log(top, bottom, windowHeight);
  }
  return topVisible || botVisible;
}

async function lazyLoadImages() {
  const { FAKE_DELAY_MS } = CONSTANTS;
  let imagesRemainToLazyLoad = false;
  for (let image of document.querySelectorAll(".gallery__card > img.lazy")) {
    imagesRemainToLazyLoad = true;
    // start loading the image!
    if (isImageVisible(image)) {
      image.classList.remove("lazy");
      setTimeout(() => {
        image.src = image.dataset.src;
        image.removeAttribute("data-src");
      }, FAKE_DELAY_MS);
    }
  }
  // performance optimzn. remove listener when all images have loaded.
  if (!imagesRemainToLazyLoad) {
    window.removeEventListener("scroll", lazyLoadImages);
  }
}

function renderGalleryCards({ photos }) {
  //   console.log(photos);
  // assumming imagesData is an array so we can use .forEach(() => {});
  const tempGalleryCardsContainer = document.createDocumentFragment();
  photos.forEach((photo) => {
    const card = renderCard(photo);
    tempGalleryCardsContainer.appendChild(card);
  });

  // Assumption - the images data is fetched only once.
  document.querySelector(".gallery__loader").remove();
  grid.appendChild(tempGalleryCardsContainer);
  lazyLoadImages(); // load images that are visible on page load.
}

function renderCard({ earth_date, img_src, id, rover, camera }) {
  const card = document.createElement("article");
  card.setAttribute("class", "gallery__card");

  const cardName = document.createElement("h5");
  cardName.textContent = `An image clicked with camera 
    ${camera.full_name} by the rover ${rover.name}`;

  const cardDate = document.createElement("p");
  cardDate.setAttribute("class", "gallery__card__date");
  cardDate.textContent = earth_date;

  // Making sure images are accessible!
  const cardImage = document.createElement("img");
  cardImage.setAttribute("data-src", img_src);
  cardImage.setAttribute("id", `img-${id}`);
  cardImage.setAttribute("class", "lazy");
  cardImage.setAttribute("src", "loading-buffering.gif");
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

  const likeButton = document.createElement("button");
  likeButton.setAttribute("class", "gallery__card__like-btn");
  likeButton.textContent = "Like"; // TODO: Change with icon and unlike

  const cardDataSection = document.createElement("section");
  cardDataSection.setAttribute("class", "gallery__card__data");

  cardDataSection.appendChild(cardName);
  cardDataSection.appendChild(cardDate);
  cardDataSection.appendChild(likeButton);
  card.appendChild(cardImage);
  card.appendChild(cardDataSection);
  return card;
}

function initializeApp() {
  // add event listeners.
  window.addEventListener("DOMContentLoaded", fetchImages);

  // TODO: can debounce w/ 0.2s
  window.addEventListener("scroll", lazyLoadImages);
}

initializeApp();

// Assumptions
// 1. Data fetched only once in bulk
// 2. Api succeeds with valid data i.e no graceful error handling for now.

// Extra features
// 1. Loading state when images data is being fetched from api- DONE.
// 2. Optimized Lazy loading of images. - DONE
// 3. Loading image state when an individual image is loading. - DONE

// 4. Animated like button
// 5. Like persistence using local storage



// TODO
// refactor some code
// improve UI
// host
