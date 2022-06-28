// Utils
const callback = entries => {
	entries.forEach(element => {
		if (element.isIntersecting) {
			element.target.setAttribute('src', element.target.dataset.img);
		}
	});
};

let observer = new IntersectionObserver(callback);

// Used API
const api = axios.create({
	baseURL: 'https://api.themoviedb.org/3/',
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
	params: {
		api_key: API_KEY,
	},
});

function likedMoviesList() {
	const item = JSON.parse(localStorage.getItem('liked_movies'));
	let movies;
	if (item) {
		movies = item;
	} else {
		movies = {};
	}
	return movies;
}

function likeMovie(movie) {
	const likedMovies = likedMoviesList();
	console.log('likedMOvies', likedMovies);
	if (likedMovies[movie.id]) {
		likedMovies[movie.id] = undefined;
	} else {
		likedMovies[movie.id] = movie;
	}
	localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
	getTrendingMoviesPreview();
	getLikedMovies();
}

function printMovies(section, movies, {lazyLoad = false, clean = true} = {}) {
	if (clean) {
		section.innerHTML = '';
	}

	movies.forEach(movie => {
		const movieContainer = document.createElement('div');
		movieContainer.classList.add('movie-container');

		const movieImg = document.createElement('img');
		movieImg.classList.add('movie-img');
		movieImg.setAttribute('alt', movie.title);
		movieImg.setAttribute(
			lazyLoad ? 'data-img' : 'src',
			'https://image.tmdb.org/t/p/w300' + movie.poster_path
		);
		movieImg.addEventListener('click', () => {
			location.hash = '#movie=' + movie.id;
		});
		movieImg.addEventListener('error', () => {
			movieImg.setAttribute(
				'src',
				`https://via.placeholder.com/280x370/5c218a/ffffff?text=${movieImg.getAttribute('alt')}`
			);
			const movieTitle = document.createElement('span');
			movieTitle.classList.add('movieTitle');
			movieTitle.textContent = movieImg.getAttribute('alt');
			movieContainer.appendChild(movieTitle);
		});

		const movieBtn = document.createElement('button');
		movieBtn.classList.add('movieLiked-btn');
		movieBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
		likedMoviesList()[movie.id] && movieBtn.classList.add('movieLiked-btn--on');
		movieBtn.addEventListener('click', () => {
			movieBtn.classList.toggle('movieLiked-btn--on');
			//Agregar pelicula a localStorage
			likeMovie(movie);
		});

		if (lazyLoad) {
			observer.observe(movieImg);
		}

		movieContainer.appendChild(movieImg);
		movieContainer.appendChild(movieBtn);
		section.appendChild(movieContainer);
	});
}

function printCategories(section, categories) {
	section.innerHTML = '';

	categories.forEach(category => {
		const categoryContainer = document.createElement('div');
		categoryContainer.classList.add('category-container');
		const categoryTitle = document.createElement('h3');
		categoryTitle.classList.add('category-title');
		categoryTitle.setAttribute('id', 'id' + category.id);

		categoryTitle.addEventListener('click', () => {
			location.hash = '#category=' + category.id + '-' + category.name;
		});

		const categoryTitleText = document.createTextNode(category.name);

		categoryTitle.appendChild(categoryTitleText);
		categoryContainer.appendChild(categoryTitle);
		section.appendChild(categoryContainer);
	});
}

async function getTrendingMoviesPreview() {
	const {data} = await api('trending/movie/day');
	const movies = data.results;

	printMovies(trendingMoviesPreviewList, movies, {lazyLoading: true, clean: true});
}

async function getCategoriesPreview() {
	const {data} = await api('genre/movie/list');
	const categories = data.genres;

	printCategories(categoriesPreviewList, categories, true);
}

async function getMoviesByCategory(id) {
	const {data} = await api('discover/movie', {
		params: {
			with_genres: id,
		},
	});
	const movies = data.results;

	printMovies(genericSection, movies, {lazyLoading: true, clean: true});
}

async function getMoviesBySearch(query) {
	const {data} = await api('search/movie', {
		params: {
			query,
		},
	});
	const movies = data.results;

	printMovies(genericSection, movies);
}

async function getTrendingMovies() {
	const {data} = await api('trending/movie/day');
	const movies = data.results;

	printMovies(genericSection, movies, {lazyLoading: true, clean: true});
}

async function getMovieById(id) {
	const {data: movie} = await api('movie/' + id);

	const movieImgUrl = 'https://image.tmdb.org/t/p/original' + movie.poster_path;
	headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl})`;

	movieDetailTitle.textContent = movie.title;
	movieDetailDescription.textContent = movie.overview;
	movieDetailScore.textContent = movie.vote_average;

	printCategories(movieDetailCategoriesList, movie.genres);

	getReleatedMoviesByID(id);
}

async function getReleatedMoviesByID(id) {
	const {data} = await api('movie/' + id + '/recommendations');
	const relatedMovies = data.results;

	printMovies(relatedMoviesContainer, relatedMovies);
	relatedMoviesContainer.scrollTo(0, 0);
}

async function getPaginetedMovies(endpoint, {categoryId, query} = {}) {
	const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
	const isScrollBottom = scrollTop + clientHeight >= scrollHeight - 20;

	if (isScrollBottom) {
		pages++;
		const {data} = await api(endpoint, {
			params: {
				with_genres: categoryId,
				page: pages,
				query,
			},
		});
		const movies = data.results;
		printMovies(genericSection, movies, {lazyLoading: true, clean: false});
	}
}

function getLikedMovies() {
	const likedMovies = likedMoviesList();
	const moviesArray = Object.values(likedMovies);

	printMovies(likedMoviesContainer, moviesArray, {lazyLoad: true, clean: true});

	console.log(likedMovies);
}
