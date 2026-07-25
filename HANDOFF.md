# HANDOFF — XSnapshot deploy package

**For the next agent that deploys websites.**

This repo is a complete, text-first, static-site generator for permanent public X (Twitter) profile snapshots from the user's own official archive ZIP.

## What it produces
A folder ready for any static host (Cloudflare Pages, Vercel, Netlify, GitHub Pages, S3+CloudFront, etc.):

```
out/@handle/
  index.html          # SEO + AI crawlable page with JSON-LD
  data.json           # full tweets + profile (for client search / future)
  robots.txt
  sitemap.xml
```

No server required for the snapshot pages themselves.

## One-command generation (after user extracts official archive)

```bash
npm install          # zero runtime deps beyond Node
node cli.js /path/to/extracted-x-archive ./out
```

Or with ZIP later (jszip already planned).

## Deploy instructions (static)

### Cloudflare Pages (recommended — unlimited bandwidth free tier)
1. Create project from this repo or from the generated `out/` folder.
2. Build command: leave empty or `echo "static"`
3. Output directory: `out` (or the folder containing the generated @handle sites)
4. Custom domain optional.
5. For multi-user hosted version later: add Pages Function for upload + claim.

### Vercel / Netlify
- Framework preset: Other
- Output directory = the generated static folder
- No build needed for pure static.

### Self-host by user
User runs the CLI locally → gets ZIP of their page → uploads to their own GitHub Pages / Netlify / own domain. Zero cost to you.

## Legal / product constraints the deploy agent must respect
- Only public tweets + public profile fields.
- Every page must show the irreversible-index warning banner.
- Claim gate (X OAuth) before a snapshot becomes public is required for the hosted multi-user version.
- Never rehost media in v1 (URLs only).
- User content remains user-owned; MIT only for the code.

## Next engineering tickets (ordered)
1. Add ZIP support with jszip (browser + Node).
2. Harden multi-part tweets-part*.js (already partially done).
3. X OAuth 2.0 PKCE claim flow (users.read scope only).
4. Hosted upload UI + private preview → claim → public publish.
5. Always emit downloadable static ZIP of the generated site.

## Axes the design already protects
Friction, fidelity, indexability, legal, cost, longevity, trust — all green for v1 static path.

Repo: https://github.com/VeigaPunk/xsnapshot

Hand this entire repo (or just the generated static output) to any static-site deploy agent. No further research required.
