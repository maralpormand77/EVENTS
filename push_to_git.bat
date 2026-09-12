@echo off
setlocal enabledelayedexpansion

REM Set PATH to include Git
set "PATH=%PATH%;C:\Users\%USERNAME%\AppData\Local\Programs\Git\cmd;C:\Users\%USERNAME%\AppData\Local\Programs\Git\bin;C:\Users\%USERNAME%\AppData\Local\Programs\Git\mingw64\bin;C:\Program Files\Git\cmd;C:\Program Files\Git\bin"

cd /d "%~dp0"
if exist "EVENTS-main\index.html" (
    cd "EVENTS-main"
)

echo ===================================================
echo Pushing changes to https://github.com/maralpormand77/EVENTS
echo Directory: %CD%
echo ===================================================

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git executable was not found.
    echo Please verify Git installation.
    pause
    exit /b 1
)

if not exist ".git" (
    echo [1/4] Initializing git repository...
    git init
    git branch -M main
    git remote add origin https://github.com/maralpormand77/EVENTS.git
) else (
    echo [1/4] Configuring git remote...
    git branch -M main
    git remote remove origin 2>nul
    git remote add origin https://github.com/maralpormand77/EVENTS.git
)

git config user.name "maralpormand77"
git config user.email "maralpormand77@users.noreply.github.com"

echo [2/4] Staging files (git add)...
git add -A

echo [3/4] Creating commit...
git commit -m "Add export master personnel bank to Excel and disable modal backdrop dismiss"

echo [4/4] Pushing to GitHub main branch...
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo Normal push failed. Trying force push...
    git push -u origin main --force
)

if %errorlevel% equ 0 (
    echo.
    echo ===================================================
    echo SUCCESS: Changes pushed to GitHub successfully!
    echo https://github.com/maralpormand77/EVENTS
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo ERROR: Push failed. Check your network or GitHub login.
    echo ===================================================
)

pause
