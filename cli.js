#!/usr/bin/env node
/**
 * XSnapshot CLI
 * Usage: node cli.js <path-to-extracted-archive> [output-dir]
 * Produces a fully static, crawlable snapshot ready for any static host.
 */
const fs = require('fs');
const path = require('path');
const { buildSnapshot } = require('./parser/parse-ytd.js');
const { generateSite } = require('./generator/static-page.js');

async function main() {
  const archivePath = process.argv[2];
  const outDir = process.argv[3] || './out';
  if (!archivePath) {
    console.error('Usage: node cli.js <path-to-extracted-x-archive> [output-dir]');
    process.exit(1);
  }

  // Collect all relevant .js files from data/ or root
  const dataDir = fs.existsSync(path.join(archivePath, 'data'))
    ? path.join(archivePath, 'data')
    : archivePath;

  const files = {};
  for (const name of fs.readdirSync(dataDir)) {
    if (/\.(js)$/i.test(name) && /(tweet|profile|account)/i.test(name)) {
      files[name] = fs.readFileSync(path.join(dataDir, name), 'utf8');
    }
  }

  if (!Object.keys(files).some(n => /tweet/i.test(n))) {
    console.error('No tweets*.js found. Point at the extracted official X archive folder.');
    process.exit(1);
  }

  const snapshot = buildSnapshot(files);
  const handle = (snapshot.profile && snapshot.profile.screen_name) || (snapshot.account && snapshot.account.username) || 'unknown';
  const target = path.join(outDir, '@' + handle);

  generateSite(snapshot, target);
  console.log('Snapshot written to', target);
  console.log('Open', path.join(target, 'index.html'));
  console.log('Ready for static deploy (Cloudflare Pages / Vercel / Netlify / GitHub Pages).');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
