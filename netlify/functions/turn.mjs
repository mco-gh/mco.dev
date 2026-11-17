// GET /api/turn: short-lived TURN relay credentials for the peer-to-peer apps
// (BG, Chess, Talk). When two browsers can't connect directly (mobile data,
// strict routers, browsers that block local connections), Cloudflare's TURN
// service relays the traffic between them.
//
// The Cloudflare TURN key stays here on the server; browsers only ever see
// credentials that expire. Set two environment variables in Netlify
// (Site configuration > Environment variables):
//   CLOUDFLARE_TURN_KEY_ID     the TURN key's ID
//   CLOUDFLARE_TURN_API_TOKEN  the TURN key's API token
// Without them this returns 503 and the apps fall back to direct connections.

const TTL = 12 * 60 * 60;   // seconds; longer than any game or call

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export default async (req) => {
  // Only hand credentials to pages on this site. Browsers set this header;
  // it keeps other sites from quietly borrowing the relay.
  const site = req.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin') return json({ error: 'forbidden' }, 403);

  const keyId = process.env.CLOUDFLARE_TURN_KEY_ID;
  const token = process.env.CLOUDFLARE_TURN_API_TOKEN;
  if (!keyId || !token) return json({ error: 'TURN is not configured' }, 503);

  const res = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${keyId}/credentials/generate-ice-servers`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ttl: TTL }),
  });
  if (!res.ok) {
    console.error('Cloudflare TURN:', res.status, await res.text());
    return json({ error: 'TURN credentials unavailable' }, 502);
  }
  const { iceServers } = await res.json();

  // Browsers block port 53, so a URL on it would only make them wait for a timeout.
  const servers = [].concat(iceServers ?? [])
    .map((s) => ({ ...s, urls: [].concat(s.urls).filter((u) => !/:53(\?|$)/.test(u)) }))
    .filter((s) => s.urls.length);
  return json({ iceServers: servers });
};

export const config = { path: '/api/turn' };
