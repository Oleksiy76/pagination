import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import PixabayAPI from './PixabayAPI';

const galleryLightBox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionDelay: 250,
});

const refs = {
  form: document.getElementById('search-form'),
  button: document.querySelector('button[type="submit"]'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const pixabayAPI = new PixabayAPI();

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', fetchHits);

refs.loadMoreBtn.classList.add('is-hidden');

function onSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const value = form.elements.searchQuery.value.trim();

  if (value === '') {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notiflix.Notify.warning('Please enter your search query!');
    return;
  } else {
    pixabayAPI.searchValue = value;
    pixabayAPI.resetPage();

    clearImages();

    pixabayAPI
      .getImages()
      .then(({ hits, totalHits }) => {
        console.log(hits);

        if (hits.length === 0) {
          refs.loadMoreBtn.classList.add('is-hidden');
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          createMarkupList(hits);
          galleryLightBox.refresh();
          refs.loadMoreBtn.classList.remove('is-hidden');
          Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        }
      })
      .finally(() => refs.form.reset());
  }
}

async function fetchHits() {
  const page = pixabayAPI.page;
  const perPage = pixabayAPI.per_page;

  try {
    const { hits, totalHits } = await pixabayAPI.getImages();

    createMarkupList(hits);
    galleryLightBox.refresh();

    if (page * perPage >= totalHits) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    onError(err);
  }
}

function createMarkupList(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
      <a class="photo-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="240" height="180"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <br> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> <br> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> <br> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> <br> ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}

function clearImages() {
  refs.galleryEl.innerHTML = '';
}

function onError(err) {
  console.error(err);
}
