@echo off
echo ========================================
echo   Obfuscate JavaScript Files
echo ========================================
echo.

REM Check if javascript-obfuscator is installed
where javascript-obfuscator >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] javascript-obfuscator not found! Installing...
    call npm install -g javascript-obfuscator
)

echo [1/4] Obfuscating config.js...
call javascript-obfuscator public/js/config.js --output public/js/config.obf.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64
echo [DONE] config.obf.js

echo [2/4] Obfuscating utils.js...
call javascript-obfuscator public/js/utils.js --output public/js/utils.obf.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64
echo [DONE] utils.obf.js

echo [3/4] Obfuscating modal.js...
call javascript-obfuscator public/js/modal.js --output public/js/modal.obf.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64
echo [DONE] modal.obf.js

echo [4/4] Obfuscating app.js...
call javascript-obfuscator public/js/app.js --output public/js/app.obf.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64
echo [DONE] app.obf.js

echo.
echo ========================================
echo   Obfuscate Complete!
echo ========================================
echo.
echo Files created:
echo   - public/js/config.obf.js
echo   - public/js/utils.obf.js
echo   - public/js/modal.obf.js
echo   - public/js/app.obf.js
echo.
echo Update required.html to use .obf.js files
pause

