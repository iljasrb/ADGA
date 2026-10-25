# Contributing

ADGA (devices.flac.moe) is a record of what someone actually ran on real hardware.

## Written by hand

- **Guide text must be written by a human.** No AI-generated instructions.
- AI may be used for **research.** Whatever the research finds has to be re-read, tested, and written out by hand.
- A pull request that reads like generated text will be closed. This applies to `content/`, not to
  templates.

## Verified before published

- Information related to the device needs to be confirmed one.
- Set `verified_by` to the login that tested it and `verified_on` to the date. If you cannot
  test it, leave the page as `draft = true`; drafts are not built.
- Add a `## Sources` section with the links you actually used (XDA thread, LineageOS wiki, vendor
  documentation, your own log). Unsupported claims get removed.
- Note which firmware / ROM / build the page was verified against when it matters.
- Say which step wipes data, which one can brick, what the
  recovery path is.

## How to change a page

1. Fork, branch, edit `content/<device>/<page>.md`.
2. Run `./build.sh --drafts` and look at the result.
3. Open a pull request against `main`. Keep it to one guide or one device per pull request.
4. Pull requests can be **squash-merged**, so your commit keeps your authorship and your avatar shows
   up on the page.

Elements available in a page (images, captions, floated screenshots, two-up, keys) are shown in
`content/about/ui-preview.md` (live at `/about/ui-preview/`).

Content is rendered as a Tera template before Markdown, so a code sample containing `{{` or `{%`
has to be wrapped in `{% raw %}…{% endraw %}` or the build fails. Images go in `static/img/` and are
referenced with `{{<figure src="img/name.png" alt="what it shows"/>}}`; `alt` is required.

Bots and AI-agent pull requests are not accepted. If your commit email is not a GitHub noreply
address, add `email = login` to `contributors.map` in the same pull request so you get linked.
Attribution comes from git history; never add a contributor list to a page.

## License

By contributing you agree your text is published under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); code and templates under MIT.
