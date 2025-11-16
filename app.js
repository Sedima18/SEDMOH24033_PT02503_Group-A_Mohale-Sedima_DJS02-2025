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

// -----------------------------
// Populate genre filter dynamically
// -----------------------------
const allGenres = Array.from(
  new Set(podcasts.flatMap(p => p.genres))
);
allGenres.forEach(genre => {
  const option = document.createElement("option");
  option.value = genre;
  option.textContent = genre;
  genreFilter.appendChild(option);
});

// -----------------------------
// Render podcasts
// -----------------------------
function renderPodcasts(list) {
  podcastGrid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("podcast-preview");
    card.data = p;
    podcastGrid.appendChild(card);
  });
}

// Initial render
renderPodcasts(podcasts);

// -----------------------------
// Filters & Search
// -----------------------------
genreFilter.addEventListener("change", () => {
  const value = genreFilter.value;
  let filtered = value ? podcasts.filter(p => p.genres.includes(value)) : podcasts;
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
document.addEventListener("podcast-select", e => {
  const podcast = podcasts.find(p => p.id === e.detail.id);
  if (!podcast) return;

  modalContent.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">${podcast.title}</h2>
    <img src="${podcast.image}" alt="${podcast.title}" class="mb-4 w-full rounded-lg"/>
    <p class="mb-2"><strong>Seasons:</strong> ${podcast.seasons}</p>
    <p class="mb-2"><strong>Genres:</strong> ${podcast.genres.join(", ")}</p>
    <p class="mb-2"><strong>Updated:</strong> ${podcast.updated}</p>
    <p class="mt-4">${podcast.description}</p>
    <button id="closeModalBtn" class="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg">Close</button>
  `;
  modal.classList.remove("hidden");

  // Close modal button
  document.getElementById("closeModalBtn").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
});

// Close modal on outside click
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});
