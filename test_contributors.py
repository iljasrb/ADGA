"""python3 test_contributors.py"""

from contributors import group_by_dir, is_bot, login_of, merge, parse_log

SEP, FIELD = "\x1e", "\x1f"

raw = (
    f"iljasrb{FIELD}1+iljasrb@users.noreply.github.com{FIELD}fix typo\n\n"
    f"Co-authored-by: Ana <ana@example.org>{SEP}"
    f"github-actions[bot]{FIELD}41898282+github-actions[bot]@users.noreply.github.com{FIELD}ci{SEP}"
    f"Ana{FIELD}ana@example.org{FIELD}second commit{SEP}"
)

assert login_of("1+iljasrb@users.noreply.github.com", {}) == "iljasrb"
assert login_of("iljasrb@users.noreply.github.com", {}) == "iljasrb"
assert login_of("ana@example.org", {"ana@example.org": "ana"}) == "ana"
assert login_of("stranger@example.org", {}) is None
assert is_bot("github-actions[bot]") and is_bot("dependabot")
assert not is_bot("ana") and not is_bot(None)

people = parse_log(raw, {"ana@example.org": "ana"})
assert [(person["login"], person["count"]) for person in people] == [("ana", 2), ("iljasrb", 1)], people

unnamed = parse_log(f"Bob{FIELD}bob@example.org{FIELD}alone{SEP}", {})
assert unnamed == [{"login": None, "name": "Bob", "initial": "B", "count": 1}], unnamed

merged = merge([[{"login": "ana", "name": "Ana", "count": 1}], [{"login": "ana", "name": "Ana", "count": 2}]])
assert merged == [{"login": "ana", "name": "Ana", "initial": "A", "count": 3}], merged

# a device page shows everyone who touched any file in the folder
sections = group_by_dir({
    "bronco/_index.md": [{"login": "ana", "name": "Ana", "count": 1}],
    "bronco/edl-flash.md": [{"login": "bob", "name": "Bob", "count": 1}],
    "bronco/nested/page.md": [{"login": "ana", "name": "Ana", "count": 2}],
    "about/index.md": [{"login": "cara", "name": "Cara", "count": 1}],
})
assert list(sections) == ["/bronco/", "/bronco/nested/", "/about/"], sections
assert [(person["login"], person["count"]) for person in sections["/bronco/"]] == [("ana", 3), ("bob", 1)], sections["/bronco/"]

print("ok")
