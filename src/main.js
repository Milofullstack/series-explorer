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
    state.requestStatus = "loading";
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

function renderShows() {
  const shows = state.shows;
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

async function main() {
  await fetchShows();
  renderShows();
}
main();
