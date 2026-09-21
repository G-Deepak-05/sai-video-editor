# Saikumar — Video Editor Portfolio

Next.js 16 · React · TypeScript · Tailwind v4 · Motion · Lenis

## Develop
```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build && npm start
```

## Where to edit content
- `lib/site.ts` — contact details (email / Instagram / WhatsApp), services, tools & AI tools, testimonials. Empty values hide their UI.
- `lib/projects.ts` — portfolio videos. Set `src` to a CDN video URL (R2, Bunny, Mux, S3…) to replace the Drive embed.
- `public/work/` — 8s muted previews + posters. `public/logos/` — tool logos.

## Deploy on Netlify
1. Push to GitHub (`git push -u origin feature/initial_draft`, or merge to `main`).
2. Netlify → **Add new site → Import an existing project** → pick the repo and the branch to deploy.
   Build settings come from `netlify.toml` (`npm run build`, Node 22); the Next.js runtime is auto-detected.
3. **Site configuration → Environment variables**: add `NEXT_PUBLIC_SITE_URL` = your final URL (e.g. `https://saikumar.netlify.app` or your custom domain, no trailing slash). Trigger a redeploy after changing it.
4. Optional: **Domain management → Add custom domain**, then update `NEXT_PUBLIC_SITE_URL`.

### After it's live
- Open the site on a phone; check the loader, menu, scroll reel and project viewer.
- Confirm `/robots.txt`, `/sitemap.xml` and the social preview (paste the URL into a link previewer) use the live domain.
- Full project videos currently play from Google Drive embeds. The Drive folder must stay shared as "Anyone with the link". For heavier traffic, host them on a video CDN and set `src` per project in `lib/projects.ts`.
