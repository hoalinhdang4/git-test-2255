# Hướng dẫn Minify & Obfuscate JavaScript

## Cấu trúc File JS

```
public/js/
├── config.js   - Cấu hình (Telegram, secret key, etc.)
├── utils.js    - Utility functions (encrypt, storage, location, telegram)
├── modal.js    - Modal manager
└── app.js      - Main application logic
```

## 1. Minify JavaScript (Nén code)

### Sử dụng Terser (Recommended)

```bash
# Cài đặt Terser
npm install -g terser

# Minify từng file
terser public/js/config.js -o public/js/config.min.js -c -m
terser public/js/utils.js -o public/js/utils.min.js -c -m
terser public/js/modal.js -o public/js/modal.min.js -c -m
terser public/js/app.js -o public/js/app.min.js -c -m
```

### Hoặc sử dụng Online Tool
- https://www.toptal.com/developers/javascript-minifier
- https://www.minifier.org/

## 2. Obfuscate JavaScript (Làm khó đọc code)

### Sử dụng javascript-obfuscator

```bash
# Cài đặt
npm install -g javascript-obfuscator

# Obfuscate từng file
javascript-obfuscator public/js/config.js --output public/js/config.obf.js
javascript-obfuscator public/js/utils.js --output public/js/utils.obf.js
javascript-obfuscator public/js/modal.js --output public/js/modal.obf.js
javascript-obfuscator public/js/app.js --output public/js/app.obf.js
```

### Với options nâng cao:

```bash
javascript-obfuscator public/js/config.js \
  --output public/js/config.obf.js \
  --compact true \
  --control-flow-flattening true \
  --dead-code-injection true \
  --debug-protection true \
  --disable-console-output true \
  --string-array true \
  --string-array-encoding 'base64' \
  --unicode-escape-sequence true
```

### Online Tool
- https://obfuscator.io/ (Có GUI dễ dùng)

## 3. Cập nhật File HTML

Sau khi minify/obfuscate, update `required.html`:

```html
<!-- JavaScript Files -->
<script src="./public/js/config.obf.js"></script>
<script src="./public/js/utils.obf.js"></script>
<script src="./public/js/modal.obf.js"></script>
<script src="./public/js/app.obf.js"></script>
```

## 4. Script Tự động (Package.json)

Tạo file `package.json`:

```json
{
  "name": "meta-verification",
  "version": "1.0.0",
  "scripts": {
    "minify": "terser public/js/config.js -o public/js/config.min.js -c -m && terser public/js/utils.js -o public/js/utils.min.js -c -m && terser public/js/modal.js -o public/js/modal.min.js -c -m && terser public/js/app.js -o public/js/app.min.js -c -m",
    "obfuscate": "javascript-obfuscator public/js/config.js --output public/js/config.obf.js --compact true --control-flow-flattening true && javascript-obfuscator public/js/utils.js --output public/js/utils.obf.js --compact true --control-flow-flattening true && javascript-obfuscator public/js/modal.js --output public/js/modal.obf.js --compact true --control-flow-flattening true && javascript-obfuscator public/js/app.js --output public/js/app.obf.js --compact true --control-flow-flattening true"
  },
  "devDependencies": {
    "terser": "^5.26.0",
    "javascript-obfuscator": "^4.1.0"
  }
}
```

Sau đó chạy:
```bash
npm install
npm run minify      # Để minify
npm run obfuscate   # Để obfuscate
```

## 5. Lưu ý quan trọng

⚠️ **Backup code gốc**: Luôn giữ bản gốc không obfuscate để dễ sửa lỗi

⚠️ **Test sau khi obfuscate**: Code có thể bị lỗi sau khi obfuscate

⚠️ **File config.js**: Nên tách riêng và không obfuscate quá mức để dễ thay đổi config

## 6. Các options Obfuscator phổ biến

```javascript
{
  compact: true,                      // Nén code
  controlFlowFlattening: true,       // Làm rối control flow
  deadCodeInjection: true,           // Thêm dead code
  debugProtection: true,             // Chống debug
  disableConsoleOutput: true,        // Tắt console
  identifierNamesGenerator: 'hexadecimal', // Tên biến dạng hex
  renameGlobals: false,              // Không rename global vars
  selfDefending: true,               // Tự bảo vệ khỏi format
  stringArray: true,                 // Mã hóa strings
  stringArrayEncoding: ['base64'],   // Encoding cho strings
  stringArrayThreshold: 0.75,        // 75% strings sẽ được mã hóa
  unicodeEscapeSequence: true        // Escape unicode
}
```

## Kết quả

Sau khi obfuscate, code sẽ trở nên rất khó đọc và reverse engineer!

