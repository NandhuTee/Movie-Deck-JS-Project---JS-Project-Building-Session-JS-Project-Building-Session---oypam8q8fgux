const apiKey = 'f531333d637d0c44abc85b3e74db2186';
const apiUrl = 'https://api.themoviedb.org/3/movie/top_rated';

let currentPage = 1;
let totalPages = 3;
let currentTab = 'all';

document.addEventListener('DOMContentLoaded', fetchMovies);

function fetchMovies() {
  // Use fetch to get data from the API
  //Append the fetched data to the movieList
  // Call renderMovies function to display the movies
}

function renderMovies(movies) {
  // Clear previous movies
  //Loop through the movies and create HTML elements for each movie
  // Append the movie cards to the movieList
}

function searchMovies() {
  // Implement search functionality
  //Use fetch to get data based on the search input
  // Render the searched movies
}

function sortMoviesByDate(){
  //Implement sorting functionality by date
  // Update the movieList and call renderMovies function
}

function sortMoviesByRating(){
  // Implement sorting functionality by rating
  //Update the movieList and call renderMovies function
}

function showAllMovies() {
  //Implement showing all movies
  // Update the currentTab variable, fetch movies, and render them
}
function showFavoriteMovies() {
  // Implement showing favorite movies
  // Update the currentTab variable, fetch movies, and render them
}

function previousPage(){
  // Implement previous page functionality
  // Update the currentPage variable, fetch movies, and render them
}

function nextPage() {
  // Implement next page functionality
  //Update the currentPage variable, fetch movies, and render them
}

