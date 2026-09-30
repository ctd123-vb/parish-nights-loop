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
- Loading screen: staged messages (0-2s, 2-6s, 6-12s, 12s+), easing progress bar, rotating practice tips, and Try again / Pick another video after 12s. Buffering pill during playback. Reuse this for any slow step.
- Settings at the top of the script: `OFFLINE_APP_URL` (set to `/phone/`), `LINK_RESOLVER_URL` (empty for now).

## Known limits (confirmed in real testing)
- Some YouTube videos refuse to play outside YouTube (error 101/150). This is set per video by the owner or music label. Not a bug.
- Short TikTok links from the app (vm.tiktok.com, tiktok.com/t/...) fail. They need a server to follow the redirect.
- TikTok sound may stay off on iPhone when playback starts outside TikTok's player.
- Rep count is intentionally NOT shown on the video. It lives in the loop panel.

## Roadmap (only when the owner asks)
1. Netlify Function to resolve short TikTok links (only follows redirects, never downloads). Point `LINK_RESOLVER_URL` at it.
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
