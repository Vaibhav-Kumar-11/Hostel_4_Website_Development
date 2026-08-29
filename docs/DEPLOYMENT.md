# Deployment

The production build is a folder of static files. There is no server to run, no database to provision and no environment variable to set.

```bash
npm run build
```

Output lands in `dist/`.

---

## The one thing that makes this portable

The same `dist/` folder works unchanged at:

- `https://hostel4.vercel.app/`
- `https://gymkhana.iitb.ac.in/~hostel4/`
- `https://username.github.io/Hostel_4_Website_Development/`
- `file:///D:/dist/index.html`

Two deliberate choices make that true:

**1. Relative asset paths.** `vite.config.ts` sets `base: './'`, so every script, stylesheet and image is referenced relative to `index.html`. The bundle does not know or care what path it is served from.

**2. Hash routing.** URLs look like `/#/events`. The part after `#` never reaches the web server — the browser resolves it. This matters most on the institute host: an Apache user directory (`~hostel4/`) does not let us add `.htaccess` rewrite rules, so with normal history routing a resident who refreshed on `/events` would get a 404 from Apache. With hash routing every deep link survives a refresh, everywhere, with zero server configuration.

---

## Institute server — `gymkhana.iitb.ac.in/~hostel4/`

This is the target host for the winning entry.

### Steps

1. Build:

   ```bash
   npm run build
   ```

2. Copy **the contents of `dist/`** — not the folder itself — into the hostel account's `public_html` directory.

   Using `scp`:

   ```bash
   scp -r dist/* hostel4@gymkhana.iitb.ac.in:~/public_html/
   ```

   Using `rsync` (better for repeat deploys — only sends what changed, and `--delete` clears out old hashed asset files):

   ```bash
   rsync -avz --delete dist/ hostel4@gymkhana.iitb.ac.in:~/public_html/
   ```

3. Check permissions if the server returns 403 — Apache user directories usually need the home directory executable and the web files readable:

   ```bash
   chmod 711 ~ && chmod -R 755 ~/public_html
   ```

4. Visit <https://gymkhana.iitb.ac.in/~hostel4/>.

### Nothing else is required

No `.htaccess`. No rewrite rules. No Node runtime on the server. No build step on the server.

### After going live

Update two values so links and SEO point at the real address:

- `src/data/site.ts` → `canonicalUrl`
- `public/robots.txt` → the `Sitemap:` line

---

## Vercel

1. Import the GitHub repository at <https://vercel.com/new>.
2. Vercel detects Vite. Confirm the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
3. Deploy.

Every push to `main` redeploys automatically, and pull requests get preview URLs.

---

## Netlify

Either connect the repository at <https://app.netlify.com/start> with build command `npm run build` and publish directory `dist`, or drag the `dist` folder onto <https://app.netlify.com/drop> for an instant deploy with no account setup.

---

## GitHub Pages

The repository includes `.github/workflows/deploy.yml`, which builds and publishes on every push to `main`.

To turn it on: **Settings → Pages → Build and deployment → Source → GitHub Actions**.

The site then serves from `https://<username>.github.io/<repository>/`. The relative base and hash routing mean the project sub-path needs no special handling, and `public/.nojekyll` stops GitHub from stripping asset folders.

---

## Verifying a deployment

Worth checking each time, in this order:

1. **Homepage loads** and the hero photograph appears.
2. **Deep link works** — open `<url>/#/events` directly in a new tab, then hit refresh. It must not 404.
3. **Images resolve** — open `/life` and confirm the reading room, gym and sports room photos load.
4. **Theme toggle** works and survives a reload.
5. **Mobile** — open it on a phone; check the drawer and that nothing scrolls sideways.
6. **Maintenance button** opens the CLR ticket system in a new tab.
7. **⌘K** opens the command palette.

---

## Troubleshooting

**Blank page, console shows 404s for `/assets/…`**
The build was made with an absolute base. Confirm `base: './'` in `vite.config.ts` and rebuild.

**Images missing on the institute server, fine locally**
An image path starts with a leading slash somewhere in `src/data/`. Paths must be relative — `images/hostel/gym.jpg`, not `/images/hostel/gym.jpg`.

**403 Forbidden from the institute server**
Permissions. See step 3 above.

**A deep link 404s**
Something is using history routing. Confirm `HashRouter` in `src/App.tsx` — URLs must contain `#`.

**Styles missing after a CI build**
Tailwind resolves its content globs from the config file's own directory (see `tailwind.config.js`) and PostCSS is pointed at an absolute config path (see `postcss.config.js`). Both are deliberate so the build produces identical CSS regardless of the working directory it is invoked from. If you move either file, update those paths.

**Build fails with a type error**
Read the message — it names the file and line. It is almost always a typo in a `src/data/` file. See [CONTENT_GUIDE.md](CONTENT_GUIDE.md).
