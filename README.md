# XSnapshot

Permanent, SEO/AI-crawlable public snapshots of X (Twitter) profiles from user-submitted official archives.

**Why:** X restricts scraping and full history access. Users own their data. If they want to be found on Google and AI crawlers, they should be able to publish a complete, permanent, searchable archive snapshot.

## How it works
1. User requests official archive from X (Settings → Your account → Download an archive of your data).
2. Uploads the ZIP here (or uses the client-side generator).
3. We parse only public tweets + profile.
4. Generate claimable public page `/@handle` + optional self-host static ZIP.
5. OAuth claim to verify ownership before public publish.
6. Clear "snapshot as of DATE" + irreversible index warning.

## Axes
- Low friction (official ZIP)
- Full fidelity (complete history)
- High indexability (static HTML + JSON-LD)
- Low legal risk (user-owned data + consent)
- Cheap scale (text-first)
- Longevity (versioned + self-host export)
- Trust (claim/delete/warn)

## Status
MVP in progress. Parser + static page generator below.

See `/parser` and `/generator`.

License: MIT. User data remains theirs.
