# Portfolio audit — 5 September 2026

Scope: the `zetachan17/zetachan17.github.io` source at commit `0ccf901154006d9c657efab911715ffa29847350`, generated pages, publishing workflow, dependencies, public DNS/domain configuration, and the redesigned site. Experience was updated from the résumé supplied by the owner on 5 September 2026.

## Findings and fixes

| Priority | Finding | Resolution |
| --- | --- | --- |
| High | `rzhu.ca` failed TLS certificate validation. The intended repository had no custom domain; the domain was assigned to `zetachan17/portfolio`, with no certificate provisioned. | With the owner’s approval, moved the Pages domain to `zetachan17.github.io`. Added `source/CNAME` so builds preserve it. Certificate provisioning and HTTPS enforcement must be verified after deployment. |
| High | Publishing used Node 16.16.0, but the installed Hexo 8.1.1 declares Node >=20.19.0. | Standardized local development and CI on Node 22. |
| High | Six project Markdown files were empty: Imminent, Space Riders, Warzone, Shadows, Kitty and Katy, and Super Hyper Cube. | Populated all nine project pages from existing project descriptions and résumé facts. Short entries remain concise where no detailed contribution evidence exists. |
| High | `layout: projects` referenced a nonexistent Cactus layout on project pages. | Added an explicit project template with hero, metadata, readable body, return navigation, and next-project navigation. |
| Medium | Jumpin’ Jazz Cats contained placeholder copy and a group photo belonging to Rootin’ 4 Ya. | Added its documented gameplay/UI/multiplayer contribution; used the correct key art and moved the group photo to its own project. |
| Medium | The canonical site URL was `http://example.com`. | Set `https://rzhu.ca`; added page-specific titles/descriptions, canonical and Open Graph metadata, a sitemap, and robots.txt. |
| Medium | The homepage identified the owner as a recent graduate and prioritized a single old blog note; current work was missing. | Led with a game-programming introduction, selected projects, and résumé-based Ubisoft, Beenox, and Motive experience. Updated the downloadable résumé. |
| Medium | Six dependencies had reported advisories: four high and two moderate severity. | Applied compatible lockfile updates with `npm audit fix`; final audit reports zero known vulnerabilities. These are build/development dependencies; this finding does not establish exploitation of the static public website. |
| Medium | CI cached `node_modules` with a key unrelated to the lockfile and installed using `npm install`. It did not validate pull requests. | Switched to `npm ci`, setup-node’s lockfile-aware npm cache, PR validation, artifact-based deployment, and scoped permissions. Updated Actions versions. |
| Medium | The blog template loaded jQuery and external icon/gallery resources for a simple portfolio. | Created a self-contained static theme with system fonts and no client scripts. Existing themes and dependency declarations remain available for rollback. |
| Medium | Several images were 1–2 MB each. | Added ten resized WebP assets with 94.5% lower aggregate size: 12,047,855 bytes → 665,848 bytes. Layouts load these copies; original URLs remain intact. |
| Medium | Project URL formatting and content were inconsistent. | Standardized directory URLs and generated redirects for all nine original `.html` paths. Added a link-graph check to prevent missing files and anchors. |
| Improvement | Accessibility and responsive structure needed a consistent baseline. | Added a skip link, labelled navigation, logical headings, visible keyboard focus, meaningful image alt text, image dimensions, reduced-motion support, and responsive layouts. |
| Improvement | Spelling, stale copy, and project naming were inconsistent. | Corrected the copy, clarified that the university Warzone project is separate from Call of Duty: Warzone Mobile, and retained the blog and personal interests. |

## Validation

- Clean production build with Hexo 8.1.1 and Node 22.
- Automated checks: **26 HTML pages, 9 populated project pages, 247 internal links/assets**; canonical origins, sitemap, domain file, résumé integrity, anchor targets, alt text, and legacy redirects.
- Browser checks across eight representative routes at **320, 768, and 1440 px**: one H1 per page, no horizontal page overflow, no missing image alt text, no broken visible images, no recorded console warnings/errors.
- Visual review of desktop and phone home layouts and the phone about layout; navigation from the work gallery to a project.
- Keyboard navigation: the first Tab exposes the skip link with a visible outline; Enter moves focus to the main landmark.
- Résumé route returns HTTP 200; deployed copy is checked byte-for-byte against the supplied source PDF.
- The itch.io and Spotify profile endpoints return HTTP 200. LinkedIn returns its automated-client status 999; its destination is retained from the existing site and résumé and cannot be certified by this HTTP check.
- `npm audit`: **0 known vulnerabilities** after the compatible updates.
- `git diff --check`: clean.

These checks do not substitute for a screen-reader audit, Lighthouse field measurements, or a penetration test. No such certification or score is claimed.

## Further content improvements

The next useful improvement is deeper project evidence: a gameplay clip, playable build or source link, exact individual responsibilities, and a technical challenge for each university/game-jam project. The repository did not contain enough verified detail to add those honestly. Jumpin’ Jazz Cats’ supplied cover is only 460 × 215; a larger original would look sharper on desktop. Keep employment dates and the downloadable résumé in sync when your role changes.

Domain documentation: [GitHub’s custom-domain setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). GitHub documents that HTTPS availability can take up to 24 hours after domain setup.
