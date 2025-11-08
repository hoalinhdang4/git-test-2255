# ⚡ Quick Start - Deploy in 5 Minutes!

## 🎯 Mục tiêu
Build và deploy website lên internet trong **5 phút**!

---

## 📋 Bước 1: Chuẩn bị (2 phút)

### Option A: Không cần cài đặt gì (Windows)
✅ Bạn đã sẵn sàng! Skip xuống Bước 2.

### Option B: Có Node.js
```bash
# Cài dependencies (chỉ 1 lần)
npm install -g terser javascript-obfuscator
```

---

## 🔨 Bước 2: Build Production (1 phút)

### Windows
```bash
# Double click hoặc chạy trong CMD
build.bat
```

### Linux/Mac
```bash
chmod +x build.sh
./build.sh
```

### Kết quả
✅ Thư mục `dist/` đã được tạo với code đã obfuscate!

---

## 🚀 Bước 3: Deploy (2 phút)

### Cách 1: Netlify Drop (Dễ nhất - Miễn phí)

1. Mở: https://app.netlify.com/drop
2. Kéo thả thư mục `dist/` vào
3. ✅ **DONE!** Nhận ngay URL như: `https://random-name.netlify.app`

### Cách 2: Vercel (Miễn phí)

```bash
npm install -g vercel
cd dist
vercel --prod
```

### Cách 3: cPanel Hosting

1. Login cPanel → File Manager
2. Vào `public_html/`
3. Upload toàn bộ trong `dist/`
4. ✅ Truy cập: `https://yourdomain.com/robot.html`

---

## ✅ Xong! Test ngay

```
https://your-url/robot.html
```

---

## 🔧 Cấu hình (Optional)

### Thay đổi Telegram Bot

Edit file `public/js/config.js`:
```javascript
const CONFIG = {
    TELEGRAM_BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',
    TELEGRAM_CHAT_ID: 'YOUR_CHAT_ID_HERE',
    // ...
};
```

Sau đó build lại:
```bash
build.bat
```

---

## 📝 Workflow

```
1. Edit code → 2. Build → 3. Test dist/ → 4. Deploy
     ⬇️           ⬇️          ⬇️            ⬇️
  public/js/   build.bat   Open dist/   Upload dist/
```

---

## 📚 Đọc thêm

- **BUILD_GUIDE.md** - Chi tiết về build process
- **DEPLOY_GUIDE.md** - Hướng dẫn deploy nhiều platforms
- **README.md** - Tài liệu tổng quan
- **MINIFY_GUIDE.md** - Chi tiết minify/obfuscate

---

## 🎯 Quick Commands

```bash
# Build production
build.bat                    # Windows
./build.sh                   # Linux/Mac

# Build options
build-minify.bat            # Minify only (smaller, faster)
build.bat                   # Obfuscate (secure, recommended)

# NPM
npm run build               # Obfuscate
npm run build:minify        # Minify only
npm run clean               # Clean dist/
```

---

## 🐛 Troubleshooting

### Build không chạy
```bash
# Cài global packages
npm install -g terser javascript-obfuscator

# Hoặc local
npm install
```

### File không có trong dist/
- Check file có trong source chưa
- Xem build logs để check errors

### Deploy lỗi
- Test local trong `dist/` trước
- Check browser console (F12)
- Verify paths trong HTML

---

## ✨ Pro Tips

1. 🎯 **Luôn test trong `dist/` trước khi deploy**
2. 🔒 **Dùng obfuscate cho production** (build.bat)
3. 🚀 **Deploy lên Netlify miễn phí** nhanh nhất
4. 📝 **Backup code gốc**, không edit code trong dist/
5. 🔄 **Rebuild sau mỗi thay đổi**

---

## 🎉 Done!

Chúc mừng! Website của bạn đã live! 🚀

**Next steps:**
- Custom domain (optional)
- Monitor Telegram notifications
- Update content as needed

---

Need help? Check other guides:
- **BUILD_GUIDE.md** - Build details
- **DEPLOY_GUIDE.md** - Deploy platforms
- **README.md** - Full documentation

