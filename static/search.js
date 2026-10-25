// index is fetched on first open
import { deviceOf, hrefOf, search, snippet } from "./search-core.mjs";

const INDEX_URL = "/search_index.en.json";

const dialog = document.getElementById("search-dialog");
const input = document.getElementById("search-input");
const list = document.getElementById("search-results");
const status = document.getElementById("search-status");
const rowTemplate = document.getElementById("search-result");
const hint = document.getElementById("search-hint");
const trigger = document.getElementById("search-open");
const closeButton = document.getElementById("search-close");
const keyHint = document.getElementById("search-key");

if (dialog && input && list) {
  let index = null;
  let hits = [];
  let query = "";

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  if (keyHint) keyHint.textContent = isMac ? "⌘ K" : "Ctrl K";

  const load = () =>
    (index ??= fetch(INDEX_URL)
      .then((response) => (response.ok ? response.json() : []))
      .catch(() => []));

  // <mark> around matches; text nodes only, no innerHTML
  function markInto(node, text, q) {
    const lower = text.toLowerCase();
    let from = 0;
    for (;;) {
      const at = q ? lower.indexOf(q, from) : -1;
      if (at < 0) {
        node.append(text.slice(from));
        return;
      }
      if (at > from) node.append(text.slice(from, at));
      const mark = document.createElement("mark");
      mark.textContent = text.slice(at, at + q.length);
      node.append(mark);
      from = at + q.length;
    }
  }

  function empty(message) {
    const item = document.createElement("li");
    item.className = "search-empty";
    item.textContent = message;
    list.replaceChildren(item);
  }

  function render() {
    const q = query.trim().toLowerCase();
    if (!q) {
      list.replaceChildren();
      status.textContent = "";
      hint.textContent = "Type to search · ↑↓ move · ↵ open · esc close";
      return;
    }
    if (!index) {
      empty("Loading index…");
      return;
    }

    hits = search(index, q);
    list.replaceChildren();
    hint.textContent = `${hits.length} ${hits.length === 1 ? "result" : "results"} · ↑↓ move · ↵ open · esc close`;
    status.textContent = `${hits.length} results for ${query.trim()}`;

    if (!hits.length) {
      empty(`No guide matches “${query.trim()}”.`);
      return;
    }

    for (const hit of hits) {
      const row = rowTemplate.content.firstElementChild.cloneNode(true);
      const link = row.firstElementChild;
      const crumb = link.querySelector(".crumb");
      const title = link.querySelector(".title");
      const line = link.querySelector(".snippet");

      link.href = hrefOf(hit.item.url, location.href);

      const device = deviceOf(hit.item.url);
      if (device) crumb.textContent = device;
      else crumb.remove();

      markInto(title, hit.item.title, q);

      const body = snippet(hit.item.body, q, hit.matchedBody);
      if (body) markInto(line, body, q);
      else line.remove();

      link.addEventListener("click", () => dialog.close());
      list.append(row);
    }
  }

  function open(initial = "") {
    if (!dialog.open) dialog.showModal();
    input.value = initial;
    query = initial;
    hits = [];
    render();
    input.focus();
    input.select();
    load().then((items) => {
      index = items;
      if (query.trim()) render();
    });
  }

  trigger?.addEventListener("click", () => open());
  closeButton?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close(); // click on the backdrop
  });

  // drop ?q= on close so a reload does not reopen
  dialog.addEventListener("close", () => {
    const url = new URL(location.href);
    if (url.searchParams.has("q")) {
      url.searchParams.delete("q");
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  });

  input.addEventListener("input", () => {
    query = input.value;
    render();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" && hits.length) {
      event.preventDefault();
      list.querySelector("a")?.focus();
    } else if (event.key === "Enter" && hits.length) {
      event.preventDefault();
      list.querySelector("a").click();
    }
  });

  list.addEventListener("keydown", (event) => {
    const links = [...list.querySelectorAll("a")];
    const at = links.indexOf(document.activeElement);
    if (event.key === "ArrowDown" && links[at + 1]) {
      event.preventDefault();
      links[at + 1].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      (at > 0 ? links[at - 1] : input).focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    } else if (event.key === "/" && !typing && !dialog.open) {
      event.preventDefault();
      open();
    }
  });

  // ?q= opens the palette with a query
  const initial = new URLSearchParams(location.search).get("q");
  if (initial) open(initial);
}
