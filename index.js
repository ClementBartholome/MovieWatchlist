/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable no-loop-func */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const inputEl = document.getElementById("input");
const searchBtn = document.getElementById("search-btn");
const main = document.getElementById("main");
const moviesArray = [];
const moviesWatchlist = [];

/*

function isMovieAlreadyInWatchlist(movieId) {
  // Get movie watchlist from local storage 
  // if there's no watchlist, initialize an empty arr
  const savedMovies = JSON.parse(localStorage.getItem("movies")) || [];
  // use some method to check if there's one item with the movieId passed in as a parameter
  // if yes, return true
  return savedMovies.some((movie) => movie.imdbID === movieId);
}

*/

function addMovieToWatchlist(movieID) {
  const savedMovies = JSON.parse(localStorage.getItem("movies")) || [];

  const movieAlreadyInWatchlist = savedMovies.some(
    (movie) => movie.imdbID === movieID
  );

  if (movieAlreadyInWatchlist) {
    alert("This movie is already in your watchlist!");
    return;
  }

  const movieToAdd = moviesArray.find((movie) => movie.imdbID === movieID);
  savedMovies.push(movieToAdd);
  localStorage.setItem("movies", JSON.stringify(savedMovies));

  const watchlistBtn = document.querySelector(`[data-id="${movieID}"]`);
  watchlistBtn.setAttribute("data-added", "true");
  const plusIcon = watchlistBtn.querySelector(".plus-icon");
  plusIcon.classList.add("hidden");
  const removeIcon = watchlistBtn.querySelector(".remove-icon");
  removeIcon.classList.remove("hidden");
}

function removeMovie(movieID) {
  const savedMovies = JSON.parse(localStorage.getItem("movies")) || [];

  const movieIndex = savedMovies.findIndex((movie) => movie.imdbID === movieID);

  if (movieIndex !== -1) {
    savedMovies.splice(movieIndex, 1);
    localStorage.setItem("movies", JSON.stringify(savedMovies));

    const watchlistBtn = document.querySelector(`[data-id="${movieID}"]`);
    watchlistBtn.setAttribute("data-added", "false");
    const plusIcon = watchlistBtn.querySelector(".plus-icon");
    plusIcon.classList.remove("hidden");
    const removeIcon = watchlistBtn.querySelector(".remove-icon");
    removeIcon.classList.add("hidden");
  }
}

function toggleWatchlist(event) {
  const movieID = event.target.getAttribute("data-id");
  const added = event.target.getAttribute("data-added");

  if (added === "true") {
    removeMovie(movieID);
  } else {
    addMovieToWatchlist(movieID);
  }
}

function displayMovies() {
  fetch(`http://www.omdbapi.com/?apikey=ab1b683f&s=${inputEl.value}`)
    .then((response) => response.json())
    .then((data) => {
      // store all results in an array
      const searchResultArr = data.Search;
      // check if there are results
      if (!searchResultArr || searchResultArr.length === 0) {
        // if not, create error message element
        main.innerHTML = `<p class="error-msg">Unable to find what you’re looking for. Please try another search.</p>`;
        return;
      }
      // loop to display all movie results
      for (let i = 0; i < searchResultArr.length; i += 1) {
        fetch(
          `http://www.omdbapi.com/?apikey=ab1b683f&i=${searchResultArr[i].imdbID}`
        )
          .then((response) => response.json())
          .then((data) => {
            const movieInfo = data;
            moviesArray.push({
              imdbID: searchResultArr[i].imdbID,
              Poster: searchResultArr[i].Poster,
              Title: movieInfo.Title,
              Value: movieInfo.Ratings[0].Value,
              Runtime: movieInfo.Runtime,
              Genre: movieInfo.Genre,
              Plot: movieInfo.Plot,
            });
            main.innerHTML += `<div class="movie" id="${searchResultArr[i].imdbID}">
        <img src="${searchResultArr[i].Poster}" alt="Movie Poster" />
        <div class="movie-description">
          <div class="movie-title">
            <h3>${movieInfo.Title}</h3>
            <img class="icon" src="images/star-icon.png" alt="#" />
            <span>${movieInfo.Ratings[0].Value}</span>
          </div>
          <div class="movie-details">
            <span>${movieInfo.Runtime}</span>
            <span>${movieInfo.Genre}</span>
            <button class="add-watchlist" data-id="${movieInfo.imdbID}" data-added="false" onClick="toggleWatchlist(event)">
              <img class="plus-icon" data-id="${movieInfo.imdbID}" src="images/plus-icon.png">
              <img class="remove-icon hidden" data-id="${movieInfo.imdbID}" src="images/Remove.png">
              Watchlist
            </button>
          </div>
          <p>
          ${movieInfo.Plot}
          </p>
        </div>
      </div>
        `;
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("error-message").innerHTML =
        "<p>An error occurred while fetching the data. Please try again later.</p>";
    });
}

/* Event listeners */

searchBtn.addEventListener("click", () => {
  main.innerHTML = "";
  displayMovies();
  inputEl.value = "";
});
