========================================
  VERCEL DEPLOY - QUICK SETUP
========================================

✅ CẤU HÌNH ĐÃ SẴN SÀNG!

Các file đã được cấu hình:
  ✓ vercel.json      - Vercel config
  ✓ .vercelignore    - Ignore files
  ✓ package.json     - Build scripts
  ✓ build.js         - Build automation

========================================
  OPTION 1: DEPLOY VIA CLI (5 PHÚT)
========================================

1. Cài đặt Vercel CLI:
   npm install -g vercel

2. Login:
   vercel login

3. Deploy:
   vercel --prod

✅ DONE! URL: https://your-project.vercel.app

========================================
  OPTION 2: DEPLOY VIA GITHUB
========================================

1. Push code lên GitHub:
   git init
   git add .
   git commit -m "Initial"
   git remote add origin https://github.com/USER/REPO.git
   git push -u origin main

2. Import vào Vercel:
   - Vào: https://vercel.com/new
   - Import repo
   - Click Deploy

✅ Auto deploy mỗi lần push!

========================================
  OPTION 3: BUILD LOCAL RỒI DEPLOY
========================================

1. Build:
   build.bat         (Windows)
   ./build.sh        (Linux/Mac)

2. Deploy dist/:
   cd dist
   vercel --prod

========================================
  VERCEL SẼ TỰ ĐỘNG
========================================

✓ npm install
✓ npm run vercel-build (obfuscate JS)
✓ Deploy thư mục dist/
✓ Generate URLs:
   - https://your-project.vercel.app → index.html
   - https://your-project.vercel.app/required → required.html
   - https://your-project.vercel.app/robot → index.html

========================================
  TEST URLS
========================================

Landing:   https://your-project.vercel.app
Robot:     https://your-project.vercel.app/robot
Form:      https://your-project.vercel.app/required

========================================
  TROUBLESHOOTING
========================================

❌ Build failed?
   → Test local: npm run build
   → Check logs: vercel logs

❌ 404 Not Found?
   → Check vercel.json
   → Verify dist/ output

❌ JS không load?
   → Check paths: ./public/...
   → Clear cache

========================================
  CUSTOM DOMAIN (OPTIONAL)
========================================

1. Vercel Dashboard → Domains
2. Add your domain
3. Update DNS:
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com

========================================
  CHI TIẾT
========================================

Xem file: VERCEL_DEPLOY.md

Happy deploying! 🚀

