import galleryItems from './app.js';

const refs = {
  container: document.querySelector('.js-gallery'),
  list: document.querySelector('.js-gallery'),
  lightbox: document.querySelector('.js-lightbox'),
  modalCloseBtn: document.querySelector('[data-action="close-lightbox"]'),
  modalImgRef: document.querySelector('.lightbox__image'),
  backdrop: document.querySelector('.lightbox__overlay'),
};

let isModalOpen = false;

refs.list.innerHTML = createListItemMarkup(galleryItems);

function createListItemMarkup(items) {
  return items
    .map(
      ({ preview, original, description }) =>
        `
        <li class="gallery__item">
            <a class="gallery__link" href="${original}">
                <img class="gallery__image" loading="lazy" src='${preview}' data-source='${original}' alt="${description}">
            </a>
        </li>
            `,
    )
    .join('');
}

refs.container.addEventListener('click', event => {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  openModal(event.target.dataset.source);
});

refs.container.addEventListener('keydown', event => keydownModal(event));

refs.modalCloseBtn.addEventListener('click', closeModal);

refs.backdrop.addEventListener('click', event => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
});

function openModal(src) {
  refs.lightbox.classList.add('is-open');
  setModalImgSrc(src);
  isModalOpen = true;
}

function closeModal() {
  refs.lightbox.classList.remove('is-open');
  setModalImgSrc('');
  isModalOpen = false;
}

function setModalImgSrc(src) {
  refs.modalImgRef.src = src;
}

function keydownModal(event) {
  if (!isModalOpen) {
    return;
  }

  switch (event.code) {
    case 'Escape':
      closeModal();
      break;
    case 'ArrowRight':
      nextGallerySrc();
      break;
    case 'ArrowLeft':
      prevGallerySrc();
      break;
  }
}

function getCurrentGallerySrcIndex() {
  return galleryItems.findIndex(item => item.original === refs.modalImgRef.src);
}

function nextGallerySrc() {
  const nextIndex = getCurrentGallerySrcIndex() + 1;
  if (nextIndex < galleryItems.length)
    setModalImgSrc(galleryItems[nextIndex].original);
}

function prevGallerySrc() {
  const prevIndex = getCurrentGallerySrcIndex() - 1;
  if (prevIndex >= 0) setModalImgSrc(galleryItems[prevIndex].original);
}
