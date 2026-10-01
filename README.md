# gpatwa.github.io

Personal site for Gopal Patwa — a static page (`index.html` + `styles.css`) served by GitHub Pages at https://gpatwa.github.io.

## Making changes

1. Branch from `master` and edit `index.html` / `styles.css`.
2. Preview locally: `python3 -m http.server 8000` and open http://localhost:8000.
3. Open a pull request. CI validates the HTML and checks internal links and assets.
4. Merge to `master`. The workflow in `.github/workflows/deploy.yml` deploys to Pages automatically.

## Automation

- `deploy.yml` — validate on every PR and push; deploy on push to `master`.
- `sync-projects.yml` — weekly refresh of the project cards from the source repos; opens a PR on change.
- `links.yml` — weekly external link check; opens an issue if links are broken.

New top-level files that must be published need adding to the "Assemble site" step in `deploy.yml`.

## Project cards

The cards in the "Selected work" section are generated, not hand-edited. Edit `data/projects.json` (title, summary, colour, extra tags, links), then run:

```
GITHUB_TOKEN=$(gh auth token) node scripts/sync-projects.mjs
```

The script also pulls each repo's primary language from the GitHub API as the first tag, and fails if a repo is missing or archived. `sync-projects.yml` runs it every Monday (or on demand) and opens a PR if anything changed. Don't edit between the `projects:start` / `projects:end` markers in `index.html`.

## One-time repo settings

- Settings → Pages → Source: **GitHub Actions**
- Enforce HTTPS
- Protect `master`: require a PR and the `check` status
- Settings → Actions → General → allow GitHub Actions to create pull requests (needed by `sync-projects.yml`)
