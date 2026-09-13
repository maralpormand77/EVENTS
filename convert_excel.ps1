<#
====================================================================
  Entekhab Events Portal - Excel to JavaScript Personnel DB Converter
  تبدیل مستقیم فایل اکسل به دیتابیس جاوااسکریپت پرسنل با پاورشل (بدون نیاز به پایتون)
====================================================================
#>

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$baseDir = $PSScriptRoot
if (-not $baseDir) { $baseDir = Get-Location }
if (Test-Path "$baseDir\EVENTS-main\index.html") {
    $baseDir = "$baseDir\EVENTS-main"
}

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  در حال پردازش فایل اکسل و به‌روزرسانی پروژه..." -ForegroundColor Green
Write-Host "  مسیر کاری: $baseDir" -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Cyan

# پیدا کردن فایل اکسل
$xlsxFiles = Get-ChildItem -Path $baseDir -Filter "*.xlsx" | Where-Object { -not ($_.Name.StartsWith("~$")) }
if (-not $xlsxFiles -or $xlsxFiles.Count -eq 0) {
    Write-Host "[!] هیچ فایل اکسلی در مسیر $baseDir یافت نشد." -ForegroundColor Red
    exit 1
}

$xlsxFile = $xlsxFiles[0].FullName
Write-Host "[*] فایل اکسل شناسایی شده: $(Split-Path $xlsxFile -Leaf)" -ForegroundColor Yellow

Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::OpenRead($xlsxFile)

# ۱. استخراج رشته‌های اشتراکی (sharedStrings.xml)
$sharedStrings = [System.Collections.Generic.List[string]]::new()
$ssEntry = $zip.GetEntry("xl/sharedStrings.xml")
if ($ssEntry) {
    $ssStream = $ssEntry.Open()
    $ssReader = [System.Xml.XmlReader]::Create($ssStream)
    while ($ssReader.Read()) {
        if ($ssReader.NodeType -eq [System.Xml.XmlNodeType]::Element -and $ssReader.LocalName -eq "si") {
            $sub = $ssReader.ReadSubtree()
            $text = ""
            while ($sub.Read()) {
                if ($sub.NodeType -eq [System.Xml.XmlNodeType]::Element -and $sub.LocalName -eq "t") {
                    $text += $sub.ReadElementContentAsString()
                }
            }
            $sharedStrings.Add($text)
        }
    }
    $ssReader.Dispose()
    $ssStream.Dispose()
}

# ۲. خواندن شیت اصلی (sheet1.xml)
$sheetEntry = $zip.GetEntry("xl/worksheets/sheet1.xml")
if (-not $sheetEntry) {
    Write-Host "[!] شیت اصلی اکسل یافت نشد." -ForegroundColor Red
    $zip.Dispose()
    exit 1
}

$sheetStream = $sheetEntry.Open()
$sheetReader = [System.Xml.XmlReader]::Create($sheetStream)
$personnelMap = [System.Collections.Generic.Dictionary[string, object[]]]::new()

while ($sheetReader.Read()) {
    if ($sheetReader.NodeType -eq [System.Xml.XmlNodeType]::Element -and $sheetReader.LocalName -eq "row") {
        $rowNum = $sheetReader.GetAttribute("r")
        if ($rowNum -eq "1") { continue } # سطر اول هدر است
        
        $rowSub = $sheetReader.ReadSubtree()
        $pCode = ""
        $fname = ""
        $lname = ""
        $natCode = ""
        
        while ($rowSub.Read()) {
            if ($rowSub.NodeType -eq [System.Xml.XmlNodeType]::Element -and $rowSub.LocalName -eq "c") {
                $ref = $rowSub.GetAttribute("r")
                $t = $rowSub.GetAttribute("t")
                $col = $ref -replace '\d+', ''
                $val = ""
                
                $cSub = $rowSub.ReadSubtree()
                while ($cSub.Read()) {
                    if ($cSub.NodeType -eq [System.Xml.XmlNodeType]::Element -and $cSub.LocalName -eq "v") {
                        $val = $cSub.ReadElementContentAsString()
                    } elseif ($cSub.NodeType -eq [System.Xml.XmlNodeType]::Element -and $cSub.LocalName -eq "t") {
                        $val = $cSub.ReadElementContentAsString()
                    }
                }
                
                if ($t -eq "s") {
                    $idx = [int]$val
                    if ($idx -ge 0 -and $idx -lt $sharedStrings.Count) {
                        $val = $sharedStrings[$idx]
                    }
                }
                
                $val = ($val -replace '\.0$', '').Trim()
                switch ($col) {
                    "A" { $pCode = $val }
                    "B" { $fname = $val }
                    "C" { $lname = $val }
                    "D" { $natCode = $val }
                }
            }
        }
        
        if ($pCode) {
            $fullName = ("$fname $lname").Trim()
            $personnelMap[$pCode] = @($fullName, $natCode)
        }
    }
}

$sheetReader.Dispose()
$sheetStream.Dispose()
$zip.Dispose()

# اطمینان از حضور ادمین‌ها
if (-not $personnelMap.ContainsKey('992113')) {
    $personnelMap['992113'] = @('مارال پورمند', '1272744868')
}
if (-not $personnelMap.ContainsKey('980253')) {
    $personnelMap['980253'] = @('حسن لندی', '1272126803')
}

$totalCount = $personnelMap.Count

# ۳. تولید محتوای personnel-data.js
$sb = [System.Text.StringBuilder]::new(1024 * 1024 * 3)
[void]$sb.AppendLine("/**")
[void]$sb.AppendLine(" * دیتابیس پرسنل گروه انتخاب استخراج‌شده از اطلاعات.xlsx")
[void]$sb.AppendLine(" * تعداد پرسنل: $totalCount")
[void]$sb.AppendLine(" */")
[void]$sb.Append("window.PERSONNEL_MAP = {")

$first = $true
foreach ($kvp in $personnelMap.GetEnumerator()) {
    if (-not $first) { [void]$sb.Append(',') }
    $first = $false
    $keyEsc = $kvp.Key.Replace('\', '\\').Replace('"', '\"')
    $nameEsc = ([string]$kvp.Value[0]).Replace('\', '\\').Replace('"', '\"')
    $natEsc = ([string]$kvp.Value[1]).Replace('\', '\\').Replace('"', '\"')
    [void]$sb.Append("`"$keyEsc`":[`"$nameEsc`",`"$natEsc`"]")
}
[void]$sb.AppendLine("};")
[void]$sb.AppendLine()
[void]$sb.AppendLine("// کش به‌روزرسانی‌شده از پنل ادمین (در صورت وجود)")
[void]$sb.AppendLine("try {")
[void]$sb.AppendLine("    var _cachedMap = localStorage.getItem('entekhab_custom_personnel_map');")
[void]$sb.AppendLine("    if (_cachedMap) {")
[void]$sb.AppendLine("        var _parsed = JSON.parse(_cachedMap);")
[void]$sb.AppendLine("        if (_parsed && typeof _parsed === 'object' && Object.keys(_parsed).length > 0) {")
[void]$sb.AppendLine("            window.PERSONNEL_MAP = _parsed;")
[void]$sb.AppendLine("        }")
[void]$sb.AppendLine("    }")
[void]$sb.AppendLine("} catch(e) {}")
[void]$sb.AppendLine()

$authJs = @'
function normalizeInputDigits(str) {
    if (!str) return '';
    return String(str).trim()
        .replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); })
        .replace(/[٠-٩]/g, function(d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); })
        .replace(/\s+/g, '');
}

function authenticatePersonnel(personnelCode, nationalCode) {
    var cleanPCode = normalizeInputDigits(personnelCode);
    var cleanNatCode = normalizeInputDigits(nationalCode);

    if (!cleanPCode && !cleanNatCode) {
        return {
            success: false,
            message: 'لطفاً شماره پرسنلی و کد ملی را وارد فرمایید.'
        };
    }

    if (!cleanPCode) {
        return {
            success: false,
            message: 'لطفاً شماره پرسنلی خود را وارد فرمایید.'
        };
    }

    if (!cleanNatCode) {
        return {
            success: false,
            message: 'لطفاً کد ملی خود را وارد فرمایید.'
        };
    }

    if (!window.PERSONNEL_MAP) {
        return {
            success: false,
            message: 'خطا در بارگذاری سامانه. لطفاً صفحه را رفرش فرمایید.'
        };
    }

    var record = window.PERSONNEL_MAP[cleanPCode];
    if (!record) {
        return {
            success: false,
            message: 'شماره پرسنلی وارد شده در سامانه یافت نشد. لطفاً دقت فرمایید.'
        };
    }

    var fullName = record[0];
    var registeredNatCode = normalizeInputDigits(record[1]);

    var isMatch = false;

    if (registeredNatCode) {
        if (registeredNatCode === cleanNatCode) {
            isMatch = true;
        } else {
            var regTrim = registeredNatCode.replace(/^0+/, '');
            var inputTrim = cleanNatCode.replace(/^0+/, '');
            if (regTrim && regTrim === inputTrim) {
                isMatch = true;
            } else if (cleanNatCode.padStart(10, '0') === registeredNatCode.padStart(10, '0')) {
                isMatch = true;
            }
        }
    } else {
        if (cleanNatCode === cleanPCode || cleanNatCode.length >= 4) {
            isMatch = true;
        }
    }

    if (isMatch) {
        return {
            success: true,
            personnelCode: cleanPCode,
            fullName: fullName,
            nationalCode: registeredNatCode || cleanNatCode,
            user: {
                personnelCode: cleanPCode,
                fullName: fullName,
                nationalCode: registeredNatCode || cleanNatCode
            }
        };
    } else {
        return {
            success: false,
            message: 'کد ملی وارد شده با شماره پرسنلی مطابقت ندارد. لطفاً مجدداً بررسی فرمایید.'
        };
    }
}
'@

[void]$sb.AppendLine($authJs)
$finalContent = $sb.ToString()

# ۴. ذخیره در تمام ۵ مسیر پروژه
$targetPaths = @(
    "$baseDir\assets\js\personnel-data.js",
    "$baseDir\1\assets\js\personnel-data.js",
    "$baseDir\2\assets\js\personnel-data.js",
    "$baseDir\3\assets\js\personnel-data.js",
    "$baseDir\admin\assets\js\personnel-data.js"
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($tp in $targetPaths) {
    $parent = Split-Path $tp -Parent
    if (-not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
    [System.IO.File]::WriteAllText($tp, $finalContent, $utf8NoBom)
    Write-Host "  [+] به روزرسانی شد: $tp" -ForegroundColor Green
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  موفقیت: تعداد $totalCount پرسنل با موفقیت در پروژه ذخیره شدند!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan
