# Parish Nights Loop Practice

Mobile-first tool for dancers in Parish Nights (a weekly country swing dance community in Lafayette, LA).
Dancers loop a section of a dance video (A/B points), slow it down, mirror it, and repeat it.
The owner is not a developer and works from his phone. Keep changes small, tested, and deployed for him.

## What's here (already built and working, do not rebuild)
- `index.html` = ONLINE app. Paste a YouTube or TikTok link. Single self-contained file (HTML + CSS + JS).
- `phone/index.html` = PHONE app. Picks a video file from the phone. Plays locally, nothing uploaded. Can export the loop as a clip.
- Both share one design: Zilla Slab + Atkinson Hyperlegible, denim blue + gold, big touch targets, light/dark mode.

## Online app: how it works
- YouTube: official IFrame Player API. Full features (loop, 25/50/75/100% speed, mirror, volume).
- TikTok: official embed player v1 (tiktok.com/player/v1/ID) controlled by postMessage.
  It only supports play, pause, seekTo, mute/unMute. No speed control, so no slow motion.
- Instagram: not supported. Shows a message pointing to the phone app.
- Share links hold all state in the URL, no database: `?yt=ID` or `?tt=ID`, plus `a`, `b` (seconds), `s` (speed), `m=1` (mirror), `n` (loop name).
- Saved loops, recent videos, and preferences live in localStorage.
- Loading screen (TikTok): spinning record with floating notes, steady title ("usually takes 2 to 3 minutes"), striped
  progress bar, "About X left", a headline, then rotating dad jokes, fun facts, trivia, and brain teasers. YouTube (class
  `ld-short`) shows only the title and bar, because its box is short and it loads in seconds.
  - Content lives in `JOKES` + `FUN_NEW` (about 360 items). Facts must be true; leave one out if unsure. Family friendly.
    Kinds and timing in `FUN_KINDS` (answer shows after `reveal` seconds). Practice tips (`TIPS`) hidden (owner asked).
  - `FUN_ORDER` is one fixed shuffled order, the same on every phone. The Netlify Function `fun-next` (Netlify Blobs
    counter) hands each loading screen the next 15 spots, so different phones rarely see the same item. Each phone also
    skips items it has seen (`pnOnline:funSeen`). If the function fails, a random start is used.
  - Timing is fixed in `LOAD`: TikTok expects 180s, Try again at 150s, fallback "ready" at 210s. YouTube help at 12s.
    Don't time TikTok's "ready" message: it arrives before the video can really play.
  - Bar: nearly steady, a bit faster near the end, 92% at the expected time, then creeps to 97%. Stripes drift backward
    (feels faster). Jumps to 100% on ready and holds 0.4s before the video shows.
  - First play on TikTok waits 7s (vs 2.5s) before the "Tap the video" tip. Buffering pill during playback.
- TikTok slow motion: not possible with TikTok's embed. The speed note points people to save the video and use `/phone/`.
- Settings at the top of the script: `OFFLINE_APP_URL` (set to `/phone/`), `LINK_RESOLVER_URL` (`/.netlify/functions/resolve-link`).

## Known limits (confirmed in real testing)
- Some YouTube videos refuse to play outside YouTube (error 101/150). This is set per video by the owner or music label. Not a bug.
- Short TikTok links from the app (vm.tiktok.com, vt.tiktok.com, tiktok.com/t/...) go through the Netlify Function
  `netlify/functions/resolve-link.mjs` (repo root). It only follows redirects on tiktok.com hosts, never downloads.
- TikTok sound may stay off on iPhone when playback starts outside TikTok's player.
- Rep count is intentionally NOT shown on the video. It lives in the loop panel.

## Roadmap (only when the owner asks)
1. DONE: Netlify Function to resolve short TikTok links (see Known limits).
2. Apify backend (Netlify Function) that returns a playable video file URL for TikTok and Instagram links,
   so the app can play them in its own <video> player with slow motion. Store the key as the `APIFY_TOKEN` env var, never in code.
   Show the loading screen with honest stages while Apify works. Owner knows this is against TikTok/Instagram terms and may break.
3. Merge both apps into one: paste a link OR pick a file.

## Rules
- UI copy: plain words, 7th to 8th grade reading level, no em dashes.
- Don't redesign. Match the existing look and components.
- Test on a narrow phone viewport before deploying. Check both apps still load.
- Deploy to production on Netlify (project `parish-nights-loop`) after every change and give the owner the live link.
- Netlify visitor access currently requires a Netlify team login. Turn it off only when the owner says to share with dancers.
