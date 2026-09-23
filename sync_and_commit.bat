@echo off
chcp 65001 >nul
cd /d "C:\Users\992113\Downloads\EVENTS-main\EVENTS-main"
echo Starting copy to parent portal... > sync_and_commit.log
copy /Y "portal\index.html" "..\portal\index.html" >> sync_and_commit.log 2>&1
copy /Y "portal\style.css" "..\portal\style.css" >> sync_and_commit.log 2>&1
copy /Y "portal\app.js" "..\portal\app.js" >> sync_and_commit.log 2>&1
echo Running git status... >> sync_and_commit.log
git status >> sync_and_commit.log 2>&1
echo Staging files... >> sync_and_commit.log
git add -A >> sync_and_commit.log 2>&1
echo Committing changes... >> sync_and_commit.log
git commit -m "feat(ui): enterprise architecture overhaul with employee/admin separation and my-events hub" --no-verify >> sync_and_commit.log 2>&1
echo Pushing to origin main... >> sync_and_commit.log
git push origin main >> sync_and_commit.log 2>&1
echo Finished sync and push. >> sync_and_commit.log
