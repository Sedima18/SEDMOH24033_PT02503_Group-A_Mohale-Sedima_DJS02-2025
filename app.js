/**
 * Application logic for Podcast Explorer.
 *
 * Handles:
 *  - Rendering podcast preview components
 *  - Dynamic genre filtering
 *  - Sorting and searching
 *  - Opening and closing the podcast modal
 *
 * @module app
 */

import { podcasts } from "./data.js";
import "./PodcastPreview.js";

// DOM elements
const podcastGrid = document.getElementById("podcastGrid");
const genreFilter = document.getElementById("genreFilter");
const sortBy = document.getElementById("sortBy");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("podcastModal");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModal");

/**
 * Extract all unique genres from the podcasts list and populate the genre filter dropdown.
 * @function populateGenres
 */
const allGenres = Array.from(new Set(podcasts.flatMap(p => p.genres)));
allGenres.forEach(genre => {
  const option = document.createElement("option");
  option.value = genre;
  option.textContent = genre;
  genreFilter.appendChild(option);
});

/**
 * Render a list of podcasts into the grid using the <podcast-preview> web component.
 *
 * @function renderPodcasts
 * @param {Array<Object>} list - An array of podcast objects to render.
 */
function renderPodcasts(list) {
  podcastGrid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("podcast-preview");
    card.data = p; // Passing data via property
    podcastGrid.appendChild(card);
  });
}

// Initial render
renderPodcasts(podcasts);

/* ---------------------------------------------------
   FILTERS, SEARCH & SORTING
---------------------------------------------------- */

/**
 * Filter podcasts by selected genre.
 * Triggered when the user changes the genre dropdown.
 *
 * @event change#genreFilter
 */
genreFilter.addEventListener("change", () => {
  const value = genreFilter.value;
  const filtered = value
    ? podcasts.filter(p => p.genres.includes(value))
    : podcasts;

  renderPodcasts(filtered);
});

/**
 * Live search podcasts by title.
 * Triggered on every input event.
 *
 * @event input#searchInput
 */
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();

  renderPodcasts(
    podcasts.filter(p => p.title.toLowerCase().includes(term))
  );
});

/**
 * Sort podcasts by title A–Z or by latest updated date.
 *
 * @event change#sortBy
 */
sortBy.addEventListener("change", () => {
  const value = sortBy.value;
  let sorted = [...podcasts];

  if (value === "title") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (value === "updated") {
    sorted.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  }

  renderPodcasts(sorted);
});

/* ---------------------------------------------------
   MODAL FUNCTIONALITY
---------------------------------------------------- */

/**
 * Listens for the custom "podcast-select" event dispatched
 * by the <podcast-preview> web component when clicked.
 *
 * Opens a modal with full podcast details.
 *
 * @event podcast-select
 * @param {CustomEvent} e - Custom event containing podcast ID.
 */
document.addEventListener("podcast-select", e => {
  const podcast = podcasts.find(p => p.id === e.detail.id);
  if (!podcast) return;

  modalContent.innerHTML = `
    <h2>${podcast.title}</h2>
    <img src="${podcast.image}" alt="${podcast.title}" />
    <p><strong>Seasons:</strong> ${podcast.seasons}</p>
    <p><strong>Genres:</strong> ${podcast.genres.join(", ")}</p>
    <p><strong>Updated:</strong> ${podcast.updated}</p>
    <p>${podcast.description}</p>

    <button id="closeModalBtn">Close</button>
  `;

  modal.classList.remove("hidden");

  // Close modal button inside modal
  document
    .getElementById("closeModalBtn")
    .addEventListener("click", () => modal.classList.add("hidden"));
});

/**
 * Close modal when clicking outside modal content.
 *
 * @event click#modal
 */
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});