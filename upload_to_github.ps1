<#
====================================================================
  Entekhab Events Portal - Direct GitHub API Uploader
  آپلود مستقیم پروژه به مخزن maralpormand77/EVENTS
====================================================================
#>

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "آپلود مستقیم رویدادهای انتخاب به گیت‌هاب"

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  سامانه رویدادهای گروه توسعه سرمایه گذاری انتخاب" -ForegroundColor Green
Write-Host "  در حال آماده‌سازی ارسال تغییرات به گیت‌هاب:" -ForegroundColor Green
Write-Host "  https://github.com/maralpormand77/EVENTS" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$repoOwner = "maralpormand77"
$repoName = "EVENTS"
$baseDir = $PSScriptRoot
if (-not $baseDir) { $baseDir = Get-Location }
if (Test-Path "$baseDir\EVENTS-main\index.html") {
    $baseDir = "$baseDir\EVENTS-main"
}

# گام خودکار: به‌روزرسانی خودکار دیتابیس پرسنل از روی فایل اکسل قبل از ارسال
$converterScript = "$baseDir\convert_excel.ps1"
if (-not (Test-Path $converterScript)) {
    $converterScript = "$PSScriptRoot\convert_excel.ps1"
}
if (Test-Path $converterScript) {
    Write-Host "[*] در حال بررسی و به‌روزرسانی خودکار پروژه بر اساس فایل اکسل..." -ForegroundColor Cyan
    & $converterScript
    Write-Host ""
}

# فایلهایی که نباید آپلود شوند
$excludeNames = @(
    ".git",
    "push_to_git.bat",
    "upload_to_github.bat",
    "upload_to_github.ps1",
    "convert_excel.bat"
)

Write-Host "راهنمای دریافت یا ورود توکن گیت‌هاب (Personal Access Token):" -ForegroundColor Yellow
Write-Host "۱. در صورتی که قبلاً توکن ساخته‌اید، آن را وارد نمایید." -ForegroundColor White
Write-Host "۲. برای ساخت توکن جدید:" -ForegroundColor White
Write-Host "   https://github.com/settings/tokens/new" -ForegroundColor Cyan
Write-Host "   تیک گزینه 'repo' را فعال کرده و دکمه Generate token را بزنید." -ForegroundColor White
Write-Host "--------------------------------------------------------------------" -ForegroundColor Gray

$token = Read-Host "لطفاً توکن گیت‌هاب خود را Paste کرده و Enter بزنید"
$token = $token.Trim()

if (-not $token) {
    Write-Host "[!] توکنی وارد نشد. عملیات متوقف گردید." -ForegroundColor Red
    pause
    exit
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "EntekhabEventUploader"
}

# تست اتصال به مخزن
Write-Host ""
Write-Host "[*] در حال بررسی دسترسی به مخزن $repoOwner/$repoName ..." -ForegroundColor Yellow
try {
    $repoInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName" -Headers $headers -Method Get
    Write-Host "[+] ارتباط با مخزن گیت‌هاب با موفقیت برقرار شد." -ForegroundColor Green
} catch {
    Write-Host "[!] خطا در اتصال به مخزن: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "لطفاً از صحت توکن و دسترسی مخزن مطمئن شوید." -ForegroundColor Yellow
    pause
    exit
}

# دریافت تمام فایل‌ها
$allFiles = Get-ChildItem -Path $baseDir -Recurse -File | Where-Object {
    $rel = $_.FullName.Substring($baseDir.Length).TrimStart('\', '/')
    $skip = $false
    foreach ($ex in $excludeNames) {
        if ($rel -like "$ex*" -or $rel -eq $ex) { $skip = $true; break }
    }
    -not $skip
}

Write-Host ""
Write-Host "[*] تعداد $($allFiles.Count) فایل برای بررسی و ارسال شناسایی شد:" -ForegroundColor Cyan

# برای ارسال کامل و پشتیبانی از فایلهای بزرگ از Git Data API (Blobs + Tree + Commit) استفاده می‌کنیم
try {
    Write-Host "[1/4] دریافت آخرین کامیت شاخه main..." -ForegroundColor Yellow
    $refData = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName/git/refs/heads/main" -Headers $headers -Method Get
    $latestCommitSha = $refData.object.sha
    $commitData = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName/git/commits/$latestCommitSha" -Headers $headers -Method Get
    $baseTreeSha = $commitData.tree.sha

    Write-Host "[2/4] در حال ایجاد Blobs برای فایل‌های تغییر یافته..." -ForegroundColor Yellow
    $treeEntries = @()
    $idx = 0

    foreach ($file in $allFiles) {
        $idx++
        $relPath = $file.FullName.Substring($baseDir.Length).TrimStart('\', '/').Replace('\', '/')
        Write-Host "  [$idx/$($allFiles.Count)] پردازش $relPath ... " -NoNewline -ForegroundColor White

        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        $b64 = [System.Convert]::ToBase64String($bytes)

        $blobBody = @{
            content  = $b64
            encoding = "base64"
        } | ConvertTo-Json -Compress

        $blobRes = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName/git/blobs" -Headers $headers -Method Post -Body $blobBody -ContentType "application/json"
        
        $treeEntries += @{
            path = $relPath
            mode = "100644"
            type = "blob"
            sha  = $blobRes.sha
        }
        Write-Host "انجام شد [+] " -ForegroundColor Green
    }

    Write-Host "[3/4] در حال ثبت Tree جدید در گیت‌هاب..." -ForegroundColor Yellow
    $treeBody = @{
        base_tree = $baseTreeSha
        tree      = $treeEntries
    } | ConvertTo-Json -Depth 5 -Compress

    $newTree = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName/git/trees" -Headers $headers -Method Post -Body $treeBody -ContentType "application/json"

    Write-Host "[4/4] ثبت کامیت و به‌روزرسانی شاخه main..." -ForegroundColor Yellow
    $commitMsg = "Auto-sync personnel database from Excel and update project"
    $commitBody = @{
        message = $commitMsg
        tree    = $newTree.sha
        parents = @($latestCommitSha)
    } | ConvertTo-Json -Compress

    $newCommit = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName/git/commits" -Headers $headers -Method Post -Body $commitBody -ContentType "application/json"

    # Update ref
    $refUpdateBody = @{
        sha   = $newCommit.sha
        force = $true
    } | ConvertTo-Json -Compress

    $updatedRef = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName/git/refs/heads/main" -Headers $headers -Method Patch -Body $refUpdateBody -ContentType "application/json"

    Write-Host ""
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host "  [+] تمامی تغییرات با موفقیت در مخزن گیت‌هاب کامیت و پوش (Push) شد!" -ForegroundColor Green
    Write-Host "  شناسه کامیت جدید: $($newCommit.sha.Substring(0,7))" -ForegroundColor Green
    Write-Host "  مشاهده در گیت‌هاب: https://github.com/$repoOwner/$repoName" -ForegroundColor Yellow
    Write-Host "====================================================================" -ForegroundColor Cyan

} catch {
    Write-Host "[!] خطا در فرآیند آپلود: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "جزئیات: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "برای خروج کلیدی را فشار دهید..."
pause
