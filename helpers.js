import CONSTANTS from "./constants.js";

// Private functions

// Function to check whether an image (technically its placeholder at that moment) is visible or not in the viewport.
function _isImageVisible(image) {
  const imageContainer = image.closest(".gallery__image__container");
  const { top, bottom } = imageContainer.getBoundingClientRect();
  const windowHeight = document.documentElement.clientHeight;

  const topVisible = top > 0 && top < windowHeight;
  const botVisible = bottom > 0 && bottom < windowHeight;

  return topVisible || botVisible;
}

// Exposed functions

// Function to decorate passed function with debounce effect.
function debounce(f, ms = 200) {
  let timer;

  return function newF() {
    clearTimeout(timer);
    timer = setTimeout(() => f.apply(this, f), ms);
  };
}

// Function to optimally lazy load images. This uses a fake delay for demo purposes.
async function lazyLoadImages() {
  const { FAKE_DELAY_250MS } = CONSTANTS;

  // uncomment below line to verify when an image starts loading upon scroll :)
  // console.log('loading images now');

  let imagesRemainToLazyLoad = false;
  for (let image of document.querySelectorAll(
    ".gallery__image__container > img.lazy"
  )) {
    imagesRemainToLazyLoad = true;
    // start loading the image!
    if (_isImageVisible(image)) {
      image.classList.remove("lazy");
      // reduce redirects to decrease network latency.
      const dataSrc = image.dataset.src.replaceAll("http", "https");
      image.src = dataSrc;
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

export { debounce, lazyLoadImages };
