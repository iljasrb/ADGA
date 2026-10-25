+++
title = "UI preview"
description = "Every element a guide can use, with the markup that produces it."
weight = 1
updated = 2026-10-25
[extra]
verified_by = "iljasrb"
verified_on = "2026-10-25"
risk = "This is the page-level risk box, set from frontmatter. It sits above the content."
show_toc = true
+++

Each section below shows the rendered element and the source that produces it.

## Frontmatter

The title, description, verified line and risk box above all come from the frontmatter:

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
risk = "This wipes the phone. Read the whole page first."
+++
```

`draft = true` keeps the page out of the built site. `show_toc = false` hides the contents box.

## Text

Inline `code`, **bold**, *italic*, [a link](https://lineageos.org/), and a footnote[^1].

```markdown
Inline `code`, **bold**, *italic*, [a link](https://lineageos.org/), and a footnote[^1].
```

### Headings

Third and fourth level headings break up a long guide.

````markdown
### Third level

#### Fourth level
````

## Lists

- Unordered item
- Item with a nested list
    - Nested item
    - Another nested item
- Last item

1. Ordered step
2. Second step
    1. Sub-step
    2. Sub-step
3. Third step

````markdown
- Unordered item
- Item with a nested list
    - Nested item
    - Another nested item
- Last item

1. Ordered step
2. Second step
    1. Sub-step
    2. Sub-step
3. Third step
````

## Code

Command blocks get a copy button and scroll sideways instead of wrapping.

```sh
fastboot getvar current-slot
fastboot flash boot_a boot.img
```

Use four backticks around a block that itself contains a fenced block:

````markdown
```sh
fastboot getvar current-slot
fastboot flash boot_a boot.img
```
````

## Table

| Partition | Image | Slot |
| --- | --- | --- |
| `boot` | `boot.img` | yes |
| `dtbo` | `dtbo.img` | yes |
| `recovery` | `recovery.img` | no |

```markdown
| Partition | Image | Slot |
| --- | --- | --- |
| `boot` | `boot.img` | yes |
| `dtbo` | `dtbo.img` | yes |
| `recovery` | `recovery.img` | no |
```

## Callouts

> [!NOTE]
> Neutral information, safe to skip.

> [!TIP]
> Something that saves time.

> [!IMPORTANT]
> Something the reader must not miss.

> [!WARNING]
> Something that can cost data.

> [!CAUTION]
> Something that can end in a brick.

```markdown
> [!NOTE]
> Neutral information, safe to skip.

> [!TIP]
> Something that saves time.

> [!IMPORTANT]
> Something the reader must not miss.

> [!WARNING]
> Something that can cost data.

> [!CAUTION]
> Something that can end in a brick.
```

## Collapsible

<details>
<summary>Long command output</summary>

```text
Sending 'boot_a' (98304 KB)   OKAY [  2.417s]
Writing 'boot_a'              OKAY [  0.312s]
Finished. Total time: 2.729s
```

</details>

````markdown
<details>
<summary>Long command output</summary>

```text
Sending 'boot_a' (98304 KB)   OKAY [  2.417s]
Writing 'boot_a'              OKAY [  0.312s]
Finished. Total time: 2.729s
```

</details>
````

## Images

A bare Markdown image is centred:

![fastboot output](/img/example-wide.svg)

```markdown
![fastboot output](/img/example-wide.svg)
```

A figure takes a caption and an explicit size. Width and height stop the page from jumping while the
image loads:

{{<figure src="img/example-wide.svg" alt="fastboot devices output listing one device" caption="One device, slot a." width="520" height="292"/>}}

{% raw %}
```markdown
{{<figure src="img/example-wide.svg" alt="fastboot devices output listing one device" caption="One device, slot a." width="520" height="292"/>}}
```
{% endraw %}

`align="right"` puts the figure beside the text, `align="left"` on the other side. The text wraps
around it, and both sides become a normal centred block on narrow screens.

{{<figure src="img/example-tall.svg" alt="Recovery menu with apply update, factory reset and reboot" caption="Recovery menu." align="right" width="220" height="440"/>}}

This paragraph sits next to the floated figure so the wrap is visible. Everything block level below
it, headings included, clears the float, so a tall screenshot cannot squeeze the rest of the page.

{% raw %}
```markdown
{{<figure src="img/example-tall.svg" alt="Recovery menu with apply update, factory reset and reboot" caption="Recovery menu." align="right" width="220" height="440"/>}}

Text that should wrap beside the image.
```
{% endraw %}

Two images side by side, one column on mobile:

{% <cols> %}
{{<figure src="img/example-wide.svg" alt="Before flashing" caption="Before"/>}}
{{<figure src="img/example-wide.svg" alt="After flashing" caption="After"/>}}
{% </cols> %}

{% raw %}
```markdown
{% <cols> %}
{{<figure src="img/example-wide.svg" alt="Before flashing" caption="Before"/>}}
{{<figure src="img/example-wide.svg" alt="After flashing" caption="After"/>}}
{% </cols> %}
```
{% endraw %}

`src` is relative to `static/`, so `img/example-wide.svg` is `static/img/example-wide.svg`. `alt` is
`src` is relative to `static/`, so `img/example-wide.svg` is `static/img/example-wide.svg`. `alt` is
required; leaving it out fails the build. Use `{% raw %}{% <cols count="3"> %}{% endraw %}` for three.

## Keys and highlighting

Hold <kbd>Power</kbd> and <kbd>Volume Down</kbd> for ten seconds, then release. Inline text can be
<mark>highlighted</mark>.

```markdown
Hold <kbd>Power</kbd> and <kbd>Volume Down</kbd> for ten seconds, then release.
Inline text can be <mark>highlighted</mark>.
```

## Rules and footnotes

---

A footnote definition goes at the bottom of the page.

```markdown
---

A footnote definition goes at the bottom of the page.

[^1]: The footnote text.
```

## Raw blocks

Content is rendered as a template before Markdown, so a code sample containing `{% raw %}{{`{% endraw %} or
`{% raw %}{%`{% endraw %} has to sit inside a raw block, as the component examples above do.

[^1]: The footnote text.
