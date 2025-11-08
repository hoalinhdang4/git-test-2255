# 🚀 Deploy lên Vercel - Hướng dẫn chi tiết

## 📋 Phương pháp 1: Deploy qua Vercel CLI (Recommended)

### Bước 1: Cài đặt Vercel CLI

```bash
npm install -g vercel
```

### Bước 2: Login Vercel

```bash
vercel login
```

### Bước 3: Deploy

```bash
# Deploy lần đầu (preview)
vercel

# Deploy production
vercel --prod
```

✅ **Vercel sẽ tự động:**
1. Chạy `npm install`
2. Chạy `npm run vercel-build` (obfuscate JS)
3. Deploy thư mục `dist/`
4. Cấp cho bạn URL: `https://your-project.vercel.app`

---

## 📋 Phương pháp 2: Deploy qua GitHub

### Bước 1: Push code lên GitHub

```bash
# Khởi tạo git (nếu chưa có)
git init
git add .
git commit -m "Initial commit"

# Push lên GitHub
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

### Bước 2: Import vào Vercel

1. Vào https://vercel.com/new
2. Import repository từ GitHub
3. Vercel tự động detect settings
4. Click **Deploy**

✅ **Auto deploy:** Mỗi lần push code, Vercel tự động build & deploy!

---

## 📋 Phương pháp 3: Deploy thư mục dist/ trực tiếp

### Bước 1: Build local

```bash
# Windows
build.bat

# Linux/Mac
./build.sh

# NPM
npm run build
```

### Bước 2: Deploy dist/

```bash
cd dist
vercel --prod
```

---

## ⚙️ Cấu hình Vercel

### File `vercel.json` (đã có sẵn)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "rewrites": [
    {
      "source": "/",
      "destination": "/index.html"
    },
    {
      "source": "/robot",
      "destination": "/index.html"
    },
    {
      "source": "/required",
      "destination": "/required.html"
    }
  ]
}
```

### Build Settings Vercel

```
Build Command: npm run vercel-build
Output Directory: dist
Install Command: npm install
```

---

## 🌐 URLs sau khi deploy

```
https://your-project.vercel.app          → index.html (robot check)
https://your-project.vercel.app/robot    → index.html (robot check)
https://your-project.vercel.app/required → required.html (form)
```

---

## 🔧 Troubleshooting

### ❌ Lỗi: "Cannot find module"

**Giải pháp:**
```bash
# Đảm bảo dependencies là "dependencies" không phải "devDependencies"
# Check package.json
```

### ❌ Lỗi: 404 Not Found

**Giải pháp:**
1. Check `vercel.json` có đúng không
2. Verify build output trong `dist/`
3. Check Vercel logs: `vercel logs`

### ❌ Lỗi: Build failed

**Giải pháp:**
```bash
# Test build local trước
npm install
npm run vercel-build

# Check errors
```

### ❌ JS/CSS không load

**Giải pháp:**
- Verify paths trong HTML là relative: `./public/...`
- Check browser console (F12)
- Clear cache và reload

---

## 🎯 Best Practices

### 1. Environment Variables (Config)

Nếu muốn hide Telegram tokens:

1. Vào Vercel Dashboard → Settings → Environment Variables
2. Add:
   ```
   TELEGRAM_BOT_TOKEN=your_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   ```
3. Update `config.js` để đọc từ env (optional)

### 2. Custom Domain

1. Vercel Dashboard → Domains
2. Add domain của bạn
3. Update DNS records:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### 3. Monitoring

- Vercel Analytics: Track visitors
- Vercel Logs: Debug errors
- Real-time deployment logs

---

## 📝 Workflow với Vercel

### Development
```bash
# Edit code
# Test local
```

### Build & Test Local
```bash
npm run build
# Test dist/
```

### Deploy
```bash
# Option 1: CLI
vercel --prod

# Option 2: Git push (auto deploy)
git add .
git commit -m "Update"
git push
```

---

## 🚀 Quick Commands

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# Check logs
vercel logs

# Open in browser
vercel open

# List deployments
vercel ls

# Remove project
vercel remove
```

---

## ✨ Advanced: Múltiple Environments

### Preview (Staging)
```bash
git push origin develop
# Auto deploy to preview URL
```

### Production
```bash
git push origin main
# Auto deploy to production
```

---

## 📊 Vercel Features

✅ **Free tier bao gồm:**
- Unlimited deployments
- SSL certificate (HTTPS)
- Global CDN
- Auto scaling
- Git integration
- Custom domains (100)
- 100GB bandwidth/month
- Analytics

---

## 🎉 Done!

Deploy thành công! Website của bạn đã live trên Vercel!

**Next steps:**
- [ ] Add custom domain
- [ ] Setup analytics
- [ ] Monitor deployment logs
- [ ] Update content as needed

---

**Links:**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

