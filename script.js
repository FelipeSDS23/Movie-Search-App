const OMDB_API_KEY = 'ENTER YOUR API KEY - INSIRA SUA CHAVE DE API';
const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

movieSearchBox.addEventListener("keyup", findMovies);

movieSearchBox.addEventListener("click", findMovies);

async function loadMovies(searchTerm){
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=${OMDB_API_KEY}`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if(data.Response === "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove("hide-search-list");
        loadMovies(searchTerm);
    } else {
        searchList.classList.add("hide-search-list");
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement("div");
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add("search-list-item");
        if(movies[idx].Poster !== "N/A"){
            moviePoster = movies[idx].Poster;
        } else {
            moviePoster = "img/No_Image_Available.jpg";
        }
        movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}">
        </div>
        <div class="search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll(".search-list-item");
    searchListMovies.forEach(movie => {
        movie.addEventListener("click", async () => {
            searchList.classList.add("hide-search-list");
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fd11d2de`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster !== "N/A") ? details.Poster : "img/No_Image_Available.jpg"}" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors:</b> ${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

window.addEventListener("click", (event) => {
    if(event.target.className !== "form-control"){
        searchList.classList.add("hide-search-list");
    }
});
