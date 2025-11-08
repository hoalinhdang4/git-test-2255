# 📦 Deploy RIÊNG thư mục dist/ lên Vercel

## 🎯 Workflow: Build Local → Deploy dist/

### Bước 1: Build Local

```bash
# Windows
build.bat

# Linux/Mac
./build.sh

# NPM
npm run build
```

✅ Tạo thư mục `dist/` với cấu trúc:

```
dist/
├── index.html
├── required.html
├── vercel.json       ← Config cho Vercel
├── build-info.json
└── public/
    ├── js/           ← Obfuscated
    ├── styles/
    ├── meta/
    └── assets
```

### Bước 2: Deploy RIÊNG dist/

#### Option A: Script tự động (RECOMMENDED)

```bash
# Windows
deploy-dist.bat

# Linux/Mac
chmod +x deploy-dist.sh
./deploy-dist.sh
```

✅ Script sẽ:
1. Check dist/ tồn tại
2. cd vào dist/
3. Run `vercel --prod`
4. Deploy!

#### Option B: Manual

```bash
# 1. Vào thư mục dist/
cd dist

# 2. Deploy
vercel --prod

# 3. Quay lại
cd ..
```

#### Option C: Preview deploy (test)

```bash
cd dist
vercel          # Preview URL
cd ..
```

---

## 🌐 URLs sau khi deploy:

```
https://your-project.vercel.app          → index.html
https://your-project.vercel.app/robot    → index.html
https://your-project.vercel.app/required → required.html
```

**Không bị 404!** ✅

---

## 📝 File `dist/vercel.json`

Khi build, file `dist-vercel.json` sẽ được copy thành `dist/vercel.json`:

```json
{
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

→ Đảm bảo routing hoạt động!

---

## 🔄 Complete Workflow

```
1. Edit code
   ├── public/js/config.js
   ├── public/js/utils.js
   └── index.html

2. Build local
   → build.bat
   → Tạo dist/ với vercel.json

3. Test local
   → Open dist/index.html
   → Check chức năng

4. Deploy dist/
   → deploy-dist.bat
   → Chỉ upload dist/

5. Test online
   → https://your-project.vercel.app
   ✓ No 404
```

---

## ⚡ Quick Commands

```bash
# Build + Deploy (2 lệnh)
build.bat
deploy-dist.bat

# Hoặc combined
build.bat && deploy-dist.bat
```

---

## 🎯 Ưu điểm deploy dist/

✅ **Nhanh hơn** - Upload ít file hơn  
✅ **Sạch hơn** - Không upload source code  
✅ **An toàn** - Code đã obfuscated  
✅ **Đơn giản** - Không cần build trên server  
✅ **Kiểm soát** - Test trước khi deploy  

---

## 🔧 So sánh 2 cách deploy

### Cách 1: Deploy toàn bộ project

```bash
vercel --prod
```

❌ Upload source code  
❌ Build trên Vercel server  
❌ Lâu hơn  
❌ Phụ thuộc Vercel build  

### Cách 2: Deploy RIÊNG dist/ (RECOMMENDED)

```bash
build.bat
cd dist
vercel --prod
```

✅ Chỉ upload production files  
✅ Build local (kiểm soát)  
✅ Nhanh hơn  
✅ Linh hoạt hơn  

---

## 🐛 Troubleshooting

### Lỗi: "dist not found"

```bash
# Chạy build trước
build.bat
```

### Lỗi: 404 trên Vercel

```bash
# Check dist/vercel.json có tồn tại
ls dist/vercel.json

# Nếu không có, build lại
build.bat
```

### Lỗi: JS/CSS không load

```bash
# Check paths trong HTML:
# ✓ ./public/js/config.js
# ✗ /public/js/config.js (thiếu .)
```

### Multiple deploys cùng dist/

```bash
# Mỗi lần deploy sẽ tạo project mới
# Nếu muốn update existing project:
cd dist
vercel --prod --yes    # Auto yes
```

---

## 📊 File Size so sánh

**Toàn bộ project:**
```
Project root: ~50 MB
├── node_modules/  ~40 MB
├── public/        ~5 MB
├── dist/          ~3 MB
└── configs/       ~2 MB
```

**Chỉ dist/:**
```
dist/: ~3 MB
├── index.html
├── required.html
└── public/        ~3 MB
```

→ Deploy nhanh gấp 15 lần! 🚀

---

## ✨ Best Practice

```bash
# Development
1. Edit code
2. Test local (open HTML)

# Before deploy
3. Build: build.bat
4. Test dist/: open dist/index.html
5. Check console (F12)

# Deploy
6. Deploy dist/: deploy-dist.bat
7. Test online
8. Monitor Telegram
```

---

## 🎉 Kết luận

Với workflow này:
- ✅ Build local (kiểm soát hoàn toàn)
- ✅ Test trước khi deploy
- ✅ Deploy nhanh (chỉ dist/)
- ✅ Không bị 404
- ✅ Code đã obfuscated

**Commands:**
```bash
build.bat         # Build
deploy-dist.bat   # Deploy
```

Đơn giản! 🚀

