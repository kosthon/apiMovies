searchFormBtn.addEventListener('click', () => {
	const valueInput = searchFormInput.value.trim();
	location.hash = '#search=' + valueInput;
});
trendingBtn.addEventListener('click', () => {
	location.hash = '#trends';
});
arrowBtn.addEventListener('click', () => {
	history.back();
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
	console.log(location);
	if (location.hash.startsWith('#trends')) {
		trendsPage();
	} else if (location.hash.startsWith('#search=')) {
		searchPage();
	} else if (location.hash.startsWith('#movie=')) {
		moviesDetailsPage();
	} else if (location.hash.startsWith('#category=')) {
		categoriesPage();
	} else {
		homePage();
	}

	window.scrollTo(0, 0);
}

function homePage() {
	console.log('>>>HOME');

	headerSection.classList.remove('header-container--long');
	headerSection.style.background = '';
	arrowBtn.classList.add('inactive');
	headerCategoryTitle.classList.add('inactive');
	headerTitle.classList.remove('inactive');
	searchForm.classList.remove('inactive');
	trendingPreviewSection.classList.remove('inactive');
	categoriesPreviewSection.classList.remove('inactive');
	genericSection.classList.add('inactive');
	movieDetailSection.classList.add('inactive');

	getTrendingMoviesPreview();
	getCategoriesPreview();
}

function categoriesPage() {
	console.log('>>>CATEGORY');

	headerSection.classList.remove('header-container--long');
	headerSection.style.background = '';
	arrowBtn.classList.remove('inactive');
	arrowBtn.classList.remove('header-arrow--white');
	headerCategoryTitle.classList.remove('inactive');
	headerTitle.classList.add('inactive');
	searchForm.classList.add('inactive');
	trendingPreviewSection.classList.add('inactive');
	categoriesPreviewSection.classList.add('inactive');
	genericSection.classList.remove('inactive');
	movieDetailSection.classList.add('inactive');

	const [, categoryInfo] = location.hash.split('=');
	const [categoryId, categoryName] = categoryInfo.split('-');
	headerCategoryTitle.innerHTML = categoryName.replace('%20', ' ');
	getMoviesByCategory(categoryId);
}

function moviesDetailsPage() {
	console.log('>>>MOVIE');

	headerSection.classList.add('header-container--long');
	// headerSection.style.background = '';
	arrowBtn.classList.remove('inactive');
	arrowBtn.classList.add('header-arrow--white');
	headerCategoryTitle.classList.add('inactive');
	headerTitle.classList.add('inactive');
	searchForm.classList.add('inactive');
	trendingPreviewSection.classList.add('inactive');
	categoriesPreviewSection.classList.add('inactive');
	genericSection.classList.add('inactive');
	movieDetailSection.classList.remove('inactive');

	const [, movieId] = location.hash.split('=');
	getMovieById(movieId);
}

function searchPage() {
	console.log('>>>SEARCH');

	headerSection.classList.remove('header-container--long');
	headerSection.style.background = '';
	arrowBtn.classList.remove('inactive');
	arrowBtn.classList.remove('header-arrow--white');
	headerCategoryTitle.classList.add('inactive');
	headerTitle.classList.add('inactive');
	searchForm.classList.remove('inactive');
	trendingPreviewSection.classList.add('inactive');
	categoriesPreviewSection.classList.add('inactive');
	genericSection.classList.remove('inactive');
	movieDetailSection.classList.add('inactive');

	const [, query] = location.hash.split('=');
	getMoviesBySearch(query);
}

function trendsPage() {
	console.log('>>>TRENDS');

	headerSection.classList.remove('header-container--long');
	headerSection.style.background = '';
	arrowBtn.classList.remove('inactive');
	arrowBtn.classList.remove('header-arrow--white');
	headerCategoryTitle.classList.remove('inactive');
	headerTitle.classList.add('inactive');
	searchForm.classList.add('inactive');
	trendingPreviewSection.classList.add('inactive');
	categoriesPreviewSection.classList.add('inactive');
	genericSection.classList.remove('inactive');
	movieDetailSection.classList.add('inactive');

	headerCategoryTitle.innerHTML = 'Tendencias';
	getTrendingMovies();
}
