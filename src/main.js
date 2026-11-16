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

function addEvents() {
  const container = document.getElementById("genre-selector");

  container.addEventListener("change", (e) => {
    state.selectedGenre = e.target.value;
    render();
  });
  
}

function render(){
  const filteredShows = filteredShowsByGenre()
  renderShows(filteredShows);
}

function filteredShowsByGenre() {
  let shows = state.shows;
  if (state.selectedGenre === "all") {
    return shows;
  }

  const filteredShows = shows.filter((show) => {
    return show.genres.includes(state.selectedGenre);
  });
  console.log(filteredShows)
  return filteredShows;
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
  addEvents();
  render()
}
main();
