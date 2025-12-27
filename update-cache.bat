@echo off
echo 🚀 Cache Busting Tool for Static Sites
echo.

REM Get current timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=%dt:~0,14%"

echo Generated version: %timestamp%
echo.

REM Update index.html
if exist index.html (
    echo ✅ Updating index.html...
    powershell -Command "(gc index.html) -replace 'styles\.css\?v=[^\"]*', 'styles.css?v=%timestamp%' | Out-File -encoding UTF8 index.html"
    powershell -Command "(gc index.html) -replace 'script\.js\?v=[^\"]*', 'script.js?v=%timestamp%' | Out-File -encoding UTF8 index.html"
    powershell -Command "(gc index.html) -replace 'styles\.css(?!\?v=)', 'styles.css?v=%timestamp%' | Out-File -encoding UTF8 index.html"
    powershell -Command "(gc index.html) -replace 'script\.js(?!\?v=)', 'script.js?v=%timestamp%' | Out-File -encoding UTF8 index.html"
) else (
    echo ⚠️  index.html not found
)

REM Update personal.html if it exists
if exist personal.html (
    echo ✅ Updating personal.html...
    powershell -Command "(gc personal.html) -replace 'styles\.css\?v=[^\"]*', 'styles.css?v=%timestamp%' | Out-File -encoding UTF8 personal.html"
    powershell -Command "(gc personal.html) -replace 'script\.js\?v=[^\"]*', 'script.js?v=%timestamp%' | Out-File -encoding UTF8 personal.html"
    powershell -Command "(gc personal.html) -replace 'styles\.css(?!\?v=)', 'styles.css?v=%timestamp%' | Out-File -encoding UTF8 personal.html"
    powershell -Command "(gc personal.html) -replace 'script\.js(?!\?v=)', 'script.js?v=%timestamp%' | Out-File -encoding UTF8 personal.html"
) else (
    echo ℹ️  personal.html not found, skipping...
)

echo.
echo ✨ Cache busting complete!
echo.
echo 📝 Next steps:
echo 1. Upload your updated HTML files to your server
echo 2. Clear any CDN cache if you're using one
echo 3. Test in an incognito/private browser window
echo.
pause
