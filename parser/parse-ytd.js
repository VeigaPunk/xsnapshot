/**
 * Pure JS parser for X/Twitter official archive YTD format.
 * Handles window.YTD.tweets.partN = [...] and profile/account.
 * Strict public-tweets focus.
 */

function stripYTD(content) {
  // Remove window.YTD.xxx.partN = 
  let cleaned = content.replace(/^\s*window\.YTD\.\w+\.part\d+\s*=\s*/i, '');
  cleaned = cleaned.replace(/;\s*$/, '').trim();
  return cleaned;
}

function parseYTDFile(content) {
  const cleaned = stripYTD(content);
  try {
    const data = JSON.parse(cleaned);
    return Array.isArray(data) ? data.map(item => item.tweet || item) : [];
  } catch (e) {
    console.error('JSON parse failed', e);
    return [];
  }
}

function extractPublicTweets(tweets) {
  return tweets.map(t => ({
    id: t.id_str || t.id,
    text: t.full_text || t.text || '',
    created_at: t.created_at,
    entities: t.entities || {},
    in_reply_to_status_id: t.in_reply_to_status_id_str || null,
    in_reply_to_user_id: t.in_reply_to_user_id_str || null,
    retweeted: !!(t.retweeted_status_id_str || t.retweeted),
    favorite_count: t.favorite_count || 0,
    retweet_count: t.retweet_count || 0,
    lang: t.lang || null,
    source: t.source || null,
    // media urls only, no files
    media: (t.extended_entities && t.extended_entities.media) || (t.entities && t.entities.media) || []
  })).filter(t => t.id && t.text);
}

// Example usage in Node or browser:
// const tweets = extractPublicTweets(parseYTDFile(fs.readFileSync('tweets.js', 'utf8')));

module.exports = { stripYTD, parseYTDFile, extractPublicTweets };
