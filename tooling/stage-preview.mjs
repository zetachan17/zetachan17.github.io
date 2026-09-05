import {cp, mkdir, rm, writeFile} from 'node:fs/promises';
// Separate private preview settings from the public GitHub Pages artifact.
await rm('dist', {recursive:true, force:true});
await mkdir('dist', {recursive:true});
await cp('public', 'dist', {recursive:true, filter: source => !source.endsWith('/CNAME')});
await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
console.log('Private preview staged in dist/.');
