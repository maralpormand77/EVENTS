@echo off
set "PATH=%PATH%;C:\Users\%USERNAME%\AppData\Local\Programs\Git\cmd;C:\Users\%USERNAME%\AppData\Local\Programs\Git\bin;C:\Users\%USERNAME%\AppData\Local\Programs\Git\mingw64\bin;C:\Program Files\Git\cmd;C:\Program Files\Git\bin"
cd /d "C:\Users\992113\Downloads\EVENTS-main\EVENTS-main"
git add -A > git_clean.log 2>&1
git commit -m "chore: cleanup temporary scripts" >> git_clean.log 2>&1
git push origin main >> git_clean.log 2>&1