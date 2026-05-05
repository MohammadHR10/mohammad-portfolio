# Mohammad Hasibur Rahman Portfolio

Static portfolio site for GitHub Pages.

## Run locally

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Publish

This repo is ready for GitHub Pages. After GitHub CLI is authenticated:

```sh
gh repo create mohammad-portfolio --public --source=. --remote=origin --push
```

Then enable Pages for the repository. The included workflow deploys the static site from `main`.

## LinkedIn import note

LinkedIn data was imported from the profile PDF supplied locally, not by using LinkedIn credentials.
