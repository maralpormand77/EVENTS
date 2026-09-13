@echo off
chcp 65001 >nul
title تبدیل فایل اکسل اطلاعات به پروژه
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0convert_excel.ps1"
pause
