# gpatwa.github.io

Personal site for Gopal Patwa — a static page (`index.html` + `styles.css`) served by GitHub Pages at https://gpatwa.github.io.

## Making changes

1. Branch from `master` and edit `index.html` / `styles.css`.
2. Preview locally: `python3 -m http.server 8000` and open http://localhost:8000.
3. Open a pull request. CI validates the HTML and checks internal links and assets.
4. Merge to `master`. The workflow in `.github/workflows/deploy.yml` deploys to Pages automatically.

## Automation

- `deploy.yml` — validate on every PR and push; deploy on push to `master`.
- `links.yml` — weekly external link check; opens an issue if links are broken.

New top-level files that must be published need adding to the "Assemble site" step in `deploy.yml`.

## One-time repo settings

- Settings → Pages → Source: **GitHub Actions**
- Enforce HTTPS
- Protect `master`: require a PR and the `check` status
