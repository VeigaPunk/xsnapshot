# XSnapshot

Permanent, SEO- and AI-crawlable public profile snapshots of X (Twitter) accounts from the **user's own official archive**.

## Why
X blocks scraping and limits full history. Users own their data. This turns the official archive into clean public pages that Google and AI crawlers can index.

## Quick start (local static generation)
```bash
git clone https://github.com/VeigaPunk/xsnapshot.git
cd xsnapshot
# Extract your official X archive somewhere
node cli.js /path/to/extracted-archive ./out
open out/@yourhandle/index.html
```

The `out/@handle/` folder is ready for Cloudflare Pages, Vercel, Netlify, GitHub Pages, or any static host.

## Handoff for deploy agents
See **[HANDOFF.md](HANDOFF.md)** — complete instructions, constraints, and next tickets.

## Axes
1. Low friction (official ZIP → one command)
2. Full fidelity (complete public history)
3. High indexability (HTML + JSON-LD + robots + sitemap)
4. Low legal risk (user-owned + public-only + consent warning)
5. Cheap (text-first static)
6. Longevity (static + self-host export path)
7. Trust (irreversible-index banner + claim design)

## License
MIT (code). User content remains the user's.
