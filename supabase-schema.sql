-- ====================================================================
-- اسکریپت ساخت جدول و تنظیمات امنیتی PostgreSQL در پلتفرم Supabase
-- سامانه ثبت‌نام رویدادهای گروه توسعه سرمایه‌گذاری انتخاب
-- ====================================================================

-- ۱. ساخت جدول ثبت‌نام‌ها
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  event_title TEXT NOT NULL,
  personnel_code TEXT NOT NULL,
  full_name TEXT NOT NULL,
  status TEXT NOT NULL,
  status_text TEXT,
  timestamp TEXT,
  jalali_date TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ۲. ایجاد ایندکس جهت سرعت فوق‌العاده در جستجو و فیلتر
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations (event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_personnel_code ON registrations (personnel_code);

-- ۳. فعال‌سازی Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- ۴. مجوز ثبت‌نام آزاد برای پرسنل (بدون نیاز به لاگین در دیتابیس)
DROP POLICY IF EXISTS "Allow public insert" ON registrations;
CREATE POLICY "Allow public insert" ON registrations 
  FOR INSERT WITH CHECK (true);

-- ۵. مجوز مشاهده ثبت‌نام‌ها برای پنل ادمین
DROP POLICY IF EXISTS "Allow public read" ON registrations;
CREATE POLICY "Allow public read" ON registrations 
  FOR SELECT USING (true);

-- ۶. مجوز حذف رکورد در پنل ادمین
DROP POLICY IF EXISTS "Allow public delete" ON registrations;
CREATE POLICY "Allow public delete" ON registrations 
  FOR DELETE USING (true);
