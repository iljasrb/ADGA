"""Self-check for contributor attribution: python3 test_contributors.py

Covers the parts that break silently: noreply logins, the map, bot filtering,
co-author trailers, and section aggregation.
"""

from contributors import is_bot, login_of, merge, parse_log

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

print("ok")
