#!/bin/sh
# build command on Cloudflare Pages; output directory is public
set -eu
cd "$(dirname "$0")"

ZOLA_VERSION="${ZOLA_VERSION:-0.23.6}"

# attribution needs the full history
if [ -d .git ] && [ "$(git rev-parse --is-shallow-repository)" = true ]; then
	git fetch --unshallow --quiet || true
fi
if [ -d .git ] && [ "$(git rev-parse --is-shallow-repository)" = true ]; then
	echo "build.sh: shallow clone, contributor history would be incomplete" >&2
	exit 1
fi

python3 contributors.py

if ! command -v zola >/dev/null 2>&1; then
	mkdir -p .zola
	if [ ! -x .zola/zola ]; then
		curl -fsSL "https://github.com/getzola/zola/releases/download/v$ZOLA_VERSION/zola-v$ZOLA_VERSION-x86_64-unknown-linux-gnu.tar.gz" |
			tar -xz -C .zola
	fi
	PATH="$PWD/.zola:$PATH"
fi

exec zola build "$@"
