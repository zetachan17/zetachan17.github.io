# Runze Zhu’s portfolio

A small, static game-development portfolio built with Hexo and the custom `folio` theme. Public address: **https://rzhu.ca**. GitHub Pages publishes the `gh-pages` branch after the `main` branch passes the build and site checks.

## Local development

Use Node 22 (see `.nvmrc`), then:

```sh
npm ci
npm run server
```

## Build and verify

```sh
npm run build
npm test
npm audit
```

The build cleans stale output and generates `public/`. The site checker validates every generated HTML page, local link, image reference, project body, legacy project URL, résumé, sitemap, and domain file. It uses only Node’s standard library.

## Update the content

- `source/_data/projects.json`: project cards, artwork, metadata, and display order. Set `featured: true` for homepage projects.
- `source/projects/*.md`: project descriptions. Keep the `project` slug aligned with the data file and the directory permalink.
- `source/_data/experience.json`: employment history, shared by home and about.
- `source/about/index.md`: biography.
- `source/_posts/`: notes in Markdown.
- `source/Runze_Zhu_Resume.pdf`: the downloadable résumé.
- `themes/folio/`: layouts, design tokens, responsive styles, and route generators.

Project links use `/projects/name/`. The generator also preserves the old `/projects/name.html` URLs with redirects. Original image files remain available at their existing URLs; page layouts load optimized WebP copies from `source/images/optimized/`. Use accurate dimensions and descriptive alt text when adding images.

## Publishing

The Pages workflow checks pull requests and publishes successful `main` builds. The deployment job alone has repository write permission. `source/CNAME` preserves `rzhu.ca` on future releases. The Pages custom-domain setting must also point to `rzhu.ca` and HTTPS must be enabled once GitHub has issued its certificate.

`.openai/hosting.json` identifies a separate, private Sites review copy. `npm run build:preview` stages that copy in `dist/`, excludes `CNAME`, and blocks crawlers. It does not change the public GitHub Pages output. No credentials are stored in the repository.

See [the September 2026 audit](docs/AUDIT.md) for findings, fixes, checks, and remaining editorial opportunities.
