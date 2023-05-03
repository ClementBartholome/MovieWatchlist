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

function addMovieToWatchlist(movieId) {
  const savedMovies = JSON.parse(localStorage.getItem("movies")) || [];

  const movieAlreadyInWatchlist = savedMovies.some(
    (movie) => movie.imdbID === movieId
  );

  if (movieAlreadyInWatchlist) {
    removeMovie(movieId);
    return;
  }

  const movieToAdd = moviesArray.find((movie) => movie.imdbID === movieId);
  savedMovies.push(movieToAdd);
  localStorage.setItem("movies", JSON.stringify(savedMovies));

  const watchlistBtn = document.querySelector(`[data-id="${movieId}"]`);
  watchlistBtn.setAttribute("data-added", "true");
  watchlistBtn.innerHTML = `
  <img class="remove-icon" data-id="${movieId}" src="images/Remove.png">
  Remove
`;

  const removeIcon = watchlistBtn.querySelector(".remove-icon");
  removeIcon.classList.remove("hidden");
}

function removeMovie(movieId) {
  const savedMovies = JSON.parse(localStorage.getItem("movies")) || [];
  const updatedMovies = savedMovies.filter((movie) => movie.imdbID !== movieId);
  localStorage.setItem("movies", JSON.stringify(updatedMovies));

  const watchlistBtn = document.querySelector(`[data-id="${movieId}"]`);
  watchlistBtn.innerHTML = `
  <img class="plus-icon" data-id="${movieId}" src="images/plus-icon.png">
  Watchlist
`;
}

function toggleWatchlist(event) {
  const movieId = event.target.getAttribute("data-id");
  const added = event.target.getAttribute("data-added");

  if (added === "true") {
    removeMovie(movieId);
  } else {
    addMovieToWatchlist(movieId);
  }
}

function displayMovies() {
  fetch(
    `https://www.omdbapi.com/?apikey=ab1b683f&s=${inputEl.value}&type=movie`
  )
    .then((response) => response.json())
    .then((data) => {
      const searchResultArr = data.Search;
      if (!searchResultArr || searchResultArr.length === 0) {
        main.innerHTML = `<p class="error-msg">Unable to find what you’re looking for. Please try another search.</p>`;
        return;
      }
      for (let i = 0; i < searchResultArr.length; i += 1) {
        fetch(
          `https://www.omdbapi.com/?apikey=ab1b683f&i=${searchResultArr[i].imdbID}&type=movie`
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

            const movieId = searchResultArr[i].imdbID;
            const savedMovies =
              JSON.parse(localStorage.getItem("movies")) || [];
            const movieAlreadyInWatchlist = savedMovies.some(
              (movie) => movie.imdbID === movieId
            );

            let watchlistBtnHtml = `
              <img class="plus-icon" data-id="${movieId}" src="images/plus-icon.png">
              Watchlist
            `;

            if (movieAlreadyInWatchlist) {
              watchlistBtnHtml = `
                <img class="remove-icon" data-id="${movieId}" src="images/Remove.png">
                Remove
              `;
            }

            main.innerHTML += `
              <div class="movie" id="${movieId}">
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
                    <button class="add-watchlist" data-id="${movieId}" data-added="${movieAlreadyInWatchlist}" onClick="toggleWatchlist(event)">
                      ${watchlistBtnHtml}
                    </button>
                  </div>
                  <p>${movieInfo.Plot}</p>
                </div>
              </div>
            `;
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("error-message").innerHTML =
        "<p>An error occurred while searching for movies. Please try again later.</p>";
    });
}

/* Event listeners */

searchBtn.addEventListener("click", () => {
  main.innerHTML = "";
  displayMovies();
  inputEl.value = "";
});
