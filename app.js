import { podcasts, genres, seasons } from "./data.js";
import "./PodcastPreview.js";

// DOM elements
const podcastGrid = document.getElementById("podcastGrid");
const genreFilter = document.getElementById("genreFilter");
const sortBy = document.getElementById("sortBy");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("podcastModal");
const modalContent = document.getElementById("modalContent");

/**
 * Get genre names from genre IDs
 * @param {number[]} genreIds
 * @returns {string[]}
 */
function getGenreNames(genreIds) {
  return genres
    .filter(g => genreIds.includes(g.id))
    .map(g => g.title);
}

/**
 * Get seasons info for a podcast
 * @param {string} podcastId
 * @returns {{title: string, episodes: number}[]}
 */
function getSeasons(podcastId) {
  const podcastSeasons = seasons.find(s => s.id === podcastId);
  return podcastSeasons ? podcastSeasons.seasonDetails : [];
}

/**
 * Render the list of podcasts in the grid
 * @param {Object[]} list - List of podcast objects
 */
function renderPodcasts(list) {
  podcastGrid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("podcast-preview");
    card.setAttribute("id", p.id);
    card.setAttribute("title", p.title);
    card.setAttribute("image", p.image);
    card.setAttribute("genres", getGenreNames(p.genres).join(", "));
    card.setAttribute("seasons", p.seasons);
    card.setAttribute("updated", p.updated);
    podcastGrid.appendChild(card);
  });
}

// Populate genre filter dynamically
const allGenres = Array.from(new Set(podcasts.flatMap(p => p.genres)));
allGenres.forEach(gid => {
  const genre = genres.find(g => g.id === gid);
  if (!genre) return;
  const option = document.createElement("option");
  option.value = genre.id;
  option.textContent = genre.title;
  genreFilter.appendChild(option);
});

// Initial render
renderPodcasts(podcasts);

// -----------------------------
// Filters & Search
// -----------------------------
genreFilter.addEventListener("change", () => {
  const value = parseInt(genreFilter.value);
  const filtered = value
    ? podcasts.filter(p => p.genres.includes(value))
    : podcasts;
  renderPodcasts(filtered);
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  renderPodcasts(
    podcasts.filter(p => p.title.toLowerCase().includes(term))
  );
});

sortBy.addEventListener("change", () => {
  const value = sortBy.value;
  let sorted = [...podcasts];
  if (value === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (value === "updated") sorted.sort((a, b) => new Date(b.updated) - new Date(a.updated));
  renderPodcasts(sorted);
});

// -----------------------------
// Modal functionality
// -----------------------------
document.addEventListener("podcast-selected", e => {
  const podcast = podcasts.find(p => p.id === e.detail.id);
  if (!podcast) return;

  const genreNames = getGenreNames(podcast.genres).join(", ");
  const seasonInfo = getSeasons(podcast.id)
    .map(s => `<li>${s.title} – ${s.episodes} episodes</li>`)
    .join("");

  modalContent.innerHTML = `
    <div class="modal-inner" style="background: #fff; padding: 20px; border-radius: 8px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; position: relative;">
      <button id="closeModalBtn" style="position:absolute; top:10px; right:10px; padding:5px 10px; cursor:pointer;">Close</button>
      <img src="${podcast.image}" alt="${podcast.title}" style="width:100%; border-radius:8px; margin-bottom:15px;">
      <h2>${podcast.title}</h2>
      <p>${podcast.description}</p>
      <p><strong>Genres:</strong> ${genreNames}</p>
      <p><strong>Updated:</strong> ${new Date(podcast.updated).toLocaleDateString()}</p>
      <h3>Seasons</h3>
      <ul>${seasonInfo}</ul>
    </div>
  `;
  modal.classList.remove("hidden");

  // Close modal
  document.getElementById("closeModalBtn").onclick = () => modal.classList.add("hidden");
});

// Close modal when clicking outside
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});
