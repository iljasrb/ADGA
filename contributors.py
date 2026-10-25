#!/usr/bin/env python3
"""Write data/contributors.json from git history. Runs before `zola build` (see build.sh).

Per page and per section, who touched it. GitHub logins come from noreply commit
emails or contributors.map; anything else is credited by name without a link.
"""

import json
import os
import re
import subprocess
from collections import Counter

ROOT = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(ROOT, "content")
OUT = os.path.join(ROOT, "data", "contributors.json")

NOREPLY = re.compile(r"^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$", re.I)
COAUTHOR = re.compile(r"^co-authored-by:\s*(.*?)\s*<([^>]+)>", re.I | re.M)
BOTS = {"github-actions", "dependabot", "renovate", "web-flow"}


def load_map(path=None):
    mapping = {}
    path = path or os.path.join(ROOT, "contributors.map")
    if os.path.exists(path):
        with open(path, encoding="utf-8") as map_file:
            for line in map_file:
                line = line.split("#", 1)[0].strip()
                if "=" not in line:
                    continue
                email, login = line.split("=", 1)
                if email.strip() and login.strip():
                    mapping[email.strip().lower()] = login.strip()
    return mapping


def login_of(email, mapping):
    """GitHub login for a commit email, or None when it cannot be known."""
    email = email.strip().lower()
    hit = NOREPLY.match(email)
    return hit.group(1) if hit else mapping.get(email)


def is_bot(login):
    return bool(login) and (login.endswith("[bot]") or login in BOTS)


def parse_log(raw, mapping):
    """Turn `git log --format=%aN%x1f%aE%x1f%B%x1e` output into contributor dicts."""
    seen = Counter()
    names = {}
    for record in raw.split("\x1e"):
        record = record.strip("\n")
        if not record:
            continue
        name, email, body = (record.split("\x1f", 2) + ["", ""])[:3]
        people = [(name.strip(), email.strip())]
        people += [(co_name.strip(), co_email.strip()) for co_name, co_email in COAUTHOR.findall(body)]
        for person_name, person_email in people:
            login = login_of(person_email, mapping)
            if is_bot(login):
                continue
            key = login or person_name.lower()
            if not key:
                continue
            seen[key] += 1
            names.setdefault(key, (login, person_name))
    return [
        {"login": names[key][0], "name": names[key][1], "count": count}
        for key, count in sorted(seen.items(), key=lambda item: (-item[1], names[item[0]][1].lower()))
    ]


def merge(groups):
    """Combine per-page contributor lists, summing commit counts."""
    merged = {}
    for person in (person for group in groups for person in group):
        key = person["login"] or person["name"].lower()
        if key in merged:
            merged[key]["count"] += person["count"]
        else:
            merged[key] = dict(person)
    return sorted(merged.values(), key=lambda person: (-person["count"], person["name"].lower()))


def commits_for(rel_path, mapping):
    raw = subprocess.run(
        ["git", "log", "--use-mailmap", "--format=%aN%x1f%aE%x1f%B%x1e", "--", "content/" + rel_path],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    ).stdout
    return parse_log(raw, mapping)


def build():
    mapping = load_map()
    pages = {}
    per_dir = {}
    for dirpath, _, filenames in os.walk(CONTENT):
        for filename in filenames:
            if not filename.endswith(".md"):
                continue
            rel_path = os.path.relpath(os.path.join(dirpath, filename), CONTENT).replace(os.sep, "/")
            people = commits_for(rel_path, mapping)
            pages[rel_path] = people
            parts = rel_path.split("/")[:-1]
            for depth in range(len(parts) + 1):
                per_dir.setdefault("/".join(parts[:depth]), []).append(people)
    sections = {"/" + (directory + "/" if directory else ""): merge(groups) for directory, groups in per_dir.items()}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as out:
        json.dump({"pages": pages, "sections": sections}, out, indent=1, ensure_ascii=False)
        out.write("\n")
    return pages


if __name__ == "__main__":
    pages = build()
    print(f"contributors: {len(pages)} pages -> data/contributors.json")
