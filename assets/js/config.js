/**
 * تنظیمات و کانفیگ سامانه ثبت‌نام رویدادهای گروه انتخاب
 */

const APP_CONFIG = {
    // نام سازمان
    organizationName: "گروه توسعه سرمایه گذاری انتخاب",
    
    // تنظیمات دیتابیس ابری PostgreSQL (پلتفرم Supabase)
    supabase: {
        url: "https://qkzpviutdkonwxzwtdxv.supabase.co", // آدرس پروژه Supabase
        anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrenB2aXV0ZGtvbnd4end0ZHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMDc4MjQsImV4cCI6MjEwNDU4MzgyNH0.N1_pKtUoFLMDYrMHy6Sj6TAu-eXfT4LT_vOfYiy4LzA", // کلید عمومی anon
        table: "registrations"
    },

    // کلیدهای ذخیره‌سازی محلی
    storageKeys: {
        registrations: "entekhab_events_registrations",
        supabaseUrl: "entekhab_supabase_url",
        supabaseKey: "entekhab_supabase_key",
        supabaseTable: "entekhab_supabase_table",
        cloudUrl: "entekhab_google_script_url"
    },

    // اطلاعات رویدادها
    events: {
        "sobh-hamdeli": {
            id: "sobh-hamdeli",
            title: "صبح همدلی",
            category: "پیاده‌روی مدیران",
            fullTitle: "صبح همدلی - پیاده روی مدیران گروه توسعه سرمایه گذاری انتخاب",
            subtitle: "پیاده روی مدیران گروه توسعه سرمایه گذاری انتخاب",
            date: "یکشنبه ۲۲/۰۶/۱۴۰۵",
            time: "ساعت ۰۶:۳۰ صبح",
            location: "خیابان نشاط، کوچه ۲۰، عمارت ماهور",
            notes: [
                "مهلت ثبت‌نام و انصراف تا تاریخ ۱۴۰۵/۰۶/۲۱ ساعت ۱۲:۳۰ می‌باشد.",
                "لطفا با لباس و کفش مناسب جهت پیاده روی و نرمش حضور بهم رسانید."
            ],
            registrationDeadline: "2026-09-12T12:30:00+03:30",
            themeColor: "#004b93",
            accentColor: "#10b981",
            icon: "walk",
            pageUrl: "event1-sobh-hamdeli.html"
        },
        "kavir-varzaneh": {
            id: "kavir-varzaneh",
            title: "تور کویر ورزنه",
            category: "ایونت علمی تفریحی",
            fullTitle: "تور کویر ورزنه - ایونت علمی تفریحی گروه توسعه سرمایه گذاری انتخاب",
            subtitle: "ایونت علمی تفریحی گروه توسعه سرمایه گذاری انتخاب",
            departureTime: "چهارشنبه ۲۵/۰۶/۱۴۰۵ ساعت ۱۴:۰۰",
            returnTime: "پنجشنبه ۲۶/۰۶/۱۴۰۵ ساعت ۱۳:۰۰",
            location: "ساختمان مرکزی (خیابان امام خمینی)",
            posterImage: "assets/images/kavir.jpg",
            notes: [
                "زمان ثبت نام تا 1405/06/22 ساعت 13 می باشد.",
                "درصورت ثبت نام و عدم حضور هزینه سرانه از حقوق همکار کسر خواهد شد."
            ],
            registrationDeadline: "2026-09-13T13:00:00+03:30",
            themeColor: "#b45309",
            accentColor: "#f59e0b",
            icon: "sun",
            pageUrl: "event2-kavir-varzaneh.html"
        },
        "rafting-markadeh": {
            id: "rafting-markadeh",
            title: "تور رفتینگ مارکده",
            category: "ایونت تفریحی و ورزشی",
            fullTitle: "تور رفتینگ مارکده - ایونت تفریحی گروه توسعه سرمایه گذاری انتخاب",
            subtitle: "ایونت تفریحی گروه توسعه سرمایه گذاری انتخاب",
            departureTime: "پنجشنبه ۰۲/۰۷/۱۴۰۵ ساعت ۰۶:۰۰",
            returnTime: "پنجشنبه ۰۲/۰۷/۱۴۰۵ ساعت ۱۸:۰۰",
            location: "ساختمان مرکزی",
            notes: [
                "همراه داشتن لوازم شخصی (دارو، کرم ضد آفتاب، کلاه، تیشرت آستین بلند، عینک آفتابی، دستمال مرطوب و ...)",
                "با توجه به مواجهه با آب، لباس اضافه و حوله همراه داشته باشید.",
                "از آوردن زیورآلات، ساعت و اکسسوری غیر ضروری خودداری فرمائید.",
                "با توجه به حضور در رودخانه، همراه داشتن صندل می‌تواند کارایی بالایی داشته باشد.",
                "وسایل مورد نیاز جهت پذیرایی و صرف غذا: لیوان، قاشق و چنگال شخصی"
            ],
            themeColor: "#0284c7",
            accentColor: "#06b6d4",
            icon: "waves",
            pageUrl: "event3-rafting-markadeh.html"
        }
    }
};

// دریافت تنظیمات فعال Supabase (از لوکال استوریج یا پیش‌فرض کد)
function getActiveSupabaseConfig() {
    const savedUrl = localStorage.getItem(APP_CONFIG.storageKeys.supabaseUrl);
    const savedKey = localStorage.getItem(APP_CONFIG.storageKeys.supabaseKey);
    const savedTable = localStorage.getItem(APP_CONFIG.storageKeys.supabaseTable);

    let rawUrl = (savedUrl || APP_CONFIG.supabase?.url || "").trim();
    rawUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

    return {
        url: rawUrl,
        anonKey: (savedKey || APP_CONFIG.supabase?.anonKey || "").trim(),
        table: (savedTable || APP_CONFIG.supabase?.table || "registrations").trim()
    };
}

// ذخیره تنظیمات Supabase در لوکال استوریج
function setActiveSupabaseConfig(url, anonKey, table = "registrations") {
    if (url && url.trim()) {
        let cleanUrl = url.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
        localStorage.setItem(APP_CONFIG.storageKeys.supabaseUrl, cleanUrl);
    } else {
        localStorage.removeItem(APP_CONFIG.storageKeys.supabaseUrl);
    }

    if (anonKey && anonKey.trim()) {
        localStorage.setItem(APP_CONFIG.storageKeys.supabaseKey, anonKey.trim());
    } else {
        localStorage.removeItem(APP_CONFIG.storageKeys.supabaseKey);
    }

    if (table && table.trim()) {
        localStorage.setItem(APP_CONFIG.storageKeys.supabaseTable, table.trim());
    } else {
        localStorage.removeItem(APP_CONFIG.storageKeys.supabaseTable);
    }
}

// دریافت آدرس فعال اسکریپت قدیمی (سازگاری به عقب)
function getActiveScriptUrl() {
    return localStorage.getItem(APP_CONFIG.storageKeys.cloudUrl) || "";
}

// ذخیره آدرس اسکریپت در تنظیمات
function setActiveScriptUrl(url) {
    if (url) {
        localStorage.setItem(APP_CONFIG.storageKeys.cloudUrl, url.trim());
    } else {
        localStorage.removeItem(APP_CONFIG.storageKeys.cloudUrl);
    }
}
