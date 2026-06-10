# Deploying TestPsychometric to testpsychometric.com (via Cloudflare)

The app is a Next.js (Node) server with a **SQLite database** and **local file uploads**,
so it needs a host with a **persistent filesystem** and a long-running Node process.
Cloudflare sits in front for DNS, proxy and SSL:

```
Browser → Cloudflare (DNS + proxy + HTTPS) → your origin server (Next.js :3000)
```

> It cannot run on Cloudflare Pages/Workers as-is (no persistent SQLite / uploads there).
> If Cloudflare-only hosting is a hard requirement later, it means migrating the DB to
> Cloudflare **D1** and uploads to **R2** — a separate project.

---

## Option A — VPS (recommended: Ubuntu 22.04, ~1GB RAM is enough)

### 1. Install runtime
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm i -g pm2
```

### 2. Get the code + persistent data dir
```bash
sudo mkdir -p /var/data/testpsychometric          # DB + uploads live here (persists across deploys)
sudo chown -R $USER /var/data/testpsychometric
# copy the project to /opt/testpsychometric (git clone, scp, or rsync)
cd /opt/testpsychometric
```

### 3. Configure env
```bash
cp .env.production.example .env
nano .env       # set JWT_SECRET (openssl rand -hex 48), DATABASE_URL=/var/data/..., Razorpay keys
# Point uploads at the persistent disk so files survive redeploys:
ln -s /var/data/testpsychometric/uploads ./uploads   # or set the folder on the volume
mkdir -p /var/data/testpsychometric/uploads
```

### 4. Build + initialise DB (first deploy only) + start
```bash
npm ci
npm run build
npm run setup            # FIRST TIME ONLY: creates DB + seeds. Re-deploys: skip (use `npx prisma db push`)
pm2 start ecosystem.config.js
pm2 save && pm2 startup  # run the printed command so it survives reboots
```
The app now listens on `127.0.0.1:3000`.

### 5. Nginx reverse proxy + Cloudflare Origin Certificate (SSL Full strict)
- In Cloudflare → **SSL/TLS → Origin Server → Create Certificate**. Save the cert to
  `/etc/ssl/cf/testpsychometric.pem` and key to `/etc/ssl/cf/testpsychometric.key`.
- Create `/etc/nginx/sites-available/testpsychometric`:
```nginx
server {
  listen 443 ssl;
  server_name testpsychometric.com www.testpsychometric.com;
  ssl_certificate     /etc/ssl/cf/testpsychometric.pem;
  ssl_certificate_key /etc/ssl/cf/testpsychometric.key;
  client_max_body_size 10M;            # allow document/QR/screenshot uploads
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-For $remote_addr;
  }
}
server { listen 80; server_name testpsychometric.com www.testpsychometric.com; return 301 https://$host$request_uri; }
```
```bash
sudo ln -s /etc/nginx/sites-available/testpsychometric /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 6. Cloudflare DNS + SSL
- **DNS** → add an **A record**: `testpsychometric.com` → your server's public IP, **Proxied (orange cloud)**. Add `www` the same way (or a CNAME to root).
- **SSL/TLS → Overview** → set mode to **Full (strict)**.
- (Optional) **Always Use HTTPS** = On.

Visit https://testpsychometric.com 🎉

### Redeploys (after the first time)
```bash
cd /opt/testpsychometric && git pull   # or rsync new files
npm ci && npm run build
npx prisma db push                      # apply any schema changes (NO --force-reset in prod!)
pm2 reload testpsychometric
```

---

## Option B — Render / Railway / Fly.io (Docker + persistent disk)
1. Push this repo to GitHub.
2. Create a new **Web Service** from the repo (it auto-detects the `Dockerfile`).
3. Add a **persistent disk/volume** mounted at **`/data`** (for the DB) and **`/app/uploads`** (for files).
4. Set env vars from `.env.production.example` (`DATABASE_URL=file:/data/app.db`, `JWT_SECRET`, Razorpay…).
5. Deploy. Then point Cloudflare **CNAME** `testpsychometric.com` → the platform host, **Proxied**, SSL **Full (strict)**.

---

## ✅ Production checklist (do these before going live)
- [ ] Set a strong `JWT_SECRET` (`openssl rand -hex 48`).
- [ ] **Change/remove the demo logins** — the seed creates demo accounts:
      `admin@mindmetric.in/admin123`, `DEMO01/school123`, `CORP01/company123`,
      `user@demo.in/user123`, `AC001/centre123`. Create your real Super Admin and delete the demos.
- [ ] Add Razorpay **LIVE** keys (or leave blank to keep cash/UPI-QR + offline only).
- [ ] Upload the real **payment QR + UPI ID** in Admin → Payment Settings.
- [ ] Confirm `DATABASE_URL` and `uploads/` are on the **persistent** volume.
- [ ] Back up `app.db` + `uploads/` regularly (e.g. nightly cron copy / volume snapshot).
- [ ] `client_max_body_size`/upload limit ≥ 5–10 MB (set in Nginx above).
