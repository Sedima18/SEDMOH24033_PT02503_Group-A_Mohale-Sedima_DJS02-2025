/**
 * @module PodcastPreview
 * A reusable Web Component that displays a podcast preview card.
 * Clicking the card opens a detailed modal view.
 */

import { genres, seasons } from "../data.js";

export class PodcastPreview extends HTMLElement {
  static get observedAttributes() {
    return ["id", "title", "image", "genres", "description", "updated"];
  }

  constructor() {
    super();
    /** @type {ShadowRoot} */
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  /**
   * Format ISO date string to readable format.
   * @param {string} dateStr 
   * @returns {string}
   */
  formatDate(dateStr) {
    if (!dateStr) return "Unknown";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /**
   * Render the podcast preview card.
   */
  render() {
    const title = this.getAttribute("title") || "Untitled Podcast";
    const image = this.getAttribute("image") || "";
    const genresAttr = this.getAttribute("genres") || "";
    const updated = this.formatDate(this.getAttribute("updated"));

    this.shadow.innerHTML = `
      <style>
        .card {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
        img {
          width: 100%;
          border-radius: 6px;
          margin-bottom: 10px;
        }
        h3 {
          font-size: 16px;
          margin: 6px 0;
        }
        p {
          font-size: 14px;
          margin: 4px 0;
          color: #333;
        }
      </style>
      <div class="card">
        <img src="${image}" alt="${title}">
        <h3>${title}</h3>
        <p><strong>Genres:</strong> ${genresAttr}</p>
        <p><strong>Updated:</strong> ${updated}</p>
      </div>
    `;

    this.shadow.querySelector(".card").onclick = () => this.openModal();
  }

  /**
   * Opens a modal with detailed podcast info.
   */
  openModal() {
    const podcastId = this.getAttribute("id");
    const description = this.getAttribute("description") || "";
    const title = this.getAttribute("title") || "";
    const image = this.getAttribute("image") || "";
    const updated = this.formatDate(this.getAttribute("updated"));
    const genresAttr = this.getAttribute("genres") || "";

    const seasonInfo = seasons.find(s => s.id === podcastId)?.seasonDetails || [];

    // Create modal element
    const modal = document.createElement("div");
    modal.id = "podcastModal";
    modal.style.position = "fixed";
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = 1000;

    modal.innerHTML = `
      <div style="max-width:600px;width:90%;background:#fff;padding:20px;border-radius:8px;position:relative;overflow-y:auto;max-height:90%;">
        <button id="closeModalBtn" style="position:absolute;top:10px;right:10px;padding:5px 10px;background:#e53e3e;color:white;border:none;border-radius:4px;cursor:pointer;">Close</button>
        <h2 style="margin-bottom:10px;">${title}</h2>
        <img src="${image}" alt="${title}" style="width:100%;border-radius:8px;margin-bottom:10px;">
        <p style="margin-bottom:6px;"><strong>Genres:</strong> ${genresAttr}</p>
        <p style="margin-bottom:6px;"><strong>Updated:</strong> ${updated}</p>
        <p style="margin-bottom:10px;">${description}</p>
        <h3>Seasons:</h3>
        <ul>
          ${seasonInfo.map(s => `<li>${s.title} - ${s.episodes} episodes</li>`).join("")}
        </ul>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal events
    modal.querySelector("#closeModalBtn").onclick = () => modal.remove();
    modal.onclick = e => {
      if (e.target === modal) modal.remove();
    };
  }
}

customElements.define("podcast-preview", PodcastPreview);
