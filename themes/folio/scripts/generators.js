"use strict";

// Keep the original .html project URLs usable after moving to directory URLs.
hexo.extend.generator.register("portfolio-legacy-projects", function (locals) {
  return locals.data.projects.map(project => ({
    path: `projects/${project.slug}.html`,
    data: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Project moved — Runze Zhu</title><meta http-equiv="refresh" content="0; url=${project.url}"><link rel="canonical" href="${hexo.config.url}${project.url}"><meta name="robots" content="noindex, follow"></head><body><p>This project has moved. <a href="${project.url}">Continue to the project.</a></p></body></html>`
  }));
});
hexo.extend.generator.register("portfolio-404", () => ({
  path: "404.html", layout: "404", data: {title: "Page not found", noindex: true}
}));
hexo.extend.generator.register("portfolio-discovery", function (locals) {
  const origin = hexo.config.url.replace(/\/$/, "");
  const paths = ["/", "/about/", "/projects/", "/archives/", ...locals.data.projects.map(p => p.url), ...locals.posts.toArray().map(p => `/${p.path.replace(/index\.html$/, "")}`)];
  const urls = [...new Set(paths)].map(path => `<url><loc>${origin}${path}</loc></url>`).join("");
  return [
    {path:"sitemap.xml", data:`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`},
    {path:"robots.txt", data:`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`},
    {path:".nojekyll", data:""}
  ];
});
