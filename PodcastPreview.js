class PodcastPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["title", "image", "genres", "seasons", "updated", "description"];
  }

  attributeChangedCallback() {
    this.render();
  }

  set data(podcast) {
    this.setAttribute("title", podcast.title);
    this.setAttribute("image", podcast.image);
    this.setAttribute("genres", podcast.genres?.join(", ") || "Unknown");
    this.setAttribute("seasons", podcast.seasons);
    this.setAttribute("updated", podcast.updated);
    this.setAttribute("description", podcast.description);
    this.setAttribute("id", podcast.id);
  }

  formatUpdated(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  render() {
    const title = this.getAttribute("title") || "";
    const image = this.getAttribute("image") || "";
    const genres = this.getAttribute("genres") || "";
    const seasons = this.getAttribute("seasons") || "";
    const updated = this.getAttribute("updated") || "";
    const description = this.getAttribute("description") || "";

    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; cursor:pointer; }
        .card {
          background:#1f2937; 
          border-radius:12px;
          overflow:hidden;
          color:white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow:0 6px 20px rgba(0,0,0,0.4);
        }
        img { width:100%; height:180px; object-fit:cover; }
        .info { padding:12px; }
        .title { font-weight:bold; font-size:1rem; margin-bottom:4px; }
        .description { font-size:0.85rem; opacity:0.8; margin-bottom:6px; }
        .meta { font-size:0.8rem; opacity:0.7; margin-bottom:6px; }
        .genres { display:flex; flex-wrap:wrap; gap:4px; }
        .genre-badge {
          background:#374151;
          padding:2px 8px;
          border-radius:9999px;
          font-size:0.7rem;
        }
      </style>
      <div class="card">
        <img src="${image}" alt="Cover for ${title}">
        <div class="info">
          <div class="title">${title}</div>
          <div class="description">${description}</div>
          <div class="meta">${seasons} season(s) • Updated ${this.formatUpdated(updated)}</div>
          <div class="genres">
            ${genres.split(",").map(g => `<span class="genre-badge">${g.trim()}</span>`).join("")}
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector(".card").onclick = () => {
      this.dispatchEvent(
        new CustomEvent("podcast-select", {
          detail: { id: this.getAttribute("id") },
          bubbles: true,
          composed: true,
        })
      );
    };
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("podcast-preview", PodcastPreview);