@echo off
chcp 65001 >nul
title سامانه رویدادها - آپلود مستقیم به گیت‌هاب (EVENTS)
color 0b
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0upload_to_github.ps1"
pause
