const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86';
const API_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';

getMovies(API_URL);

async function getMovies(url) {
    const resp = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        }
    });
    const respData = await resp.json();
    
    showMovies(respData);
};

function showMovies(data) {
    let moviEl = document.querySelector('.movies');

    moviEl.innerHTML = "";


    data.films.forEach(item => {

        // По неизвестной причине, в данных, у некоторых фильмов, рейтинг указан в процентах. По этому приводим все к единому формату
        /%$/.test(item.rating) ? item.rating = parseInt(item.rating) / 10 : item.rating = item.rating;

       const moviItem = document.createElement('div');
       moviItem.classList.add('movies__card');
       moviItem.innerHTML = `
        <div class="movies__img">
            <img class="movies__img-item" src="${item.posterUrlPreview}" alt="${item.nameRu}">
        </div>
        <div class="movies__text">
            <h4 class="movies__card-name">${item.nameRu}</h4>
            <p class="movies__card-dcr">${item.genres.map(el => ` ${el.genre}`)}</p>
        </div>
        <div class="movies__card-rating movies__card-rating_${getClassColor(item.rating)}">${item.rating}</div>
       `;
       moviEl.appendChild(moviItem);
    });
};

function getClassColor(rating) {
    return rating >= 8 ? "green" : rating >= 5 ? "orange" : "red"
};

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
        getMovies(searchUrl);

        search.value = '';
    }
});

