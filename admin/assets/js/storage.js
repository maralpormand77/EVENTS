/**
 * سیستم ذخیره‌سازی داده‌های ثبت‌نام
 * پشتیبانی چندمنظوره از:
 * ۱. دیتابیس ابری REST API (مانند MockAPI.io / CrudDB) - فوق‌العاده سریع و بدون نیاز به سرور
 * ۲. دیتابیس Supabase (PostgreSQL سرورلس)
 * ۳. Google Apps Script / Google Sheets
 * ۴. حافظه محلی مرورگر (LocalStorage) جهت پاسخگویی آنی و کش آفلاین
 */

const StorageService = {
    // تبدیل تاریخ میلادی به شمسی
    toJalaliString: function(date = new Date()) {
        try {
            const d = new Date(date);
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                calendar: 'persian',
                numberingSystem: 'latn'
            };
            const formatter = new Intl.DateTimeFormat('fa-IR', options);
            return formatter.format(d);
        } catch (e) {
            return new Date(date).toLocaleString('fa-IR');
        }
    },

    // تولید شناسه یکتا
    generateId: function() {
        return 'reg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    },

    // خواندن تمام ثبت‌نام‌ها از حافظه لوکال
    getLocalRegistrations: function() {
        try {
            const raw = localStorage.getItem(APP_CONFIG.storageKeys.registrations);
            if (!raw) return [];
            const list = JSON.parse(raw);
            return Array.isArray(list) ? list : [];
        } catch (e) {
            console.error("خطا در خواندن از لوکال استوریج:", e);
            return [];
        }
    },

    // ذخیره در حافظه لوکال
    setLocalRegistrations: function(list) {
        try {
            localStorage.setItem(APP_CONFIG.storageKeys.registrations, JSON.stringify(list));
        } catch (e) {
            console.error("خطا در ذخیره در لوکال استوریج:", e);
        }
    },

    // بررسی وضعیت و تست اتصال به دیتابیس Supabase PostgreSQL
    testSupabaseConnection: async function(url, anonKey, table = "registrations") {
        try {
            const cleanUrl = (url || "").trim().replace(/\/+$/, "");
            if (!cleanUrl || !anonKey) {
                return { ok: false, error: "لطفاً آدرس پروژه و کلید anon را وارد فرمایید." };
            }
            const res = await fetch(`${cleanUrl}/rest/v1/${table}?select=id&limit=1`, {
                headers: {
                    'apikey': anonKey.trim(),
                    'Authorization': `Bearer ${anonKey.trim()}`
                }
            });
            if (res.ok) {
                return { ok: true, status: res.status };
            } else {
                const text = await res.text();
                return { ok: false, status: res.status, error: text };
            }
        } catch (e) {
            return { ok: false, error: e.message || "عدم برقراری ارتباط با سرور دیتابیس." };
        }
    },

    // دریافت وضعیت ثبت‌نام یک کاربر مشخص در یک رویداد خاص
    getUserRegistration: async function(eventId, personnelCode) {
        const cleanCode = String(personnelCode).trim();
        const localList = this.getLocalRegistrations();
        const localRec = localList.find(r => r.eventId === eventId && String(r.personnelCode).trim() === cleanCode);

        const spConfig = typeof getActiveSupabaseConfig === 'function' ? getActiveSupabaseConfig() : null;
        if (spConfig && spConfig.url && spConfig.anonKey) {
            try {
                const fetchUrl = `${spConfig.url}/rest/v1/${spConfig.table}?event_id=eq.${encodeURIComponent(eventId)}&personnel_code=eq.${encodeURIComponent(cleanCode)}&select=*&limit=1`;
                const res = await fetch(fetchUrl, {
                    method: 'GET',
                    headers: {
                        'apikey': spConfig.anonKey,
                        'Authorization': `Bearer ${spConfig.anonKey}`,
                        'Accept': 'application/json'
                    }
                });
                if (res.ok) {
                    const rows = await res.json();
                    if (Array.isArray(rows) && rows.length > 0) {
                        const r = rows[0];
                        return {
                            id: r.id,
                            eventId: r.event_id || r.eventId,
                            eventTitle: r.event_title || r.eventTitle,
                            personnelCode: r.personnel_code || r.personnelCode,
                            fullName: r.full_name || r.fullName,
                            status: r.status,
                            statusText: r.status_text || r.statusText,
                            timestamp: r.timestamp || r.created_at,
                            jalaliDate: r.jalali_date || r.jalaliDate,
                            userAgent: r.user_agent || r.userAgent
                        };
                    } else {
                        return null; // رکوردی برای این کاربر ثبت نشده است
                    }
                }
            } catch (e) {
                console.warn("خطا در دریافت وضعیت کاربر از دیتابیس:", e);
            }
        }

        return localRec || null;
    },

    // ثبت یا به‌روزرسانی اطلاعات پرسنل (اعلام حضور یا انصراف)
    saveRegistration: async function(formData) {
        // بررسی مهلت ثبت‌نام برای تور کویر ورزنه (پایان مهلت: ۱۴۰۵/۰۶/۲۲ ساعت ۱۳:۰۰)
        if (formData && formData.eventId === 'kavir-varzaneh') {
            const deadline = 1789291800000; // 2026-09-13T13:00:00+03:30 (۱۴۰۵/۰۶/۲۲ ساعت ۱۳:۰۰)
            if (Date.now() > deadline) {
                throw new Error("مهلت ثبت‌نام و انصراف در رویداد تور کویر ورزنه در تاریخ ۱۴۰۵/۰۶/۲۲ ساعت ۱۳:۰۰ به پایان رسیده است.");
            }
        }

        // بررسی مهلت ثبت‌نام برای صبح همدلی (پایان مهلت: ۱۴۰۵/۰۶/۲۱ ساعت ۱۲:۳۰)
        if (formData && formData.eventId === 'sobh-hamdeli') {
            const deadline = 1789203600000; // 2026-09-12T12:30:00+03:30 (۱۴۰۵/۰۶/۲۱ ساعت ۱۲:۳۰)
            if (Date.now() > deadline) {
                throw new Error("مهلت ثبت‌نام و انصراف در رویداد صبح همدلی در تاریخ ۱۴۰۵/۰۶/۲۱ ساعت ۱۲:۳۰ به پایان رسیده است.");
            }
        }

        const timestamp = new Date().toISOString();
        const jalaliDate = this.toJalaliString(timestamp);
        const pCode = String(formData.personnelCode).trim();
        
        const record = {
            id: formData.id || `${formData.eventId}_${pCode}`,
            eventId: formData.eventId,
            eventTitle: formData.eventTitle || (APP_CONFIG.events && APP_CONFIG.events[formData.eventId] ? APP_CONFIG.events[formData.eventId].title : formData.eventId),
            personnelCode: pCode,
            fullName: String(formData.fullName).trim(),
            status: formData.status, // "attending" یا "declined"
            statusText: formData.statusText || (formData.status === "attending" ? "مایل به شرکت در این برنامه هستم" : "عدم حضور / انصراف"),
            timestamp: timestamp,
            jalaliDate: jalaliDate,
            userAgent: navigator.userAgent.substring(0, 100)
        };

        // ۱. همیشه در حافظه محلی ذخیره می‌کنیم (پاسخ آنی و آفلاین)
        const localList = this.getLocalRegistrations();
        const existingIndex = localList.findIndex(r => 
            r.eventId === record.eventId && r.personnelCode === record.personnelCode
        );

        if (existingIndex >= 0) {
            localList[existingIndex] = record;
        } else {
            localList.unshift(record);
        }
        this.setLocalRegistrations(localList);

        let cloudSynced = false;
        let syncSource = null;

        // ۲. ارسال به دیتابیس PostgreSQL (Supabase)
        const spConfig = typeof getActiveSupabaseConfig === 'function' ? getActiveSupabaseConfig() : null;
        if (spConfig && spConfig.url && spConfig.anonKey) {
            try {
                // جهت جلوگیری از ایجاد ردیف‌های تکراری حین انصراف یا ثبت مجدد:
                // ابتدا رکورد قبلی این کاربر در این ایونت پاکسازی شده و سپس رکورد جدید درج می‌شود
                await fetch(`${spConfig.url}/rest/v1/${spConfig.table}?event_id=eq.${encodeURIComponent(record.eventId)}&personnel_code=eq.${encodeURIComponent(record.personnelCode)}`, {
                    method: 'DELETE',
                    headers: {
                        'apikey': spConfig.anonKey,
                        'Authorization': `Bearer ${spConfig.anonKey}`
                    }
                });

                const dbPayload = {
                    id: record.id,
                    event_id: record.eventId,
                    event_title: record.eventTitle,
                    personnel_code: record.personnelCode,
                    full_name: record.fullName,
                    status: record.status,
                    status_text: record.statusText,
                    timestamp: record.timestamp,
                    jalali_date: record.jalaliDate,
                    user_agent: record.userAgent
                };

                const res = await fetch(`${spConfig.url}/rest/v1/${spConfig.table}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': spConfig.anonKey,
                        'Authorization': `Bearer ${spConfig.anonKey}`,
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(dbPayload)
                });

                if (res.ok) {
                    cloudSynced = true;
                    syncSource = 'supabase_postgres';
                } else {
                    const errText = await res.text();
                    console.warn("خطا در ذخیره در Supabase PostgreSQL:", res.status, errText);
                }
            } catch (err) {
                console.warn("عدم برقراری ارتباط با Supabase PostgreSQL:", err);
            }
        }

        // ۳. اگر Supabase فعال نبود یا ناموفق بود، بررسی سایر گزینه‌ها (مثل MockAPI یا Google Apps Script)
        if (!cloudSynced) {
            const cloudUrl = typeof getActiveScriptUrl === 'function' ? getActiveScriptUrl() : null;
            if (cloudUrl) {
                try {
                    if (cloudUrl.includes('script.google.com')) {
                        await fetch(cloudUrl, {
                            method: 'POST',
                            mode: 'no-cors',
                            cache: 'no-cache',
                            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                            body: JSON.stringify({ action: 'register', record: record })
                        });
                        cloudSynced = true;
                        syncSource = 'google_sheets';
                    } else if (cloudUrl.startsWith('http')) {
                        const response = await fetch(cloudUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(record)
                        });
                        if (response.ok) {
                            cloudSynced = true;
                            syncSource = 'rest_api';
                            const savedData = await response.json();
                            if (savedData && savedData.id) {
                                record.cloudId = savedData.id;
                                this.setLocalRegistrations(localList);
                            }
                        }
                    }
                } catch (err) {
                    console.warn("خطا در ارسال به دیتابیس ابری، داده در لوکال ذخیره شد:", err);
                }
            }
        }

        return {
            success: true,
            record: record,
            cloudSynced: cloudSynced,
            source: syncSource || 'local'
        };
    },

    // دریافت داده‌ها برای پنل ادمین
    fetchRegistrations: async function() {
        let localData = this.getLocalRegistrations();

        // ۱. اولویت نخست: خواندن از دیتابیس متمرکز PostgreSQL (Supabase)
        const spConfig = typeof getActiveSupabaseConfig === 'function' ? getActiveSupabaseConfig() : null;
        if (spConfig && spConfig.url && spConfig.anonKey) {
            try {
                const fetchUrl = `${spConfig.url}/rest/v1/${spConfig.table}?select=*&order=created_at.desc`;
                const response = await fetch(fetchUrl, {
                    method: 'GET',
                    headers: {
                        'apikey': spConfig.anonKey,
                        'Authorization': `Bearer ${spConfig.anonKey}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const rows = await response.json();
                    if (Array.isArray(rows)) {
                        const formatted = rows.map(r => ({
                            id: r.id,
                            eventId: r.event_id || r.eventId || '',
                            eventTitle: r.event_title || r.eventTitle || '',
                            personnelCode: r.personnel_code || r.personnelCode || '',
                            fullName: r.full_name || r.fullName || '',
                            status: r.status || '',
                            statusText: r.status_text || r.statusText || (r.status === 'attending' ? 'مایل به شرکت در این برنامه هستم' : 'تمایلی به حضور ندارم'),
                            timestamp: r.timestamp || r.created_at || '',
                            jalaliDate: r.jalali_date || r.jalaliDate || (r.timestamp ? this.toJalaliString(r.timestamp) : ''),
                            userAgent: r.user_agent || r.userAgent || ''
                        }));

                        this.setLocalRegistrations(formatted);
                        return { data: formatted, source: 'supabase_postgres' };
                    }
                } else {
                    const errText = await response.text();
                    console.warn("خطای Supabase PostgreSQL:", response.status, errText);
                }
            } catch (err) {
                console.warn("خطا در ارتباط با Supabase PostgreSQL. از داده‌های محلی استفاده شد:", err);
            }
        }

        // ۲. پشتیبانی از روش‌های قبلی (Google Apps Script / MockAPI)
        const cloudUrl = typeof getActiveScriptUrl === 'function' ? getActiveScriptUrl() : null;
        if (cloudUrl && (!spConfig || !spConfig.url || !spConfig.anonKey)) {
            try {
                let fetchUrl = cloudUrl;
                if (cloudUrl.includes('script.google.com')) {
                    fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 'action=getAll&t=' + Date.now();
                } else {
                    fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
                }

                const response = await fetch(fetchUrl);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        this.setLocalRegistrations(data);
                        return { data: data, source: 'cloud' };
                    }
                }
            } catch (err) {
                console.warn("خطا در ارتباط با دیتابیس ابری قدیمی:", err);
            }
        }

        return { data: localData, source: 'local' };
    },

    // حذف یک رکورد
    deleteRegistration: async function(id) {
        let list = this.getLocalRegistrations();
        const target = list.find(item => item.id === id || String(item.cloudId) === String(id));
        list = list.filter(item => item.id !== id && String(item.cloudId) !== String(id));
        this.setLocalRegistrations(list);

        // ۱. حذف از Supabase PostgreSQL
        const spConfig = typeof getActiveSupabaseConfig === 'function' ? getActiveSupabaseConfig() : null;
        if (spConfig && spConfig.url && spConfig.anonKey) {
            try {
                await fetch(`${spConfig.url}/rest/v1/${spConfig.table}?id=eq.${encodeURIComponent(id)}`, {
                    method: 'DELETE',
                    headers: {
                        'apikey': spConfig.anonKey,
                        'Authorization': `Bearer ${spConfig.anonKey}`
                    }
                });
            } catch (e) {
                console.error("خطا در حذف از Supabase PostgreSQL:", e);
            }
            return true;
        }

        // ۲. حذف از روش قبلی
        const cloudUrl = typeof getActiveScriptUrl === 'function' ? getActiveScriptUrl() : null;
        if (cloudUrl) {
            try {
                if (cloudUrl.includes('script.google.com')) {
                    await fetch(cloudUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify({ action: 'delete', id: id })
                    });
                } else {
                    const targetId = (target && target.cloudId) ? target.cloudId : id;
                    const deleteUrl = cloudUrl.replace(/\/$/, '') + '/' + targetId;
                    await fetch(deleteUrl, { method: 'DELETE' });
                }
            } catch (e) {
                console.error("خطا در حذف ابری:", e);
            }
        }
        return true;
    },

    // پاکسازی کل داده‌های محلی
    clearLocalData: function() {
        this.setLocalRegistrations([]);
    },

    // تولید دیتای تستی
    loadDemoData: function() {
        const demo = [
            {
                id: "demo_1",
                eventId: "sobh-hamdeli",
                eventTitle: "صبح همدلی",
                personnelCode: "98201",
                fullName: "علی محمدی",
                status: "attending",
                statusText: "مایل به شرکت در این برنامه هستم",
                timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                jalaliDate: this.toJalaliString(new Date(Date.now() - 3600000 * 2))
            },
            {
                id: "demo_2",
                eventId: "sobh-hamdeli",
                eventTitle: "صبح همدلی",
                personnelCode: "95104",
                fullName: "سارا حسینی",
                status: "declined",
                statusText: "تمایلی به حضور ندارم",
                timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
                jalaliDate: this.toJalaliString(new Date(Date.now() - 3600000 * 5))
            },
            {
                id: "demo_3",
                eventId: "kavir-varzaneh",
                eventTitle: "تور کویر ورزنه",
                personnelCode: "88450",
                fullName: "رضا ابراهیمی",
                status: "attending",
                statusText: "مایل به شرکت در این برنامه هستم",
                timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
                jalaliDate: this.toJalaliString(new Date(Date.now() - 3600000 * 8))
            },
            {
                id: "demo_4",
                eventId: "kavir-varzaneh",
                eventTitle: "تور کویر ورزنه",
                personnelCode: "91032",
                fullName: "مریم احمدی",
                status: "attending",
                statusText: "مایل به شرکت در این برنامه هستم",
                timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
                jalaliDate: this.toJalaliString(new Date(Date.now() - 3600000 * 12))
            },
            {
                id: "demo_5",
                eventId: "rafting-markadeh",
                eventTitle: "تور رفتینگ مارکده",
                personnelCode: "97315",
                fullName: "حسین صادقی",
                status: "attending",
                statusText: "مایل به شرکت در این برنامه هستم",
                timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
                jalaliDate: this.toJalaliString(new Date(Date.now() - 3600000 * 1))
            },
            {
                id: "demo_6",
                eventId: "rafting-markadeh",
                eventTitle: "تور رفتینگ مارکده",
                personnelCode: "99120",
                fullName: "الهام کریمی",
                status: "declined",
                statusText: "تمایلی به حضور ندارم",
                timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
                jalaliDate: this.toJalaliString(new Date(Date.now() - 3600000 * 3))
            }
        ];
        this.setLocalRegistrations(demo);
        return demo;
    },

    // خروجی استاندارد اکسل (CSV با UTF-8 BOM)
    exportToExcel: function(dataToExport = null) {
        const list = dataToExport || this.getLocalRegistrations();
        if (list.length === 0) {
            alert("داده‌ای برای خروجی اکسل وجود ندارد.");
            return;
        }

        const headers = ["ردیف", "شناسه رویداد", "نام رویداد", "شماره پرسنلی", "نام و نام خانوادگی", "وضعیت حضور", "تاریخ و زمان ثبت"];
        
        let csvContent = "\uFEFF";
        csvContent += headers.join(",") + "\r\n";

        list.forEach((item, index) => {
            const row = [
                index + 1,
                `"${(item.eventId || '').replace(/"/g, '""')}"`,
                `"${(item.eventTitle || '').replace(/"/g, '""')}"`,
                `="${item.personnelCode || ''}"`,
                `"${(item.fullName || '').replace(/"/g, '""')}"`,
                `"${(item.status === 'attending' ? 'مایل به شرکت' : 'عدم حضور')}"`,
                `"${(item.jalaliDate || item.timestamp || '').replace(/"/g, '""')}"`
            ];
            csvContent += row.join(",") + "\r\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const now = new Date().toISOString().slice(0, 10);
        link.setAttribute("href", url);
        link.setAttribute("download", `گزارش_ثبت_نام_ایونت_های_انتخاب_${now}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};
