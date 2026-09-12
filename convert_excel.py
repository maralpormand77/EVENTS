# -*- coding: utf-8 -*-
"""
اسکریپت تبدیل فایل اطلاعات.xlsx به دیتابیس جاوااسکریپت پرسنل
نحوه اجرا:
    python convert_excel.py
"""
import glob, json, openpyxl, os, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

files = glob.glob('*.xlsx')
if not files:
    print('فایل xlsx در پوشه یافت نشد!')
    exit(1)

xlsx_file = files[0]
print(f'در حال پردازش فایل: {xlsx_file}')

wb = openpyxl.load_workbook(xlsx_file, data_only=True)
sheet = wb.active

personnel_map = {}
for row in sheet.iter_rows(values_only=True, min_row=2):
    if not row or not row[0]:
        continue
    p_code = str(row[0]).strip()
    fname = str(row[1]).strip() if len(row) > 1 and row[1] is not None else ''
    lname = str(row[2]).strip() if len(row) > 2 and row[2] is not None else ''
    nat_code = str(row[3]).strip() if len(row) > 3 and row[3] is not None else ''
    full_name = f'{fname} {lname}'.strip()
    
    if p_code:
        personnel_map[p_code] = [full_name, nat_code]

# اطمینان از حضور ادمین‌ها
if '992113' not in personnel_map:
    personnel_map['992113'] = ['مارال پورمند', '1272744868']
if '980253' not in personnel_map:
    personnel_map['980253'] = ['حسن لندی', '1272126803']

js_content = '/**\n * دیتابیس پرسنل گروه انتخاب استخراج‌شده از اطلاعات.xlsx\n * تعداد پرسنل: ' + str(len(personnel_map)) + '\n */\n'
js_content += 'window.PERSONNEL_MAP = ' + json.dumps(personnel_map, ensure_ascii=False, separators=(',', ':')) + ';\n\n'
js_content += '''
function normalizeInputDigits(str) {
    if (!str) return '';
    return String(str).trim()
        .replace(/[۰-۹]/g, function(d) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d); })
        .replace(/[٠-٩]/g, function(d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); })
        .replace(/\\s+/g, '');
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
'''

target_paths = [
    'assets/js/personnel-data.js',
    '1/assets/js/personnel-data.js',
    '2/assets/js/personnel-data.js',
    '3/assets/js/personnel-data.js',
    'admin/assets/js/personnel-data.js'
]

for p in target_paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(js_content)

print(f'تبدیل با موفقیت انجام شد! {len(personnel_map)} پرسنل در تمام ۵ مسیر ذخیره گردید.')
