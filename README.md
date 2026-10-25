# android-device-guide-archive

Source of <https://devices.flac.moe> — per-device Android guides, written and verified by hand.

The site is [Zola](https://www.getzola.org/). Content is CC BY-SA 4.0, the templates and CSS are MIT.

## Layout

```
content/_index.md              device list (one card per folder in content/)
content/bronco/_index.md       device page: title, description, sort_by = "weight"
content/bronco/*.md            one page per guide
templates/                     layout, root index, device section, guide, partials
static/                        style.css, search.js, copy-code.js
contributors.py                writes data/contributors.json from git history
contributors.map               commit email -> GitHub login, for non-noreply emails
build.sh                       contributors + zola build (the Cloudflare Pages build command)
test_contributors.py           self-check for the attribution logic
```

## Local build

```sh
./build.sh --drafts        # drafts visible, output in public/
python3 contributors.py && zola serve --drafts
python3 test_contributors.py
node test_search.mjs
```

`data/contributors.json` is generated and git-ignored; the site cannot build without it, which is
why `build.sh` runs the script first.

## Deploy

Cloudflare Pages, connected to this repository:

| Setting | Value |
|---|---|
| Build command | `./build.sh` |
| Output directory | `public` |
| Custom domain | `devices.flac.moe` |

`build.sh` downloads Zola (v0.23.6 unless `ZOLA_VERSION` is set) when the build image has none,
and deepens a shallow clone because attribution needs the full history. Preview deployments and
build logs are the check for a pull request; there is no separate CI workflow.

## Search

`static/search.js` is the palette (open with the header button, `/`, or Ctrl/⌘ K; `?q=term` opens it
with a query). `static/search-core.mjs` holds ranking and snippets with no DOM, so it can be tested
with node. The index is Zola's `search_index.en.json`, fetched on first open, and result links are
rewritten to the current host — the palette works the same on localhost, a preview deployment, and
production.

## Adding a device

1. `content/<codename>/_index.md` with `title`, `description`, `sort_by = "weight"`.
2. One markdown file per guide with `title`, `description`, `weight`, and `draft = true` until the
   guide is verified.
3. That is all: the device appears on the front page, the guide appears in the device menu once it
   is out of draft. Flasher and repository links come from `[extra]` in `zola.toml`.

## Contributors

Every page and every device index lists the people with commits to it, newest first. It is
generated from `git log` at build time, so it cannot drift:

- logins come from `…@users.noreply.github.com` commit emails, else from `contributors.map`;
- `Co-authored-by:` trailers count;
- bots are skipped;
- emails that map to no login are credited by name with an initial, no profile link.

To credit a contributor who committed with a non-GitHub email, add one line to `contributors.map`.
Do not edit `data/contributors.json` and do not add contributor lists to pages.

## Writing a page

```toml
+++
title = "EDL flash"
description = "Flashing the ThinkPhone over Emergency Download mode."
weight = 3
updated = 2026-10-25
draft = true          # remove once hand-verified
[extra]
verified_by = "iljasrb"   # GitHub login of whoever tested it on hardware
verified_on = "2026-10-25"
risk = "This wipes the phone. Read the whole page first."
+++
```

`risk` shows up as a warning under the title. `verified_by` / `verified_on` produce the
"Hand-verified by …" line; a published page without them says it is not verified. `show_toc = false`
disables the table of contents. Downloads are links only — the site hosts no binaries.
