import { podcasts } from "./data.js";
import "./PodcastPreview.js";

/**
 * DOM elements
 * @type {HTMLElement}
 */
const podcastGrid = document.getElementById("podcastGrid");
const genreFilter = document.getElementById("genreFilter");
const sortBy = document.getElementById("sortBy");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("podcastModal");
const modalContent = document.getElementById("modalContent");

/**
 * Render a list of podcasts in the grid
 * @param {Array<Object>} list - Array of podcast objects
 */
function renderPodcasts(list) {
  podcastGrid.innerHTML = "";
  list.forEach(podcast => {
    const card = document.createElement("podcast-preview");
    card.data = podcast; // pass data via property
    podcastGrid.appendChild(card);
  });
}

// -----------------------------
// Initial render
// -----------------------------
renderPodcasts(podcasts);

// -----------------------------
// Genre filter
// -----------------------------
const allGenres = Array.from(new Set(podcasts.flatMap(p => p.genres)));
allGenres.forEach(genreId => {
  const option = document.createElement("option");
  option.value = genreId;
  option.textContent = `Genre ${genreId}`;
  genreFilter.appendChild(option);
});

genreFilter.addEventListener("change", () => {
  const value = parseInt(genreFilter.value);
  const filtered = value
    ? podcasts.filter(p => p.genres.includes(value))
    : podcasts;
  renderPodcasts(filtered);
});

// -----------------------------
// Search filter
// -----------------------------
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = podcasts.filter(p =>
    p.title.toLowerCase().includes(term)
  );
  renderPodcasts(filtered);
});

// -----------------------------
// Sort podcasts
// -----------------------------
sortBy.addEventListener("change", () => {
  const value = sortBy.value;
  const sorted = [...podcasts];
  if (value === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (value === "updated") sorted.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  renderPodcasts(sorted);
});

// -----------------------------
// Listen for podcast-select events from the Web Component
// -----------------------------
document.addEventListener("podcast-select", e => {
  const podcast = podcasts.find(p => p.id === e.detail.id);
  if (!podcast) return;

  modalContent.innerHTML = `
    <h2>${podcast.title}</h2>
    <img src="${podcast.image}" alt="${podcast.title}" style="width:100%; border-radius:8px;"/>
    <p><strong>Seasons:</strong> ${podcast.seasons}</p>
    <p><strong>Genres:</strong> ${podcast.genres.join(", ")}</p>
    <p><strong>Updated:</strong> ${new Date(podcast.updated).toLocaleDateString()}</p>
    <p>${podcast.description}</p>
    <button id="closeModalBtn">Close</button>
  `;
  modal.classList.remove("hidden");

  // Close modal button
  document.getElementById("closeModalBtn").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
});

// Close modal when clicking outside content
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});
