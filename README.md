# android-device-guide-archive

Source of <https://devices.flac.moe>. Zola site. Content CC BY-SA 4.0, code MIT.

```
content/            one folder per device, one file per guide
templates/          layout, indexes, guide page
static/             style.css, search
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

## Deploy

Cloudflare Pages: build command `./build.sh`, output directory `public`, domain
`devices.flac.moe`. No CI workflow; the preview deployment checks a pull request.

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
