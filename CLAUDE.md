# Repo guide

The app lives in `site/`. Read `site/CLAUDE.md` first. It explains what is built and what not to rebuild.

## Workflow for every change
1. Edit files in `site/`. Don't redesign. Don't start the Apify backend unless the owner asks.
2. Test on a phone-size screen (about 390x844) with Playwright. Check both `/` and `/phone/` load.
3. Commit and push.
4. Deploy: `netlify deploy --prod --dir=site --site 4f9eb630-6f72-4b23-87ff-28584f2ecefc`
   (needs `NETLIFY_AUTH_TOKEN` env var and network access to Netlify).
5. Send the owner the live link (https://parish-nights-loop.netlify.app) and a short plain-English summary.
