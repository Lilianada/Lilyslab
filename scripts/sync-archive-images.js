#!/usr/bin/env node
/**
 * Copies photos from old WordPress posts into public/ so they can be served as
 * static files. The markdown stays in Content/; the copies are gitignored.
 *
 *   Content/archives/wordpress-posts/<slug>/images/photo.jpg
 *   -> public/archives/wordpress-posts/<slug>/images/photo.jpg
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const source = path.join(root, 'Content/archives/wordpress-posts');
const destination = path.join(root, 'public/archives/wordpress-posts');

if (!fs.existsSync(source)) {
  console.log('[archive-images] nothing to sync');
  process.exit(0);
}

let copied = 0;
for (const post of fs.readdirSync(source, { withFileTypes: true })) {
  const images = path.join(source, post.name, 'images');
  if (!post.isDirectory() || !fs.existsSync(images)) continue;

  const target = path.join(destination, post.name, 'images');
  fs.mkdirSync(target, { recursive: true });

  for (const file of fs.readdirSync(images)) {
    const from = path.join(images, file);
    const to = path.join(target, file);
    if (fs.statSync(from).isFile() && !fs.existsSync(to)) {
      fs.copyFileSync(from, to);
      copied += 1;
    }
  }
}

console.log(`[archive-images] copied ${copied} new image(s)`);
