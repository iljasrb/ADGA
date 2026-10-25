import assert from "node:assert/strict";
import { deviceOf, hrefOf, search, snippet } from "./static/search-core.mjs";

const index = [
  { url: "https://devices.flac.moe/bronco/", title: "Motorola ThinkPhone (bronco)", body: "Bootloader and debricking." },
  { url: "https://devices.flac.moe/bronco/kernel/", title: "Kernel", body: "Installing a custom kernel with KernelSU." },
  { url: "https://devices.flac.moe/bronco/edl-flash/", title: "EDL flash", body: "Flashing over EDL." },
  { url: "https://devices.flac.moe/bronco/stock-rom/", title: "Stock ROM", body: "A kernel is not involved. flash stock firmware." },
];

const titles = (hits) => hits.map((hit) => hit.item.title);

assert.deepEqual(titles(search(index, "kernel")), ["Kernel", "Stock ROM"], "title before body");
assert.deepEqual(titles(search(index, "flash")), ["EDL flash", "Stock ROM"], "title match before body");
assert.deepEqual(titles(search(index, "  KERNEL ")), ["Kernel", "Stock ROM"], "trim and lowercase");
assert.deepEqual(search(index, "zzz"), [], "no match");
assert.deepEqual(search(index, "   "), [], "blank query");
assert.equal(search(index, "e", 2).length, 2, "max results");

const long = `${"x".repeat(200)} bootloader unlock ${"y".repeat(200)}`;
const cut = snippet(long, "bootloader", true);
assert.ok(cut.startsWith("…") && cut.includes("bootloader") && cut.endsWith("…"), cut);
assert.ok(cut.length < 180, "snippet is bounded");

const words = Array.from({ length: 60 }, (_, i) => `w${i}`).join(" ") + " matchhere " + Array.from({ length: 60 }, (_, i) => `z${i}`).join(" ");
const tidy = snippet(words, "matchhere", true, 20);
assert.ok(tidy.startsWith("…") && tidy.endsWith("…"), tidy);
assert.match(tidy.slice(1), /^w\d+ /, "starts on a word");
assert.match(tidy, / z\d+…$/, "ends on a word");
assert.equal(snippet("Short body only.", "absent", false), "Short body only.", "no body match shows the start");
assert.equal(snippet("", "x", true), "", "empty body");

assert.equal(hrefOf("https://devices.flac.moe/bronco/edl-flash/", "http://localhost:1111/bronco/"), "/bronco/edl-flash/");
assert.equal(hrefOf("https://devices.flac.moe/bronco/#part", "http://localhost:1111/"), "/bronco/#part", "keeps hash");
assert.equal(hrefOf("/a/b/", "http://localhost:1111/"), "/a/b/", "already relative");

assert.equal(deviceOf("https://devices.flac.moe/bronco/edl-flash/"), "bronco");
assert.equal(deviceOf("https://devices.flac.moe/"), "", "root has no device");

console.log("ok");
