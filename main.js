const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86';
const API_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const API_URL_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

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
    const moviEl = document.querySelector('.movies');

    moviEl.innerHTML = "";


    data.films.forEach(item => {

        // По неизвестной причине, в данных, у некоторых фильмов, рейтинг указан в процентах. По этому приводим все к единому формату
        /%$/.test(item.rating) ? item.rating = parseInt(item.rating) / 10 : item.rating = item.rating;
       
        if (item.rating == "null") {
            item.rating = ""
        }

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

       moviItem.addEventListener('click', () => openModal(item.filmId))
       moviEl.appendChild(moviItem);
    });
};

function getClassColor(rating) {
    return rating >= 8 ? "green" : rating >= 5 ? "orange" : "red"
};

// Поиск

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


// Модальное окно

const modalItem = document.querySelector('.modal');

async function openModal(id) {
    console.log(id)
    const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        }
    });
    const respData = await resp.json();

    modalItem.classList.add('modal_show');
    document.body.classList.add('stop-scrolling');

    modalItem.innerHTML = `
            <div class="modal__card">
                <img class="modal__img" src="${respData.posterUrl}" alt="">
                <h2>
                    <span class="modal__title">${respData.nameRu}</span>
                    <span class="modal__release">- ${respData.year}г.</span>
                </h2>
                <ul class="modal__info">
                    <div class="loader"></div>
                    <li class="modal__info-genre">Жанр - ${respData.genres.map(el => `<span>${el.genre}</span>`)}</li>
                    ${respData.filmLength ? `<li class="modal__info-runtime">Время - ${respData.filmLength} минут</li>` : ""}
                    <li>Сайт: <a class="modal__info-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
                    <li class="modal__info-dscr">Опиисание - ${respData.description}</li>
                </ul>
                <button class="modal__btn-close" type="button">Зкрыть</button>
            </div>
    `;

    const btnClose = document.querySelector('.modal__btn-close');
    btnClose.addEventListener('click', () => closeModal());
};

function closeModal() {
    modalItem.classList.remove('modal_show');
    document.body.classList.remove('stop-scrolling');
}

window.addEventListener('click', (e) => {
    if (e.target === modalItem) {
        closeModal();
    };
});

window.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
        closeModal();
    };
});