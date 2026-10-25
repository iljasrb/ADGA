# ADGA

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

## Adding a device

1. `content/<codename>/_index.md` with `title`, `description`, `sort_by = "weight"` and
   `[extra] device = true` — without it the section is not listed as a device and gets no sidebar.
2. `content/<codename>/<page>.md` per guide, `draft = true` until verified.

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

## Checks

`.github/workflows/check.yml` runs on every push and pull request:
`python3 test_contributors.py`, `node test_search.mjs`, `./build.sh --drafts` and
`zola check --drafts --skip-external-links`.

## License

Code and templates MIT (`LICENSE`). Guide content and images CC BY-SA 4.0 (`LICENSE-content`).
