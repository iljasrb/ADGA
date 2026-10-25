// no DOM, tested by test_search.mjs

/** title start, title, body; shorter titles first */
export function search(items, query, max = 12) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits = [];
  for (const item of items) {
    const title = (item.title || "").toLowerCase();
    const body = (item.body || "").toLowerCase();
    const titleAt = title.indexOf(q);
    const bodyAt = body.indexOf(q);
    if (titleAt < 0 && bodyAt < 0) continue;
    hits.push({ item, rank: titleAt === 0 ? 0 : titleAt > 0 ? 1 : 2, matchedBody: bodyAt >= 0 });
  }
  hits.sort(
    (a, b) =>
      a.rank - b.rank ||
      a.item.title.length - b.item.title.length ||
      a.item.title.localeCompare(b.item.title),
  );
  return hits.slice(0, max);
}

/** matched line with context, whitespace collapsed */
export function snippet(body, query, matchedBody, width = 80) {
  const text = (body || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  const q = query.trim().toLowerCase();
  const at = matchedBody ? text.toLowerCase().indexOf(q) : -1;
  if (at < 0) return text.length > width * 2 ? text.slice(0, width * 2) + "…" : text;
  let start = Math.max(0, at - width);
  let end = Math.min(text.length, at + q.length + width);
  // cut on spaces, never mid-word
  const firstSpace = text.indexOf(" ", start);
  if (start > 0 && firstSpace >= 0 && firstSpace < at) start = firstSpace + 1;
  const lastSpace = text.lastIndexOf(" ", end);
  if (end < text.length && lastSpace > at + q.length) end = lastSpace;
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}

/** index stores absolute URLs, links are relative to the serving host */
export function hrefOf(url, base) {
  const parsed = new URL(url, base);
  return parsed.pathname + parsed.search + parsed.hash;
}

export function deviceOf(url) {
  return decodeURIComponent(new URL(url).pathname.split("/").filter(Boolean)[0] || "");
}
