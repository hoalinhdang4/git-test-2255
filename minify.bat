@echo off
echo ========================================
echo   Minify JavaScript Files
echo ========================================
echo.

REM Check if terser is installed
where terser >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Terser not found! Installing...
    call npm install -g terser
)

echo [1/4] Minifying config.js...
call terser public/js/config.js -o public/js/config.min.js -c -m
echo [DONE] config.min.js

echo [2/4] Minifying utils.js...
call terser public/js/utils.js -o public/js/utils.min.js -c -m
echo [DONE] utils.min.js

echo [3/4] Minifying modal.js...
call terser public/js/modal.js -o public/js/modal.min.js -c -m
echo [DONE] modal.min.js

echo [4/4] Minifying app.js...
call terser public/js/app.js -o public/js/app.min.js -c -m
echo [DONE] app.min.js

echo.
echo ========================================
echo   Minify Complete!
echo ========================================
echo.
echo Files created:
echo   - public/js/config.min.js
echo   - public/js/utils.min.js
echo   - public/js/modal.min.js
echo   - public/js/app.min.js
echo.
echo Update required.html to use .min.js files
pause

