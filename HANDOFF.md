# XSnapshot Handoff Package

**Repo:** https://github.com/VeigaPunk/xsnapshot  
**Purpose:** Ready-to-deploy static site generator for permanent, SEO/AI-crawlable X (Twitter) profile snapshots from user-submitted official archives.

## What this is
Users download their official X archive ZIP → this tool parses public tweets + profile only → outputs a complete static website folder that any static host can serve.

## Current files
- `parser/parse-ytd.js` — strip `window.YTD.*.partN` + extract public tweets
- `generator/static-page.js` — generate HTML + JSON-LD Person + SocialMediaPosting
- `package.json`
- `README.md`

## Immediate next steps for deploy agent

### 1. Make it a complete CLI (copy-paste ready)
Create `generate.js` at root:

```js
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { parseYTDFile, extractPublicTweets } = require('./parser/parse-ytd.js');
const { generateHTML } = require('./generator/static-page.js');

const inputDir = process.argv[2];
const outDir = process.argv[3] || './out';
if (!inputDir) {
  console.error('Usage: node generate.js <extracted-archive-dir> [out-dir]');
  process.exit(1);
}

const dataDir = fs.existsSync(path.join(inputDir, 'data')) ? path.join(inputDir, 'data') : inputDir;
let tweets = [];
let profile = { screen_name: 'unknown', name: 'Unknown', bio: '' };

for (const f of fs.readdirSync(dataDir)) {
  if (f.match(/tweets.*\.js$/)) {
    const raw = fs.readFileSync(path.join(dataDir, f), 'utf8');
    tweets = tweets.concat(extractPublicTweets(parseYTDFile(raw)));
  }
  if (f === 'account.js' || f === 'profile.js') {
    // extend parser for these if needed
  }
}

tweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
const date = new Date().toISOString().slice(0, 10);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), generateHTML(profile, tweets, date));
fs.writeFileSync(path.join(outDir, 'tweets.json'), JSON.stringify(tweets));
fs.writeFileSync(path.join(outDir, 'robots.txt'), 'User-agent: *\nAllow: /\n');
console.log(`Wrote ${tweets.length} tweets to ${outDir}`);
```

### 2. Deploy the *generated* site (any static host)
After running the generator on a real archive:

**Cloudflare Pages (recommended - unlimited bandwidth)**
1. `npx wrangler pages project create xsnapshot`
2. Or drag the `out/` folder to Cloudflare Pages dashboard.
3. Custom domain optional.

**Vercel / Netlify / GitHub Pages**
- Push the generated `out/` (or whole repo) and set publish directory to the output folder.
- Or use `npx serve out` for local test.

**GitHub Pages**
- Put generated files in `/docs` or `gh-pages` branch.

### 3. For the *product* site (upload UI + claim)
Later layer: Next.js / Cloudflare Workers + R2 for ZIP upload, OAuth claim (X users.read), then publish the static output under `/@handle`.

For pure static MVP: the generator above is enough. Users run it themselves and host the folder.

## Legal / Trust notes for deploy agent
- Only public tweets + profile.
- Every page must keep the irreversible-index banner.
- No DMs, no private data.
- User must supply their own archive.

## Success criteria for next agent
- `node generate.js /path/to/extracted-x-archive ./out` produces a working, crawlable `index.html`.
- The folder can be dropped on any static host and immediately appear in Google/AI fetches.
- Self-host path remains first-class.

This is the complete handoff. No further research required.
