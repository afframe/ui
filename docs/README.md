# Afframe UI docs

Permanent documents live in `docs/`. Temporary working files that agents need to continue a piece of work live in `docs/plans/` and are deleted when that work is done. This repo is public: everything here is publicly readable.

| File | What it is |
|---|---|
| [goals.md](goals.md) | Goals, decisions and open decisions (D1 to D12) |
| [scope.md](scope.md) | Afframe UI scope: v11/v12 answer, include, optional, exclude, improve, build new |
| [research/carbon-reference.md](research/carbon-reference.md) | IBM Carbon research reference (round 1) |
| [research/carbon-catalog.md](research/carbon-catalog.md) | Catalog of the Carbon ecosystem for React (round 2) |
| [research/carbon-org-repos.md](research/carbon-org-repos.md) | Triage of all 121 carbon-design-system repos |
| [research/sources/](research/sources/) | Evidence: research lanes, verification passes and ground-truth data |
| [plans/](plans/) | Temporary working files |

Evidence conventions: `round1/*` and `round2/*` are the research lanes and verification passes the documents cite (for example "V row 2c" is row 2c of `round2/V-verify.md`). `<npm pack>/<name>-<version>/package/...` is a path inside the published npm tarball of that package version. The lane files are pre-verification drafts kept as evidence: the verification files (`round1/07a`, `round1/07b`, `round2/V-verify.md`) override them, and the documents above are authoritative.
