+++
title = "UI preview"
description = "Every element a guide can use, rendered once."
weight = 99
draft = true
[extra]
verified_by = "iljasrb"
verified_on = "2026-10-25"
risk = "This is the page-level risk box: one warning, shown above the fold."
+++

A guide page is plain Markdown. `description`, the verified line above, and the risk box come from
the frontmatter; everything below shows what a page can use.

## Text

Inline `code`, **bold**, *italic*, [an external link](https://lineageos.org/), a footnote[^1], and
the internal link to [bootloader unlocking](/bronco/bootloader-unlock/).

### Third level heading

#### Fourth level heading

A second paragraph, so paragraph spacing is visible.

> A plain quote, for quoting a vendor note or a forum answer verbatim.

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

## Code

Command blocks get a copy button; wrapping is horizontal scroll, not line breaks.

```sh
fastboot getvar current-slot
fastboot flash boot_a boot.img
```

```text
(bootloader) current-slot: a
```

## Table

| Partition | Image | Slot |
| --- | --- | --- |
| `boot` | `boot.img` | yes |
| `dtbo` | `dtbo.img` | yes |
| `recovery` | `recovery.img` | no |

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

## Collapsible

<details>
<summary>Long command output</summary>

```text
Sending 'boot_a' (98304 KB)   OKAY [  2.417s]
Writing 'boot_a'              OKAY [  0.312s]
Finished. Total time: 2.729s
```

</details>

## Images

A bare Markdown image is centred:

![fastboot output](/img/example-wide.svg)

A figure with a caption and an explicit size (width and height keep the layout from jumping):

{{<figure src="img/example-wide.svg" alt="fastboot devices output listing one device" caption="One device, slot a." width="520" height="292"/>}}

Floating right, the text wraps around it. Use `align="left"` for the other side:

{{<figure src="img/example-tall.svg" alt="Recovery menu with apply update, factory reset and reboot" caption="Recovery menu." align="right" width="220" height="440"/>}}

This paragraph sits next to the floated figure, so it shows how the text wraps. Both sides collapse to
a normal block under 640px, where wrapping text beside an image is unreadable anyway.

Two or three side by side:

{% <cols> %}
{{<figure src="img/example-wide.svg" alt="Before flashing" caption="Before"/>}}
{{<figure src="img/example-wide.svg" alt="After flashing" caption="After"/>}}
{% </cols> %}

{% raw %}`{% <cols count="3"> %}`{% endraw %} for three. Image paths are relative to `static/`, so `src="img/example-wide.svg"`
is `static/img/example-wide.svg`; captions and alt text are escaped.

## Keys and highlighting

Hold <kbd>Power</kbd> and <kbd>Volume Down</kbd> for ten seconds, then release. Inline text can be
<mark>highlighted</mark>.

## Rules and footnotes

---

Footnote definitions sit at the bottom, like this one.

[^1]: The footnote text, linked back to the marker.
