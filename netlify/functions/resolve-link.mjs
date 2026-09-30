// Follows a short TikTok link (vm.tiktok.com, vt.tiktok.com, tiktok.com/t/...) to the full video link.
// Only follows redirects. Never downloads the video.
// GET /.netlify/functions/resolve-link?url=<short link>  ->  { url: "https://www.tiktok.com/@user/video/123" }

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const MAX_HOPS = 6;

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json', 'cache-control': status === 200 ? 'public, max-age=86400' : 'no-store' },
});

const isTikTok = (u) => u.protocol === 'https:' && /(^|\.)tiktok\.com$/.test(u.hostname.toLowerCase());

// Pull the video ID out of any TikTok URL shape we have seen.
function videoUrl(u) {
  const m = u.pathname.match(/\/(?:video|v|embed(?:\/v2)?)\/(\d{8,25})/);
  if (!m) return null;
  const user = u.pathname.match(/^\/(@[^/]+)\//);
  return 'https://www.tiktok.com/' + (user ? user[1] + '/' : '') + 'video/' + m[1];
}

export default async (req) => {
  let u;
  try { u = new URL(new URL(req.url).searchParams.get('url') || ''); } catch (e) { return json(400, { error: 'bad_url' }); }
  if (!isTikTok(u)) return json(400, { error: 'not_tiktok' });

  for (let hop = 0; hop < MAX_HOPS; hop++) {
    const found = videoUrl(u);
    if (found) return json(200, { url: found });

    let res;
    try {
      res = await fetch(u, { redirect: 'manual', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(6000) });
    } catch (e) { return json(502, { error: 'fetch_failed' }); }

    const loc = res.headers.get('location');
    if (!loc) {
      // Some pages skip the redirect and put the full link in the page itself.
      const body = res.ok ? (await res.text()).slice(0, 500000) : '';
      const m = body.match(/https:\\?\/\\?\/(?:www|m)\.tiktok\.com\\?\/(@[\w.-]+)\\?\/video\\?\/(\d{8,25})/);
      if (m) return json(200, { url: 'https://www.tiktok.com/' + m[1] + '/video/' + m[2] });
      return json(404, { error: 'no_video' });
    }
    let next;
    try { next = new URL(loc, u); } catch (e) { return json(502, { error: 'bad_redirect' }); }
    if (!isTikTok(next)) return json(404, { error: 'left_tiktok' });
    u = next;
  }
  return json(404, { error: 'too_many_redirects' });
};
