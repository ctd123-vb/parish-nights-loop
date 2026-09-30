# Repo guide

The app lives in `site/`. Read `site/CLAUDE.md` first. It explains what is built and what not to rebuild.

## Workflow for every change
1. Edit files in `site/`. Don't redesign. Don't start the Apify backend unless the owner asks.
2. Test on a phone-size screen (about 390x844) with Playwright. Check both `/` and `/phone/` load.
3. Commit and push.
4. Deploy (needs `NETLIFY_AUTH_TOKEN` and network access to Netlify; install the CLI with `npm i -g netlify-cli`):
   `NODE_USE_ENV_PROXY=1 netlify link --id 4f9eb630-6f72-4b23-87ff-28584f2ecefc`
   `NODE_USE_ENV_PROXY=1 netlify deploy --prod --no-build --dir=site`
   (`NODE_USE_ENV_PROXY=1` makes the CLI use the sandbox proxy. `--no-build` skips a build step this site doesn't need.
   Don't pass `--site` to deploy; it fails with "Project not found". Link once per session instead.
   `netlify.toml` also deploys the functions in `netlify/functions/`.)
5. Send the owner the live link (https://parish-nights-loop.netlify.app) and a short plain-English summary.
