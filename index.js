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

function addMovieToWatchlist(movieId) {
  // Retrieve saved movies from local storage, or create an empty array if none exist
  const savedMovies = JSON.parse(localStorage.getItem("movies")) || [];

  // Check if the movie is already in the watchlist
  const movieAlreadyInWatchlist = savedMovies.some(
    (movie) => movie.imdbID === movieId
  );

  // If the movie is already in the watchlist, remove it
  if (movieAlreadyInWatchlist) {
    removeMovie(movieId);
    return;
  }

  const movieToAdd = moviesArray.find((movie) => movie.imdbID === movieId);
  savedMovies.push(movieToAdd);
  localStorage.setItem("movies", JSON.stringify(savedMovies));

  // Update the watchlist button to indicate that the movie has been added
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
  // Filter the saved movies array to remove the movie with the specified ID
  const updatedMovies = savedMovies.filter((movie) => movie.imdbID !== movieId);
  localStorage.setItem("movies", JSON.stringify(updatedMovies));

  // Update the watchlist button to indicate that the movie has been removed
  const watchlistBtn = document.querySelector(`[data-id="${movieId}"]`);
  watchlistBtn.innerHTML = `
  <img class="plus-icon" data-id="${movieId}" src="images/plus-icon.png">
  Watchlist
`;
}

function toggleWatchlist(event) {
  const movieId = event.target.getAttribute("data-id");
  const added = event.target.getAttribute("data-added");

  // If the movie is already in the watchlist, remove it. Otherwise, add it to the watchlist.
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
      // If there are search results, loop through them and fetch more detailed movie information for each one
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
            // checks if the current movie is already in the user's watchlist
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

document.addEventListener("keypress", (event) => {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    main.innerHTML = "";
    displayMovies();
    inputEl.value = "";
  }
});
