# 🚀 Build & Deployment Guide

## 📋 Tổng quan

Project này có hệ thống build tự động để tạo bản production sẵn sàng deploy trong thư mục `dist/`.

## 🛠️ Cài đặt Dependencies

```bash
npm install
```

Hoặc cài đặt global:
```bash
npm install -g terser javascript-obfuscator
```

## 🔨 Build Commands

### Option 1: Windows (Dễ nhất)

#### Build với Obfuscate (Recommended)
```bash
# Double click hoặc chạy
build.bat
```

#### Build với Minify only (Nhẹ hơn)
```bash
# Double click hoặc chạy
build-minify.bat
```

### Option 2: Linux/Mac

```bash
# Cho phép execute
chmod +x build.sh

# Build với obfuscate
./build.sh
```

### Option 3: NPM Scripts

```bash
# Build với obfuscate (default)
npm run build

# Build với minify only
npm run build:minify

# Xóa folder dist
npm run clean
```

### Option 4: Node.js Script

```bash
# Build với obfuscate
node build.js --obfuscate

# Build với minify
node build.js --minify
```

## 📁 Cấu trúc Output

Sau khi build, thư mục `dist/` sẽ có cấu trúc:

```
dist/
├── required.html           # Trang chính
├── robot.html             # Trang reCAPTCHA
├── build-info.json        # Thông tin build
└── public/
    ├── js/
    │   ├── config.js      # Processed (minified/obfuscated)
    │   ├── utils.js       # Processed
    │   ├── modal.js       # Processed
    │   └── app.js         # Processed
    ├── styles/
    │   ├── checkbox.css
    │   └── style.css
    ├── meta/              # Images cho meta
    ├── fonts/             # Fonts
    └── *.png, *.svg       # Assets
```

## 🚀 Deploy

### Deploy toàn bộ thư mục dist

```bash
# Upload toàn bộ nội dung trong dist/ lên server
# Ví dụ với FTP, SSH, hoặc hosting service
```

### Các nền tảng phổ biến:

#### 1. **Netlify**
```bash
# Drag & drop thư mục dist/ vào Netlify
# Hoặc:
netlify deploy --dir=dist --prod
```

#### 2. **Vercel**
```bash
vercel --prod
# Chọn dist/ làm output directory
```

#### 3. **GitHub Pages**
```bash
# Push nội dung dist/ lên branch gh-pages
git subtree push --prefix dist origin gh-pages
```

#### 4. **cPanel / Traditional Hosting**
- Upload toàn bộ nội dung trong `dist/` vào thư mục `public_html/`
- Access qua domain của bạn

#### 5. **AWS S3**
```bash
aws s3 sync dist/ s3://your-bucket-name/ --delete
```

## 📝 Checklist trước khi Deploy

- [ ] Đã build production version
- [ ] Đã test trong thư mục dist/
- [ ] Đã kiểm tra console không có lỗi
- [ ] Đã update config (Telegram token, etc.)
- [ ] Đã test trên nhiều browsers
- [ ] Đã test trên mobile

## 🔧 Workflow Build-Deploy

### Development
```bash
# Làm việc với code gốc
# Edit files trong: public/js/, required.html, etc.
```

### Testing Local
```bash
# Test code gốc trước
# Mở required.html hoặc robot.html trong browser
```

### Build Production
```bash
# Windows
build.bat

# Linux/Mac
./build.sh

# Hoặc NPM
npm run build
```

### Test Production Build
```bash
# Test trong thư mục dist/
# Mở dist/required.html trong browser
# Kiểm tra kỹ mọi chức năng
```

### Deploy
```bash
# Upload thư mục dist/ lên server
```

## ⚙️ Cấu hình Build

### Minify Options
- Compress: `-c`
- Mangle: `-m`
- Tool: Terser

### Obfuscate Options
- `--compact true` - Nén code
- `--control-flow-flattening true` - Rối control flow
- `--dead-code-injection true` - Inject dead code
- `--string-array true` - Mã hóa strings
- `--string-array-encoding base64` - Encode strings
- `--unicode-escape-sequence true` - Escape unicode

## 🔄 Rebuild

Nếu có thay đổi code:

1. Edit file gốc trong `public/js/`
2. Chạy lại build script
3. Test trong `dist/`
4. Deploy lại

## 📊 So sánh Build Types

| Feature | Minify | Obfuscate |
|---------|--------|-----------|
| File size | Nhỏ hơn (~50%) | Lớn hơn (~200%) |
| Speed | Nhanh hơn | Chậm hơn một chút |
| Security | Cơ bản | Cao |
| Debug-able | Có (với source map) | Rất khó |
| Build time | Nhanh (~5s) | Chậm hơn (~20s) |

**Recommendation:** Dùng **Obfuscate** cho production để bảo mật tốt hơn.

## 🐛 Troubleshooting

### Lỗi: "terser not found"
```bash
npm install -g terser
```

### Lỗi: "javascript-obfuscator not found"
```bash
npm install -g javascript-obfuscator
```

### Lỗi: Code không chạy sau khi obfuscate
- Check console errors
- Có thể giảm options obfuscate
- Test với minify thay vì obfuscate

### Lỗi: Missing files trong dist/
- Kiểm tra file có tồn tại trong source
- Check build script logs

## 📞 Support

Nếu có vấn đề với build process, check:
1. Node.js version >= 14
2. NPM installed
3. Dependencies installed
4. File permissions (Linux/Mac)

---

Happy deploying! 🚀

