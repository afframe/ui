#!/usr/bin/env bash
# REUSE lint and the docs licence labels. The reuse image marks /data as a git
# safe directory.
set -euo pipefail

image="$(sed -n 's/^FROM \(.*\) AS reuse$/\1/p' scripts/ci/toolbox/Dockerfile)"
[[ "$image" =~ ^[a-z0-9./:_-]+@sha256:[0-9a-f]{64}$ ]] || { echo "::error::reuse image is not pinned by digest"; exit 1; }
docker run --rm --network none -v "$PWD:/data:ro" "$image" lint --json | node scripts/check-licence-labels.mjs
