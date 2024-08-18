const lockScroll = ["overflow-hidden"];

function desactivateUserSelect() {
  document.body.style.userSelect = "none";
  document.body.classList.add(...lockScroll);
}

function activateUserSelect() {
  document.body.style.userSelect = "auto";
  document.body.classList.remove(...lockScroll);
}

export {
  desactivateUserSelect,
  activateUserSelect
}