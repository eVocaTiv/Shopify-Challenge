// Private functions.

function _createLikesArray({ photos }) {
  const likes = {};
  photos.forEach((photo) => {
    likes[photo.id] = false;
  });
  return likes;
}

// Exposed functions.

function updateLikesInLocalStorage(likes) {
  localStorage.setItem("likes", JSON.stringify(likes));
}

function restoreLikesFromLocalStorage(imagesDataJson) {
  const likesFromStorage = localStorage.getItem("likes");
  let likes = {};
  if (!likesFromStorage) likes = _createLikesArray(imagesDataJson);
  else likes = JSON.parse(localStorage.getItem("likes"));
  return likes;
}

export { updateLikesInLocalStorage, restoreLikesFromLocalStorage };
