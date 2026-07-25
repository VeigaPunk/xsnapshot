/**
 * Pure JS parser for X/Twitter official archive YTD format (2025-2026).
 * Handles window.YTD.tweets.partN / tweet.partN, profile, account.
 * Strict public-tweets + public profile only. Never surfaces email or DMs.
 */

function stripYTD(content) {
  let cleaned = content.replace(/^\s*window\.YTD\.[\w.]+\.part\d+\s*=\s*/i, '');
  cleaned = cleaned.replace(/;\s*$/, '').trim();
  return cleaned;
}

function parseYTDFile(content) {
  const cleaned = stripYTD(content);
  try {
    const data = JSON.parse(cleaned);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    try {
      return JSON.parse(cleaned.replace(/,\s*([}\]])/g, '$1'));
    } catch (e2) {
      console.error('JSON parse failed', e2.message);
      return [];
    }
  }
}

function extractPublicTweets(rawItems) {
  return rawItems
    .map(item => {
      const t = item.tweet || item;
      if (!t || !(t.id_str || t.id)) return null;
      const entities = t.entities || {};
      const mediaSrc = (t.extended_entities && t.extended_entities.media) || entities.media || [];
      return {
        id: String(t.id_str || t.id),
        text: t.full_text || t.text || '',
        created_at: t.created_at || null,
        lang: t.lang || null,
        source: t.source || null,
        in_reply_to_status_id: t.in_reply_to_status_id_str || null,
        in_reply_to_user_id: t.in_reply_to_user_id_str || null,
        retweeted: !!(t.retweeted_status_id_str || t.retweeted),
        is_quote_status: !!t.is_quote_status,
        entities: {
          hashtags: (entities.hashtags || []).map(h => h.text),
          mentions: (entities.user_mentions || []).map(m => ({
            id: m.id_str,
            screen_name: m.screen_name,
            name: m.name
          })),
          urls: (entities.urls || []).map(u => ({
            url: u.url,
            expanded: u.expanded_url,
            display: u.display_url
          }))
        },
        media: mediaSrc.map(m => ({
          id: m.id_str,
          type: m.type,
          url: m.media_url_https || m.media_url || null,
          expanded_url: m.expanded_url || null
        }))
      };
    })
    .filter(t => t && t.id && t.text);
}

function extractAccount(rawItems) {
  if (!rawItems || !rawItems.length) return null;
  const a = (rawItems[0].account || rawItems[0]);
  if (!a) return null;
  return {
    username: a.username || null,
    accountId: a.accountId || a.id || null,
    createdAt: a.createdAt || a.created_at || null
  };
}

function extractProfile(rawItems) {
  if (!rawItems || !rawItems.length) return null;
  const p = (rawItems[0].profile || rawItems[0]);
  if (!p) return null;
  const desc = p.description || {};
  return {
    name: p.name || p.accountDisplayName || null,
    description: (typeof desc === 'string' ? desc : (desc.bio || '')) || p.bio || '',
    location: (p.location && (p.location.location || p.location)) || '',
    website: p.website || (desc.website) || p.url || null,
    avatar: p.avatarMediaUrl || (p.avatar && p.avatar.mediaUrl) || null,
    banner: p.headerMediaUrl || null
  };
}

function buildSnapshot(files) {
  let allRaw = [];
  Object.keys(files).forEach(name => {
    if (/tweet/i.test(name) && !/note/i.test(name) && !/community/i.test(name) && !/deleted/i.test(name)) {
      allRaw = allRaw.concat(parseYTDFile(files[name]));
    }
  });
  const tweets = extractPublicTweets(allRaw);
  tweets.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const account = files['account.js'] ? extractAccount(parseYTDFile(files['account.js'])) : null;
  const profile = files['profile.js'] ? extractProfile(parseYTDFile(files['profile.js'])) : null;

  return {
    snapshot_date: new Date().toISOString().slice(0, 10),
    account,
    profile: Object.assign({}, profile || {}, account ? { screen_name: account.username, id: account.accountId } : {}),
    tweets,
    tweet_count: tweets.length
  };
}

module.exports = {
  stripYTD,
  parseYTDFile,
  extractPublicTweets,
  extractAccount,
  extractProfile,
  buildSnapshot
};
