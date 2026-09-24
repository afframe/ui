# Afframe UI docs

**Status 2026-09-24: all documents are drafts awaiting Hleb's review.** Permanent documents live in `docs/`. Temporary working files that agents need to continue a piece of work live in `docs/plans/` and are deleted when that work is done. This repo is public: everything here is publicly readable.

| File | What it is |
|---|---|
| [goals.md](goals.md) | Goals, decisions and open decisions (D1 to D12) |
| [consumption.md](consumption.md) | How other Afframe repos install and use the package |
| [scope.md](scope.md) | Afframe UI scope: v11/v12 answer, include, optional, exclude, improve, build new |
| [research/carbon-reference.md](research/carbon-reference.md) | IBM Carbon research reference (round 1) |
| [research/carbon-catalog.md](research/carbon-catalog.md) | Catalog of the Carbon ecosystem for React (round 2) |
| [research/carbon-org-repos.md](research/carbon-org-repos.md) | Triage of all 121 carbon-design-system repos |
| [research/sources/](research/sources/) | Evidence: research lanes, verification passes and ground-truth data |
| [plans/](plans/) | Temporary working files |

Evidence conventions: `round1/*`, `round2/*` and `round3/*` are the research lanes and verification passes the documents cite (for example "V row 2c" is row 2c of `round2/V-verify.md`, "V3 row 2e" is row 2e of `round3/V3-verify.md`). `<npm pack>/<name>-<version>/package/...` is a path inside the published npm tarball of that package version. The lane files are pre-verification drafts kept as evidence: the verification files (`round1/07a`, `round1/07b`, `round2/V-verify.md`, `round3/V3-verify.md`) override them, and the documents above are authoritative.
