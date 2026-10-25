# android-device-guide-archive

Source of <https://devices.flac.moe>. Zola site. Content CC BY-SA 4.0, code MIT.

```
content/            one folder per device, one file per guide
templates/          layout, indexes, guide page, components
static/             style.css, search, img
contributors.py     writes data/contributors.json from git history
build.sh            contributors + zola build
```

## Run

```sh
./build.sh --drafts                  # build into public/
python3 contributors.py && zola serve --drafts
python3 test_contributors.py
node test_search.mjs
```

## Hosting

Cloudflare Pages, two projects from this repository, both with build command `./build.sh` and output
directory `public`:

| Project | URL | Environment |
|---|---|---|
| `devices` | `https://devices.flac.moe` (custom domain) | — |
| `devices-mirror` | `https://devices-mirror.pages.dev` | `BASE_URL=https://devices-mirror.pages.dev` |

Both deploy on every push, so the mirror is a working copy: its own links, search index and feed.
`<link rel="canonical">` always points at `devices.flac.moe` (`[extra] canonical_url` in `zola.toml`),
so only the primary gets indexed. No CI workflow; preview deployments check a pull request.

## Adding a device

1. `content/<codename>/_index.md` with `title`, `description`, `sort_by = "weight"`.
2. `content/<codename>/<page>.md` per guide, `draft = true` until verified.

Flasher and repository links are `[extra]` in `zola.toml`.

## Page frontmatter

```toml
+++
title = "EDL flash"
description = "Flashing the ThinkPhone over Emergency Download mode."
weight = 3
updated = 2026-10-25
draft = true
[extra]
verified_by = "iljasrb"
verified_on = "2026-10-25"
risk = "This wipes the phone."
+++
```

`draft` pages are not built. `verified_by` / `verified_on` render the verified line, `risk` renders
a warning box, `show_toc = false` hides the contents list.

## Contributors

Generated from `git log`, per page and per device. Logins come from GitHub noreply emails or
`contributors.map` (`email = login`); `Co-authored-by:` trailers count; bots are skipped; unknown
emails get a name and initial without a link. Do not edit `data/contributors.json`.
