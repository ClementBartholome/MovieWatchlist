/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
const mainWatchlist = document.getElementById("main-watchlist");
const removeBtn = document.getElementById("remove-btn");

function displayMovies() {
  mainWatchlist.innerHTML = "";
  // Get saved movies from local storage
  const savedMovies = JSON.parse(localStorage.getItem("movies"));

  // If no movie saved, invite user to add some movies
  if (savedMovies === null || savedMovies.length === 0) {
    mainWatchlist.innerHTML = `<div class="watchlist-placeholder">
      <p>Your watchlist is looking a little empty...</p>
      <a href="index.html">
        <img class="icon" src="images/plus-icon.png">
        <p>Let's add some movies!</p>
      </a>
    </div>`;
  }

  // If movies are saved, display each one's content
  if (savedMovies.length > 0) {
    for (let i = 0; i < savedMovies.length; i++) {
      mainWatchlist.innerHTML += `
        <div class="movie" id="$${savedMovies[i].imdbID}">
          <img src="${savedMovies[i].Poster}" alt="Movie Poster" />
          <div class="movie-description">
            <div class="movie-title">
              <h3>${savedMovies[i].Title}</h3>
              <img class="icon" src="images/star-icon.png" alt="#" />
              <span>${savedMovies[i].Value}</span>
            </div>
            <div class="movie-details">
              <span>${savedMovies[i].Runtime}</span>
              <span>${savedMovies[i].Genre}</span>
              <button class="remove-watchlist" data-id="${savedMovies[i].imdbID}" onClick="removeMovie(event)">
                <img class="remove-icon" data-id="${savedMovies[i].imdbID}" src="images/Remove.png">
                Remove
              </button>
            </div>
            <p>
              ${savedMovies[i].Plot}
            </p>
          </div>
        </div>
      `;
    }
  }
}

function removeMovie(event) {
  const savedMovies = JSON.parse(localStorage.getItem("movies"));
  const movieId = event.target.getAttribute("data-id");

  // Find movie index in savedMovies using imdb ID
  const index = savedMovies.findIndex((movie) => movie.imdbID === movieId);

  // Delete the movie in savedMovies
  savedMovies.splice(index, 1);

  // Update local storage
  localStorage.setItem("movies", JSON.stringify(savedMovies));

  // Update watchlist
  displayMovies();
}

displayMovies();
