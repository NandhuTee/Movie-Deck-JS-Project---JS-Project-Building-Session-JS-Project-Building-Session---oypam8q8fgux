// https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=1
const movieList = document.getElementById("movies-list");
const APIKEY = "f531333d637d0c44abc85b3e74db2186";
let currentPage = 1,
  totalPages = 1,
  movies = [];

// step 3
function getFavMoviesFromLocalStorage() {
  const favMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
  return favMovies === null ? [] : favMovies;
}

function addMovieInfoInLocalStorage(mInfo) {
  const localStorageMovies = getFavMoviesFromLocalStorage();

  localStorage.setItem(
    "favouriteMovies",
    JSON.stringify([...localStorageMovies, mInfo])
  );
}

function removeFavMoviesFromLocalStorage(mInfo) {
  const localStorageMovies = getFavMoviesFromLocalStorage(); // []

  const filteredMovies = localStorageMovies.filter(
    (eMovie) => eMovie.title != mInfo.title
  );

  localStorage.setItem("favouriteMovies", JSON.stringify(filteredMovies));
}

// step 2
function renderMovies(movies = []) {
  movieList.innerHTML = "";

  const favMovies = getFavMoviesFromLocalStorage();

  const favMoviesMapping = favMovies.reduce((acc, curr) => {
    acc[curr.title] = true;
    return acc;
  }, {});

  // console.log(favMoviesMapping);

  movies.forEach((eMovie) => {
    const { poster_path, title, vote_average, vote_count } = eMovie;

    let listItem = document.createElement("li");
    listItem.className = "card";

    let imageUrl = poster_path
      ? `https://image.tmdb.org/t/p/original${poster_path}`
      : "";

    let mInfo = {
      title,
      vote_average,
      vote_count,
      poster_path,
    };

    const isFav = favMoviesMapping[title]; // true || undefined

    mInfo = JSON.stringify(mInfo);
    mInfo = mInfo.replaceAll("'", "");

    listItem.innerHTML = `<img class="poster" src=${imageUrl} alt=${title}/>
                        <p class="title">${title}</p>
                        <section class="vote-fav">
                            <section>
                            <p>Votes: ${vote_count}</p>
                            <p>Rating: ${vote_average}</p>
                            </section>
                            <i mInfo='${mInfo}' class="fa-regular fa-heart fa-2xl fav-icon ${isFav ? "fa-solid" : ""}"></i>
                        </section>`;

    const favIconBtn = listItem.querySelector(".fav-icon");

    // console.log(title, " : ", mInfo);

    favIconBtn.addEventListener("click", (event) => {
      let mInfo = JSON.parse(event.target.getAttribute("mInfo"));
      // console.log(mInfo);

      if (favIconBtn.classList.contains("fa-solid")) {
        // unmark it!
        // 1) remove the class to unmark the movie visually!
        favIconBtn.classList.remove("fa-solid");
        // 2) remove this movie info from the localstorage
        removeFavMoviesFromLocalStorage(mInfo);
      } else {
        // mark it!
        // 1) add the fa-solid class to the icon
        favIconBtn.classList.add("fa-solid");
        // 2) add the movie info in localstorage
        addMovieInfoInLocalStorage(mInfo);
      }
    });

    movieList.appendChild(listItem);
  });
}

// step 3
async function fetchMovies() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&page=${currentPage}`
    );

    let data = await response.json();
    movies = data.results;
    totalPages = data.total_pages;

    tPage.innerHTML = totalPages;
    if (totalPages > 1) nextBtn.disabled = false;
    else nextBtn.disabled = true;

    renderMovies(movies);
  } catch (error) {
    console.log(error);
  }
}

fetchMovies();

// step 4
function navigateToPrevious() {
  currentPage--;
  currPage.innerHTML = currentPage;

  console.log(currentPage, " : ", totalPages);

  if (searchInput.value.length > 0) {
    searchMovies();
  } else {
    // get the data and render on the ui
    fetchMovies();
  }

  if (currentPage == 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  if (currentPage >= totalPages) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

function navigateToNext() {
  currentPage++;
  currPage.innerHTML = currentPage;

  console.log(currentPage, " : ", totalPages);

  if (searchInput.value.length > 0) {
    searchMovies();
  } else {
    // get the data and render on the ui
    fetchMovies();
  }

  if (currentPage == 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  console.log(currentPage, " : ", totalPages);
  if (currentPage >= totalPages) {
    console.log("Disabled!");
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

const prevBtn = document.getElementById("prev-button");
const nextBtn = document.getElementById("next-button");
const currPage = document.getElementById("currPage");
const tPage = document.getElementById("totalPage");

prevBtn.addEventListener("click", navigateToPrevious);
nextBtn.addEventListener("click", navigateToNext);

prevBtn.disabled = true;


//step 5
async function searchMovies() {
    const searchText = searchInput.value;
  
    const url = `https://api.themoviedb.org/3/search/movie?query=${searchText}&api_key=${APIKEY}&language=en-US&page=${currentPage}`;
  
    const resp = await fetch(url);
    const data = await resp.json();
  
    movies = data.results;
    totalPages = data.total_pages;
    tPage.innerHTML = totalPages;
  
    renderMovies(movies);
  }
  
  const searchBtn = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  
  searchBtn.addEventListener("click", searchMovies);
  
  let sortByDateFlag = 0; // 0: ASC   // 1: DESC
  
  // step 6
  function sortByDate() {
    if (sortByDateFlag) {
      // desc
  
      movies.sort((m1, m2) => {
        return new Date(m2.release_date) - new Date(m1.release_date);
      });
  
      renderMovies(movies);
  
      sortByDateFlag = !sortByDateFlag;
  
      sortByDateBtn.innerText = "Sort by date (oldest to latest)";
    } else {
      // asc
  
      movies.sort((m1, m2) => {
        return new Date(m1.release_date) - new Date(m2.release_date);
      });
  
      renderMovies(movies);
  
      sortByDateFlag = !sortByDateFlag;
  
      sortByDateBtn.innerText = "Sort by date (latest to oldest)";
    }
  }
  
  let sortByRatingFlag = 0; // 0: ASC   // 1: DESC
  function sortByRating() {
    console.log(sortByRatingFlag);
    if (sortByRatingFlag) {
      // Desc
      movies.sort((m1, m2) => {
        return m2.vote_average - m1.vote_average;
      });
  
      console.log("Desc");
      console.log(movies);
  
      renderMovies(movies);
  
      sortByRatingFlag = !sortByRatingFlag;
  
      sortByRatingBtn.innerText = "Sort by rating (lowest to highest)";
    } else {
      // Asc
      movies.sort((m1, m2) => {
        return m1.vote_average - m2.vote_average;
      });
  
      console.log("Asc!");
      console.log(movies);
  
      renderMovies(movies);
  
      sortByRatingFlag = !sortByRatingFlag;
  
      sortByRatingBtn.innerText = "Sort by rating (Highest to lowest)";
    }
  }
  
  function onSearchChange(event) {
    let val = event.target.value;
  
    console.log(val);
  
    if (val) {
      searchMovies();
    } else {
      fetchMovies();
    }
  }
  
  let timer;
  function debounce(event) {
    clearTimeout(timer);
  
    timer = setTimeout(() => {
      onSearchChange(event);
    }, 2000);
  }
  
  searchInput.addEventListener("input", (event) => {
    debounce(event);
  });
  
  const sortByDateBtn = document.getElementById("sort-by-date");
  sortByDateBtn.addEventListener("click", sortByDate);
  
  const sortByRatingBtn = document.getElementById("sort-by-rating");
  sortByRatingBtn.addEventListener("click", sortByRating);

  function renderFavMovies() {
    movieList.innerHTML = "";
  
    // get all my fav movies from localstorage
    const favMovies = getFavMoviesFromLocalStorage();
  
    // render this movies on to the ui
  
    favMovies.map((eFavMovie) => {
      let listItem = document.createElement("li");
      listItem.className = "card";
  
      const { poster_path, title, vote_average, vote_count } = eFavMovie;
  
      const imageUrl = poster_path
        ? `https://image.tmdb.org/t/p/original${poster_path}`
        : "";
  
      let mInfo = {
        title,
        vote_count,
        vote_average,
        poster_path,
      };
  
      mInfo = JSON.stringify(mInfo);
  
      listItem.innerHTML = `<img
                                class="poster"
                                src=${imageUrl}
                                alt=${title}
                            />
                            <p class="title">${title}</p>
                            <section class="vote-fav">
                                <section>
                                <p>Votes: ${vote_count}</p>
                                <p>Rating: ${vote_average}</p>
                                </section>
                                <i mInfo='${mInfo}' class="fa-regular fa-heart fa-2xl fav-icon fa-solid"></i>
                            </section>`;
  
      const favIconBtn = listItem.querySelector(".fav-icon");
  
      favIconBtn.addEventListener("click", (event) => {
        let mInfo = JSON.parse(event.target.getAttribute("mInfo"));
        console.log(mInfo);
        // remove the movie from localstorage
        removeFavMoviesFromLocalStorage(mInfo);
  
        // remove the movie from the ui
        event.target.parentElement.parentElement.remove();
      });
  
      movieList.appendChild(listItem);
    });
  }
  
  function displayMovies() {
    if (allTabsBtn.classList.contains("active-tab")) {
      renderMovies(movies);
    } else {
      renderFavMovies();
    }
  }
  
  function switchTabs(event) {
    allTabsBtn.classList.remove("active-tab"); // active-tab
    favTabsBtn.classList.remove("active-tab");
  
    event.target.classList.add("active-tab");
  
    displayMovies();
  }
  
  const allTabsBtn = document.getElementById("all-tab");
  const favTabsBtn = document.getElementById("favorites-tab");
  
  allTabsBtn.addEventListener("click", switchTabs);
  favTabsBtn.addEventListener("click", switchTabs);