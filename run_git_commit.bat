@echo off
set "PATH=%PATH%;C:\Users\%USERNAME%\AppData\Local\Programs\Git\cmd;C:\Users\%USERNAME%\AppData\Local\Programs\Git\bin;C:\Users\%USERNAME%\AppData\Local\Programs\Git\mingw64\bin;C:\Program Files\Git\cmd;C:\Program Files\Git\bin"
cd /d "C:\Users\992113\Downloads\EVENTS-main\EVENTS-main"
echo --- GIT STATUS BEFORE --- > git_output.log 2>&1
git status >> git_output.log 2>&1
echo --- GIT ADD --- >> git_output.log 2>&1
git add -A >> git_output.log 2>&1
echo --- GIT COMMIT --- >> git_output.log 2>&1
git commit -m "feat(portal): connect Supabase live DB, migrate registrations, add full event settings & access control hub" >> git_output.log 2>&1
echo --- GIT PUSH --- >> git_output.log 2>&1
git push origin main >> git_output.log 2>&1
echo --- FINISHED --- >> git_output.log
