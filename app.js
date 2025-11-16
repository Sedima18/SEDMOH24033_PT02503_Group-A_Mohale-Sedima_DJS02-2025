/**
 * @file app.js
 * Main application logic for the Podcast Explorer.
 * Handles rendering podcasts, filtering, sorting, search, and modal display.
 */

import { podcasts, genres, seasons } from "./data.js";
import "./components/PodcastPreview.js";

// DOM elements
const podcastGrid = document.getElementById("podcastGrid");
const genreFilter = document.getElementById("genreFilter");
const sortBy = document.getElementById("sortBy");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("podcastModal");
const modalContent = document.getElementById("modalContent");

/**
 * Populate genre filter dynamically
 */
const allGenres = Array.from(new Set(genres.map(g => g.title)));
allGenres.forEach(genreTitle => {
  const option = document.createElement("option");
  option.value = genreTitle;
  option.textContent = genreTitle;
  genreFilter.appendChild(option);
});

/**
 * Render a list of podcasts into the grid
 * @param {Array} list - Array of podcast objects
 */
function renderPodcasts(list) {
  podcastGrid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("podcast-preview");
    card.setAttribute("id", p.id);
    card.setAttribute("title", p.title);
    card.setAttribute("image", p.image);
    card.setAttribute("genres", p.genres.join(",")); // pass raw genre IDs
    card.setAttribute("seasons", p.seasons);
    card.setAttribute("updated", p.updated);
    podcastGrid.appendChild(card);
  });
}

// Initial render
renderPodcasts(podcasts);

/**
 * Filter podcasts by selected genre
 */
genreFilter.addEventListener("change", () => {
  const value = genreFilter.value;
  let filtered = value
    ? podcasts.filter(p =>
        p.genres.some(id => {
          const genre = genres.find(g => g.id === id);
          return genre?.title === value;
        })
      )
    : podcasts;
  renderPodcasts(filtered);
});

/**
 * Search podcasts by title
 */
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  renderPodcasts(podcasts.filter(p => p.title.toLowerCase().includes(term)));
});

/**
 * Sort podcasts by title or updated date
 */
sortBy.addEventListener("change", () => {
  const value = sortBy.value;
  let sorted = [...podcasts];
  if (value === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (value === "updated") sorted.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  renderPodcasts(sorted);
});

/**
 * Open modal when a podcast is selected
 */
document.addEventListener("podcast-selected", e => {
  const podcast = podcasts.find(p => p.id === e.detail.id);
  if (!podcast) return;

  const podcastSeasons = seasons.find(s => s.id === podcast.id)?.seasonDetails || [];

  const genreNames = podcast.genres
    .map(id => genres.find(g => g.id === id)?.title)
    .filter(Boolean)
    .join(", ");

  modalContent.innerHTML = `
    <div class="modal-inner">
      <img src="${podcast.image}" alt="${podcast.title}" class="w-full mb-4 rounded-lg"/>
      <h2 class="text-2xl font-bold mb-2">${podcast.title}</h2>
      <p class="mb-2"><strong>Genres:</strong> ${genreNames}</p>
      <p class="mb-4">${podcast.description}</p>
      <p class="mb-2"><strong>Updated:</strong> ${new Date(podcast.updated).toLocaleDateString()}</p>
      <h3 class="text-xl font-semibold mt-4 mb-2">Seasons</h3>
      <ul>
        ${podcastSeasons
          .map(s => `<li>${s.title} - ${s.episodes} episodes</li>`)
          .join("")}
      </ul>
      <button id="closeModalBtn" class="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg">Close</button>
    </div>
  `;

  modal.classList.remove("hidden");

  document.getElementById("closeModalBtn").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
});

// Close modal on outside click
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});