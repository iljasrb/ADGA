// search.js – modern, lightweight client-side search for Zola
(() => {
  "use strict";

  // ---------- Configuration -----------------------------------------------
  const CONFIG = {
    indexURL: "/search_index.en.json",
    inputSelector: "#search",
    resultsContainerSelector: ".search-results__items",
    resultsWrapperSelector: ".search-results",
    debounceDelay: 200, // ms
    minQueryLength: 3, // require at least 3 characters
    teaserContext: 30,
  };

  // ---------- Utility helpers ---------------------------------------------
  const escapeHtml = (text) => {
    if (!text) return "";
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // ---------- Main Search class -------------------------------------------
  class Search {
    constructor(config) {
      this.config = config;
      this.indexData = [];

      // DOM refs
      this.input = document.querySelector(config.inputSelector);
      this.resultsContainer = document.querySelector(
        config.resultsContainerSelector,
      );
      this.resultsWrapper = document.querySelector(
        config.resultsWrapperSelector,
      );

      if (!this.input || !this.resultsContainer || !this.resultsWrapper) {
        console.warn("Search: required DOM elements not found.");
        return;
      }

      this.bindEvents();
      this.loadIndex();
    }

    // ---------- Load index ------------------------------------------------
    async loadIndex() {
      try {
        const response = await fetch(this.config.indexURL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.indexData = await response.json();

        // If there's an initial query (e.g., from URL param), run it
        if (this.input.value.trim() !== "") {
          this.performSearch(this.input.value);
        } else {
          this.hideResults();
        }
      } catch (err) {
        console.error("Search: failed to load index", err);
        this.renderError("Failed to load search index.");
      }
    }

    // ---------- Search logic (substring match) ----------------------------
    performSearch(rawQuery) {
      const query = rawQuery.trim();

      // Hide results if query is too short or empty
      if (query.length < this.config.minQueryLength) {
        this.hideResults();
        return;
      }

      if (!this.indexData.length) {
        this.renderError("Search index not loaded.");
        return;
      }

      const lowerQuery = query.toLowerCase();

      // Filter items where title OR body contains the query (case‑insensitive)
      const matches = this.indexData.filter((item) => {
        const titleMatch =
          item.title?.toLowerCase().includes(lowerQuery) ?? false;
        const bodyMatch =
          item.body?.toLowerCase().includes(lowerQuery) ?? false;
        return titleMatch || bodyMatch;
      });

      // Prioritise title matches
      matches.sort((a, b) => {
        const aTitle = a.title?.toLowerCase().includes(lowerQuery) ?? false;
        const bTitle = b.title?.toLowerCase().includes(lowerQuery) ?? false;
        return aTitle === bTitle ? 0 : aTitle ? -1 : 1;
      });

      this.renderResults(matches, query);
    }

    // ---------- Rendering ------------------------------------------------
    renderResults(items, query) {
      if (!items || items.length === 0) {
        this.resultsContainer.innerHTML =
          '<li class="search-results__item">No results found</li>';
        this.showResults();
        return;
      }

      const html = items.map((item) => this.formatItem(item, query)).join("");
      this.resultsContainer.innerHTML = html;
      this.showResults();
    }

    renderError(message) {
      this.resultsContainer.innerHTML = `<li class="search-results__item">${escapeHtml(message)}</li>`;
      this.showResults();
    }

    formatItem(item, query) {
      const highlightedTitle = this.highlightText(item.title, query);
      const teaser = this.makeTeaser(item.body, query);

      return `
        <li class="search-results__item">
          <a href="${escapeHtml(item.url)}">${highlightedTitle}</a>
          <div>${teaser}</div>
        </li>
      `;
    }

    highlightText(text, query) {
      if (!text || !query) return escapeHtml(text);
      const regex = new RegExp(escapeRegex(query), "gi");
      return escapeHtml(text).replace(
        regex,
        (match) => `<mark>${match}</mark>`,
      );
    }

    makeTeaser(body, query) {
      if (!body) return "";
      if (!query) return escapeHtml(body).slice(0, 150) + "…";

      const lowerBody = body.toLowerCase();
      const lowerQuery = query.toLowerCase();
      const index = lowerBody.indexOf(lowerQuery);

      if (index === -1) {
        return escapeHtml(body).slice(0, 150) + "…";
      }

      const ctx = this.config.teaserContext;
      const start = Math.max(0, index - ctx);
      const end = Math.min(body.length, index + query.length + ctx * 2);
      let snippet = body.slice(start, end);

      const parts = snippet.split(
        new RegExp(`(${escapeRegex(query)})`, "gi"),
      );
      return parts
        .map((part, index) =>
          index % 2 === 1
            ? `<mark>${escapeHtml(part)}</mark>`
            : escapeHtml(part),
        )
        .join("");
    }

    // ---------- UI helpers ------------------------------------------------
    showResults() {
      this.resultsWrapper.hidden = false;
      this.input.setAttribute("aria-expanded", "true");
    }

    hideResults() {
      this.resultsWrapper.hidden = true;
      this.input.setAttribute("aria-expanded", "false");
      this.resultsContainer.innerHTML = "";
    }

    // ---------- Event binding ---------------------------------------------
    bindEvents() {
      const container = this.input.closest(".search-container");
      const debouncedSearch = debounce(
        (e) => this.performSearch(e.target.value),
        this.config.debounceDelay,
      );

      this.input.addEventListener("input", debouncedSearch);

      this.input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.hideResults();
        } else if (e.key === "ArrowDown" && !this.resultsWrapper.hidden) {
          const firstResult = this.resultsContainer.querySelector("a");
          if (firstResult) {
            e.preventDefault();
            firstResult.focus();
          }
        }
      });

      this.resultsContainer.addEventListener("keydown", (e) => {
        const links = [...this.resultsContainer.querySelectorAll("a")];
        const index = links.indexOf(document.activeElement);

        if (e.key === "Escape") {
          e.preventDefault();
          this.hideResults();
          this.input.focus();
        } else if (e.key === "ArrowDown" && links[index + 1]) {
          e.preventDefault();
          links[index + 1].focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (index > 0) links[index - 1].focus();
          else this.input.focus();
        }
      });

      container?.addEventListener("focusout", () => {
        setTimeout(() => {
          if (!container.contains(document.activeElement)) this.hideResults();
        });
      });

      document.addEventListener("click", (e) => {
        if (container && !container.contains(e.target)) this.hideResults();
      });
    }
  }

  // ---------- Initialise when DOM is ready --------------------------------
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new Search(CONFIG));
  } else {
    new Search(CONFIG);
  }
})();
