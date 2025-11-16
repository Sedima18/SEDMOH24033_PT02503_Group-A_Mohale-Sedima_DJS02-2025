import { podcasts, genres } from "./data.js";
import "./PodcastPreview.js";

/**
 * DOM elements
 */
const podcastGrid = document.getElementById("podcastGrid");
const genreFilter = document.getElementById("genreFilter");
const sortBy = document.getElementById("sortBy");
const searchInput = document.getElementById("searchInput");

/**
 * Populate genre filter dynamically
 */
function populateGenres() {
  genres.forEach(g => {
    const option = document.createElement("option");
    option.value = g.id;
    option.textContent = g.title;
    genreFilter.appendChild(option);
  });
}

/**
 * Render podcasts as PodcastPreview components
 * @param {Array} list 
 */
function renderPodcasts(list) {
  podcastGrid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("podcast-preview");
    card.setAttribute("id", p.id);
    card.setAttribute("title", p.title);
    card.setAttribute("image", p.image);
    card.setAttribute("description", p.description);
    card.setAttribute("updated", p.updated);
    card.setAttribute("genres", p.genres.map(gId => {
      const g = genres.find(gen => gen.id === gId);
      return g ? g.title : "Unknown";
    }).join(", "));
    podcastGrid.appendChild(card);
  });
}

/**
 * Initialize event listeners for search, filter, sort
 */
function initEvents() {
  genreFilter.addEventListener("change", () => {
    const value = parseInt(genreFilter.value);
    const filtered = value ? podcasts.filter(p => p.genres.includes(value)) : podcasts;
    renderPodcasts(filtered);
  });

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    renderPodcasts(podcasts.filter(p => p.title.toLowerCase().includes(term)));
  });

  sortBy.addEventListener("change", () => {
    const value = sortBy.value;
    const sorted = [...podcasts];
    if (value === "title") sorted.sort((a,b) => a.title.localeCompare(b.title));
    if (value === "updated") sorted.sort((a,b) => new Date(b.updated)-new Date(a.updated));
    renderPodcasts(sorted);
  });
}

// ------------------------
// Initialize app
// ------------------------
populateGenres();
renderPodcasts(podcasts);
initEvents()
