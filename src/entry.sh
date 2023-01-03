#!/usr/bin/env bash
dir=$(dirname $(readlink -f "$BASH_SOURCE"))
/usr/bin/env node --no-warnings --experimental-specifier-resolution=node "$dir"/index.js "$@"
