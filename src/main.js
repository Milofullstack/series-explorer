//Guardamos la direccion de nuestra API een una constante
const API_URL = "https://api.tvmaze.com/shows";
let state = {
  shows: [],
  requestStatus: "idle",
  error: null,
  page: 1,
  totalPages: 0,
  search: "",
  selectedGenre: "all",
  showStatus: "all",
};

// Aquí conectaremos la petición a TVmaze, el estado y el renderizado.
async function fetchShows() {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
      throw new Error("Error conecting with the API");
    }

    const data = await response.json();
    state.requestStatus = "success";
    state.error = null;
    state.shows = data;
  } catch (error) {
    state.requestStatus = "error";
    state.error = error.message;
  }
}

function getUniqueGenres() {
  const shows = state.shows;
  const genres = shows.flatMap((show) => show.genres);
  const uniqueGenres = new Set(genres);
  return uniqueGenres;
}
function getUniqueStatus (){
  const shows = state.shows;
  const showStatus = shows.map(show => show.status);
  const uniqueStatus = new Set(showStatus);
  return uniqueStatus;
}

function renderGenres() {
  const container = document.getElementById("genre-selector");
  const uniqueGenres = getUniqueGenres();

  for (let genre of uniqueGenres) {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;

    container.append(option);
  }
}

function renderShows(shows) {
  const container = document.getElementById("shows-grid");
  container.innerHTML = "";
  let html = "";

  for (let show of shows) {
    html += `<div id='${show.id}'>
    <img src='${show.image?.medium}' alt='imagen de la serie'>
    <p>name : ${show.name}</p>
    <p>genero: ${show.genres.join(", ")}</p>
    <p>valoración: ${show.rating?.average}</p>
    <p>estado: ${show.status}</p>
    </div>
    `;
  }
  container.innerHTML = html;
}

function renderStatus() {
  const container = document.getElementById("status-message");
  container.innerHTML = "";

  if (state.requestStatus === "success") {
    container.innerHTML = "";
    return;
  }
  if (state.requestStatus === "error") {
    container.innerHTML = state.error;
    return;
  }
  if (state.requestStatus === "loading") {
    container.innerHTML = "Preparando el catálogo…";
    return;
  }
}

function renderShowStatus(){
  const container = document.getElementById("status-selector");
  const uniqueShowStatus = getUniqueStatus();

  for(let showStatus of uniqueShowStatus){
    const option = document.createElement("option");
    option.value = showStatus;
    option.textContent = showStatus;
    container.append(option);
  }
}

function addEvents() {
  const genreSelector = document.getElementById("genre-selector");
  const inputSearch = document.getElementById("search-input");
  const statusSelector = document.getElementById("status-selector");

  genreSelector.addEventListener("change", (e) => {
    state.selectedGenre = e.target.value;
    render();
  });
  inputSearch.addEventListener("input", (e) => {
    const search = e.target.value;
    state.search = search;
    render();
  });
  statusSelector.addEventListener("change", (e) => {
    state.showStatus = e.target.value
    render();
  });
}

function render() {
  const shows = filteredShows();
  renderShows(shows);
}

function filteredShows() {

  let shows = state.shows;

  if (state.search !== "") {
    shows = shows.filter((show) => {
      return show.name
        .toLowerCase()
        .includes(state.search.toLowerCase().trim());
    });
  }

  if (state.selectedGenre !== "all") {
    shows = shows.filter((show) => {
      return show.genres.includes(state.selectedGenre);
    });
  }

  if (state.showStatus !== "all") {
    shows = shows.filter((show) => {
      return show.status === state.showStatus;
    });
  }

  return shows;
}

async function main() {
  state.requestStatus = "loading";
  renderStatus();
  await fetchShows();
  renderStatus();
  if (state.requestStatus !== "success") {
    return;
  }
  renderGenres();
  renderShowStatus()
  addEvents();
  render();
}
main();
