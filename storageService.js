function toggleLike(e) {
  const btn = e.target;
  const { imgId } = btn.dataset;

  // update likes array
  // update localStorage

  updateLikeInLocalStorage(image);
}

function updateLikeInLocalStorage() {}

function restoreLikesFromLocalStorage() {}

export { toggleLike, updateLikeInLocalStorage, restoreLikesFromLocalStorage };
