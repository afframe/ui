# Image pins for CI: each job (or scripts/ci/licence-check.sh) reads its FROM line
# by stage name; Dependabot updates the pins. Never built.
FROM ghcr.io/gitleaks/gitleaks:v8.30.1@sha256:c00b6bd0aeb3071cbcb79009cb16a60dd9e0a7c60e2be9ab65d25e6bc8abbb7f AS gitleaks
FROM rhysd/actionlint:1.7.12@sha256:b1934ee5f1c509618f2508e6eb47ee0d3520686341fec936f3b79331f9315667 AS actionlint
FROM ghcr.io/zizmorcore/zizmor:1.31.1@sha256:42d409dbb851d4c5d35a058cf042b828bea1e3f2884378c526eb0974780e18d9 AS zizmor
FROM fsfe/reuse:6.3.0@sha256:2748d04c2adeb747c9a44831bc99a9cbfd7bf7ff6fc371a4b63204944e3e47b6 AS reuse
