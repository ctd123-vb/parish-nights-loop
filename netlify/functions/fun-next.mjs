// Shared place in the loading-screen list (jokes, facts, trivia, teasers), so different phones
// see different items. Each call hands out the next `n` spots and moves the shared counter forward.
// GET /.netlify/functions/fun-next?n=15  ->  { start: 1234 }
import { getStore } from '@netlify/blobs';

export default async (req) => {
  const n = Math.min(40, Math.max(1, parseInt(new URL(req.url).searchParams.get('n'), 10) || 15));
  // Strong reads so the counter always moves forward (default reads can be up to a minute old).
  const store = getStore({ name: 'loading-fun', consistency: 'strong' });
  const start = Number(await store.get('cursor')) || 0;
  await store.set('cursor', String(start + n));
  return new Response(JSON.stringify({ start }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};
