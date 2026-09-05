import assert from 'node:assert/strict';
import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('public');
const origin = 'https://rzhu.ca';
const projects = JSON.parse(await readFile('source/_data/projects.json', 'utf8'));
const read = file => readFile(file, 'utf8');
async function walk(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
}
const files = await walk(root);
const pages = files.filter(file => file.endsWith('.html'));
const cache = new Map(await Promise.all(pages.map(async file => [file, await read(file)])));
function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/gs)].map(m => [m[1].toLowerCase(), m[3]]));
}
const text = html => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
let checkedLinks = 0;
for (const [file, html] of cache) {
  const relative = path.relative(root, file);
  const redirect = /http-equiv="refresh"/i.test(html);
  assert.match(html, /<html lang="en">/, `${relative}: missing language`);
  assert.match(html, /<title>[^<]+<\/title>/, `${relative}: missing title`);
  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/g)].map(m => attrs(m[0])).find(a => a.rel === 'canonical');
  assert.ok(canonicalTag?.href.startsWith(origin + '/'), `${relative}: incorrect canonical`);
  assert.ok(!html.includes('example.com'), `${relative}: placeholder origin`);
  if (!redirect) {
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${relative}: expected one h1`);
    assert.match(html, /<main id="main" tabindex="-1">/, `${relative}: missing main landmark`);
    assert.match(html, /class="skip-link" href="#main"/, `${relative}: missing skip link`);
    assert.match(html, /name="description" content="[^"<>]+"/, `${relative}: missing description`);
    assert.ok(!/<script\b/.test(html), `${relative}: static portfolio should not require client scripts`);
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${relative}: duplicate IDs`);
  for (const match of html.matchAll(/<(?:a|img|link)\b[^>]*>/g)) {
    const a = attrs(match[0]);
    if (match[0].startsWith('<img')) assert.ok(a.alt, `${relative}: missing image alt`);
    if (a.target === '_blank') assert.match(a.rel || '', /noopener/, `${relative}: unsafe external link`);
    const target = a.href || a.src;
    if (!target || /^(mailto:|tel:|https?:|data:)/.test(target)) continue;
    assert.ok(!target.startsWith('//'), `${relative}: protocol-relative link`);
    const url = new URL(target, origin + '/' + relative);
    const local = path.join(root, decodeURIComponent(url.pathname));
    const resolved = url.pathname.endsWith('/') ? path.join(local, 'index.html') : local;
    assert.ok(files.includes(resolved), `${relative}: missing target ${target}`);
    if (url.hash && cache.has(resolved)) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(cache.get(resolved).includes(`id="${id}"`), `${relative}: missing anchor ${target}`);
    }
    checkedLinks++;
  }
}
for (const project of projects) {
  const html = cache.get(path.join(root, project.url, 'index.html'));
  assert.ok(html, `Missing project: ${project.slug}`);
  const prose = html.match(/<div class="prose">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(prose && text(prose).length >= 100, `Empty project: ${project.slug}`);
  assert.match(cache.get(path.join(root, `projects/${project.slug}.html`)), /http-equiv="refresh"/, `Missing legacy redirect: ${project.slug}`);
}
const sitemap = await read(path.join(root, 'sitemap.xml'));
for (const project of projects) assert.ok(sitemap.includes(origin + project.url), `Project missing from sitemap: ${project.slug}`);
assert.equal((await read(path.join(root, 'CNAME'))).trim(), 'rzhu.ca');
assert.ok(files.includes(path.join(root, '.nojekyll')));
assert.ok((await stat(path.join(root, 'Runze_Zhu_Resume.pdf'))).size > 1000);
assert.deepEqual(await readFile(path.join(root, 'Runze_Zhu_Resume.pdf')), await readFile('source/Runze_Zhu_Resume.pdf'));
assert.match(await read(path.join(root, '404.html')), /noindex, follow/);
assert.match(await read(path.join(root, 'robots.txt')), /Sitemap: https:\/\/rzhu.ca\/sitemap.xml/);
assert.ok(!/noindex/.test(cache.get(path.join(root, 'archives/index.html'))), 'Notes index should be indexable');
console.log(`PASS: ${pages.length} HTML pages, ${projects.length} populated projects, ${checkedLinks} internal links/assets, legacy redirects, metadata, sitemap, résumé, and domain configuration.`);
