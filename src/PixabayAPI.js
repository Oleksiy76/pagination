import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '36562958-7e80c6ba0d10c58cc9a50a36e';

export default class PixabayAPI {
  constructor() {
    this.page = 1;
    this.searchValue = '';
    this.per_page = 40;
  }

  async getImages() {
    const params = new URLSearchParams({
      key: API_KEY,
      q: this.searchValue,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });

    const { data } = await axios.get(`${BASE_URL}?${params}`);
    this.incrementPage();
    return data;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}

//  `${BASE_URL}?key=${API_KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
