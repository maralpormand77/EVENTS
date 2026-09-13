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

    // کلید ذخیره‌سازی تنظیمات مهلت رویدادها در لوکال استوریج
    DEADLINES_KEY: "entekhab_events_deadlines_config",

    // تنظیمات پیش‌فرض رویدادها
    getDefaultEventSettings: function(eventId) {
        const defaults = {
            'sobh-hamdeli': {
                eventId: 'sobh-hamdeli',
                isClosed: false,
                capacity: 0,
                deadlineDate: '',
                deadlineTime: '',
                deadlineTimestamp: 0,
                deadlineJalali: '',
                isRestricted: false,
                allowedPersonnel: [],
                customTexts: {
                    title: 'صبح همدلی',
                    subtitle: 'پیاده روی مدیران گروه توسعه سرمایه گذاری انتخاب',
                    tag: 'رویداد ویژه سلامت و همدلی',
                    posterUrl: '',
                    label1: 'تاریخ و روز برگزاری',
                    dateText: 'یکشنبه ۲۲/۰۶/۱۴۰۵',
                    label2: 'زمان گردهمایی',
                    timeText: 'ساعت ۰۶:۳۰ صبح',
                    label3: 'مکان گردهمایی',
                    locationText: 'خیابان نشاط، کوچه ۲۰، عمارت ماهور',
                    notesTitle: 'نکات مهم حضور در برنامه:',
                    notesText: 'لطفاً با لباس و کفش مناسب جهت پیاده‌روی و نرمش صبحگاهی حضور به‌هم رسانید.\nجهت برنامه‌ریزی هرچه بهتر پذیرایی و امور هماهنگی، خواهشمند است تمایل یا عدم تمایل خود به حضور را از طریق فرم زیر ثبت فرمایید.',
                    formTitle: 'اعلام وضعیت حضور در برنامه',
                    btnAttendText: 'مایل به شرکت در این برنامه هستم',
                    btnDeclineText: 'تمایلی به حضور ندارم',
                    deadlineTitle: 'مهلت ثبت‌نام به پایان رسیده است',
                    deadlineDesc: 'همکار گرامی، مهلت اعلام حضور و ثبت‌نام در رویداد «صبح همدلی» به پایان رسیده است و در حال حاضر امکان ثبت‌نام جدید وجود ندارد.'
                }
            },
            'kavir-varzaneh': {
                eventId: 'kavir-varzaneh',
                isClosed: false,
                capacity: 0,
                deadlineDate: '1405/06/22',
                deadlineTime: '13:00',
                deadlineTimestamp: 1789291800000,
                deadlineJalali: '۱۴۰۵/۰۶/۲۲ ساعت ۱۳:۰۰',
                isRestricted: false,
                allowedPersonnel: [],
                customTexts: {
                    title: 'تور کویر ورزنه',
                    subtitle: 'رویداد علمی تفریحی گروه توسعه سرمایه گذاری انتخاب',
                    tag: 'رویداد علمی تفریحی',
                    posterUrl: 'assets/images/kavir.jpg?v=2',
                    label1: 'زمان حرکت',
                    dateText: 'چهارشنبه ۲۵/۰۶/۱۴۰۵ ساعت ۱۴:۰۰',
                    label2: 'زمان بازگشت',
                    timeText: 'پنجشنبه ۲۶/۰۶/۱۴۰۵ ساعت ۱۳:۰۰',
                    label3: 'مکان گردهمایی و سوار شدن',
                    locationText: 'ساختمان مرکزی گروه توسعه سرمایه‌گذاری انتخاب (خیابان امام خمینی)',
                    notesTitle: 'نکات مهم حضور در برنامه:',
                    notesText: 'مهلت ثبت نام نهایتا تا ساعت 13:00 روز یکشنبه مورخ 1405/06/22 می باشد.\nدرصورت ثبت نام و عدم حضور هزینه سرانه از حقوق همکار کسر خواهد شد.\nلطفاً با توجه به محدودیت‌های هماهنگی اقامت و ترابری، در اسرع وقت وضعیت خود را ثبت کنید.\nوسایل شخصی سبک، کلاه و عینک آفتابی، و کفش مناسب کویر همراه داشته باشید.',
                    formTitle: 'اعلام وضعیت حضور در برنامه',
                    btnAttendText: 'مایل به شرکت در این برنامه هستم',
                    btnDeclineText: 'تمایلی به حضور ندارم',
                    deadlineTitle: 'مهلت ثبت‌نام به پایان رسیده است',
                    deadlineDesc: 'همکار گرامی، مهلت اعلام حضور و ثبت‌نام در رویداد «تور کویر ورزنه» به پایان رسیده است و در حال حاضر امکان ثبت‌نام جدید وجود ندارد.'
                }
            },
            'rafting-markadeh': {
                eventId: 'rafting-markadeh',
                isClosed: false,
                capacity: 0,
                deadlineDate: '',
                deadlineTime: '',
                deadlineTimestamp: 0,
                deadlineJalali: '',
                isRestricted: false,
                allowedPersonnel: [],
                customTexts: {
                    title: 'تور رفتینگ مارکده',
                    subtitle: 'ایونت تفریحی گروه توسعه سرمایه گذاری انتخاب',
                    tag: 'ایونت هیجان‌انگیز ورزشی و تفریحی',
                    posterUrl: '',
                    label1: 'زمان حرکت',
                    dateText: 'پنجشنبه ۰۲/۰۷/۱۴۰۵ ساعت ۰۶:۰۰',
                    label2: 'زمان بازگشت',
                    timeText: 'پنجشنبه ۰۲/۰۷/۱۴۰۵ ساعت ۱۸:۰۰',
                    label3: 'مکان گردهمایی و حرکت',
                    locationText: 'ساختمان مرکزی گروه توسعه سرمایه‌گذاری انتخاب',
                    notesTitle: 'جهت بهره‌مندی هرچه بیشتر از این سفر، موضوعات ذیل را مد نظر قرار دهید:',
                    notesText: '۱- همراه داشتن لوازم شخصی (دارو، کرم ضد آفتاب، کلاه، تیشرت آستین بلند، عینک آفتابی، دستمال مرطوب و ...)\n۲- با توجه به مواجهه با آب، حتماً یک دست لباس اضافه و حوله همراه داشته باشید.\n۳- از آوردن هرگونه زیورآلات، ساعت و اکسسوری غیر ضروری خودداری فرمائید.\n۴- با توجه به حضور در رودخانه، همراه داشتن صندل بندی می‌تواند کارایی بالایی داشته باشد.\nوسایل مورد نیاز جهت صرف غذا و پذیرایی: لیوان، قاشق و چنگال شخصی',
                    formTitle: 'اعلام وضعیت حضور در برنامه',
                    btnAttendText: 'مایل به شرکت در این برنامه هستم',
                    btnDeclineText: 'تمایلی به حضور ندارم',
                    deadlineTitle: 'مهلت ثبت‌نام به پایان رسیده است',
                    deadlineDesc: 'همکار گرامی، مهلت اعلام حضور و ثبت‌نام در رویداد «تور رفتینگ مارکده» به پایان رسیده است و در حال حاضر امکان ثبت‌نام جدید وجود ندارد.'
                }
            }
        };

        return defaults[eventId] || {
            eventId: eventId,
            isClosed: false,
            capacity: 0,
            deadlineDate: '',
            deadlineTime: '',
            deadlineTimestamp: 0,
            deadlineJalali: '',
            isRestricted: false,
            allowedPersonnel: [],
            customTexts: {
                title: '',
                subtitle: '',
                tag: '',
                posterUrl: '',
                label1: '',
                dateText: '',
                label2: '',
                timeText: '',
                label3: '',
                locationText: '',
                notesTitle: '',
                notesText: '',
                formTitle: '',
                btnAttendText: '',
                btnDeclineText: '',
                deadlineTitle: '',
                deadlineDesc: ''
            }
        };
    },

    // تبدیل تاریخ جلالی و ساعت به تایم‌استمپ میلی‌ثانیه با تایم‌زون ایران (+03:30)
    jalaliToTimestamp: function(dateStr, timeStr = "23:59") {
        try {
            if (!dateStr || !dateStr.trim()) return 0;
            const cleanDate = dateStr.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).trim();
            const cleanTime = (timeStr || "23:59").replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).trim();

            const dParts = cleanDate.split(/[\/\-\.]/).map(p => parseInt(p, 10));
            if (dParts.length < 3) return 0;
            const jy = dParts[0];
            const jm = dParts[1];
            const jd = dParts[2];

            const tParts = cleanTime.split(/[:]/).map(p => parseInt(p, 10));
            const hour = tParts.length > 0 && !isNaN(tParts[0]) ? tParts[0] : 23;
            const min = tParts.length > 1 && !isNaN(tParts[1]) ? tParts[1] : 59;

            let gy;
            let remJy = jy;
            if (remJy > 979) {
                gy = 1600;
                remJy -= 979;
            } else {
                gy = 621;
            }
            let days = (365 * remJy) + (Math.floor(remJy / 33) * 8) + Math.floor(((remJy % 33) + 3) / 4) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : (((jm - 7) * 30) + 186));
            gy += 400 * Math.floor(days / 146097);
            days %= 146097;
            if (days > 36524) {
                gy += 100 * Math.floor(--days / 36524);
                days %= 36524;
                if (days >= 365) days++;
            }
            gy += 4 * Math.floor(days / 1461);
            days %= 1461;
            if (days > 365) {
                gy += Math.floor((days - 1) / 365);
                days = (days - 1) % 365;
            }
            let gd = days + 1;
            const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let gm;
            for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];

            const pad = n => String(n).padStart(2, '0');
            const isoStr = `${gy}-${pad(gm)}-${pad(gd)}T${pad(hour)}:${pad(min)}:00+03:30`;
            const ts = Date.parse(isoStr);
            return isNaN(ts) ? 0 : ts;
        } catch (e) {
            console.warn("خطا در تبدیل تاریخ شمسی به تایم‌استمپ:", e);
            return 0;
        }
    },

    // دریافت تنظیمات ثبت‌نام تمام رویدادها (با همگام‌سازی از دیتابیس متمرکز)
    getAllEventSettings: async function() {
        let settings = {};
        try {
            const raw = localStorage.getItem(this.DEADLINES_KEY);
            if (raw) settings = JSON.parse(raw);
        } catch (e) {}

        const eventIds = ['sobh-hamdeli', 'kavir-varzaneh', 'rafting-markadeh'];
        for (const id of eventIds) {
            if (!settings[id]) {
                settings[id] = this.getDefaultEventSettings(id);
            }
        }

        const spConfig = typeof getActiveSupabaseConfig === 'function' ? getActiveSupabaseConfig() : null;
        if (spConfig && spConfig.url && spConfig.anonKey) {
            try {
                const fetchUrl = `${spConfig.url}/rest/v1/${spConfig.table}?event_id=eq.__settings__&select=*`;
                const res = await fetch(fetchUrl, {
                    headers: {
                        'apikey': spConfig.anonKey,
                        'Authorization': `Bearer ${spConfig.anonKey}`,
                        'Accept': 'application/json'
                    }
                });
                if (res.ok) {
                    const rows = await res.json();
                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            try {
                                const parsed = JSON.parse(row.status_text || '{}');
                                if (parsed && parsed.eventId) {
                                    settings[parsed.eventId] = Object.assign({}, settings[parsed.eventId], parsed);
                                }
                            } catch (err) {}
                        }
                        localStorage.setItem(this.DEADLINES_KEY, JSON.stringify(settings));
                    }
                }
            } catch (e) {
                console.warn("خطا در همگام‌سازی تنظیمات از Supabase:", e);
            }
        }

        return settings;
    },

    // دریافت تنظیمات یک رویداد
    getEventSettings: async function(eventId) {
        const all = await this.getAllEventSettings();
        return all[eventId] || this.getDefaultEventSettings(eventId);
    },

    // بررسی اینکه آیا ثبت‌نام یک رویداد به پایان رسیده یا بسته است
    isEventClosed: function(eventId, cachedSettings = null) {
        let setting = null;
        if (cachedSettings && cachedSettings[eventId]) {
            setting = cachedSettings[eventId];
        } else {
            try {
                const raw = localStorage.getItem(this.DEADLINES_KEY);
                if (raw) {
                    const all = JSON.parse(raw);
                    setting = all[eventId];
                }
            } catch (e) {}
        }
        if (!setting) {
            setting = this.getDefaultEventSettings(eventId);
        }

        if (setting.isClosed === true) return true;
        if (setting.deadlineTimestamp && setting.deadlineTimestamp > 0) {
            if (Date.now() > setting.deadlineTimestamp) return true;
        }
        return false;
    },

    // بررسی اینکه آیا پرسنل مجاز به شرکت در رویداد است یا خیر (محدودیت افراد مجاز)
    isPersonnelAllowed: function(eventId, personnelCode, nationalCode = null, cachedSettings = null) {
        let setting = null;
        if (cachedSettings && cachedSettings[eventId]) {
            setting = cachedSettings[eventId];
        } else {
            try {
                const raw = localStorage.getItem(this.DEADLINES_KEY);
                if (raw) {
                    const all = JSON.parse(raw);
                    setting = all[eventId];
                }
            } catch (e) {}
        }
        if (!setting) {
            setting = this.getDefaultEventSettings(eventId);
        }

        // اگر رویداد محدود نشده یا لیست خالی باشد، همه پرسنل مجاز به ثبت‌نام هستند
        if (!setting.isRestricted || !setting.allowedPersonnel || !Array.isArray(setting.allowedPersonnel) || setting.allowedPersonnel.length === 0) {
            return true;
        }

        const cleanCode = String(personnelCode || '')
            .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
            .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
            .trim();
        const cleanNat = String(nationalCode || '')
            .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
            .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
            .trim();

        if (!cleanCode && !cleanNat) return false;

        return setting.allowedPersonnel.some(item => {
            if (!item) return false;
            let itemCode = '';
            let itemNat = '';
            if (typeof item === 'string' || typeof item === 'number') {
                itemCode = String(item).replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).trim();
            } else if (typeof item === 'object') {
                itemCode = String(item.code || item.personnelCode || '').replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).trim();
                itemNat = String(item.nationalCode || '').replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).trim();
            }

            if (cleanCode && itemCode) {
                if (itemCode === cleanCode) return true;
                if (itemCode.replace(/^0+/, '') === cleanCode.replace(/^0+/, '')) return true;
            }
            if (cleanNat && (itemNat || itemCode)) {
                if (itemNat && itemNat === cleanNat) return true;
                if (itemCode === cleanNat) return true;
            }
            return false;
        });
    },

    // ذخیره یا به‌روزرسانی لیست پرسنل مجاز برای یک رویداد
    saveEventAllowedPersonnel: async function(eventId, allowedList, isRestricted = true) {
        return await this.saveEventSettings(eventId, {
            isRestricted: isRestricted && Array.isArray(allowedList) && allowedList.length > 0,
            allowedPersonnel: Array.isArray(allowedList) ? allowedList : []
        });
    },

    // حذف محدودیت افراد مجاز و عمومی‌سازی رویداد برای کلیه همکاران
    clearEventAllowedPersonnel: async function(eventId) {
        return await this.saveEventSettings(eventId, {
            isRestricted: false,
            allowedPersonnel: []
        });
    },

    // ذخیره تنظیمات مهلت و وضعیت ثبت‌نام توسط ادمین
    saveEventSettings: async function(eventId, newSetting) {
        // ۱. دریافت آخرین تنظیمات کامل متمرکز از دیتابیس ابری (جهت جلوگیری از پاک شدن ناخواسته لیست افراد مجاز یا تنظیمات قبلی)
        let all = {};
        try {
            all = await this.getAllEventSettings();
        } catch (e) {
            try {
                const raw = localStorage.getItem(this.DEADLINES_KEY);
                if (raw) all = JSON.parse(raw);
            } catch (err) {}
        }

        const def = this.getDefaultEventSettings(eventId);
        const existing = (all && all[eventId]) ? all[eventId] : def;

        // حفظ حتمی محدودیت دسترسی و افراد مجاز در صورت عدم ارسال در newSetting
        const isRestricted = (newSetting.isRestricted !== undefined) 
            ? Boolean(newSetting.isRestricted) 
            : (existing.isRestricted === true);

        const allowedPersonnel = (newSetting.allowedPersonnel !== undefined) 
            ? (Array.isArray(newSetting.allowedPersonnel) ? newSetting.allowedPersonnel : [])
            : (Array.isArray(existing.allowedPersonnel) ? existing.allowedPersonnel : []);

        const isClosed = (newSetting.isClosed !== undefined)
            ? Boolean(newSetting.isClosed)
            : (existing.isClosed === true);

        const capacity = (newSetting.capacity !== undefined)
            ? Math.max(0, parseInt(newSetting.capacity, 10) || 0)
            : Math.max(0, parseInt(existing.capacity, 10) || 0);

        const merged = Object.assign({}, def, existing, newSetting);
        merged.eventId = eventId;
        merged.isRestricted = isRestricted;
        merged.allowedPersonnel = allowedPersonnel;
        merged.isClosed = isClosed;
        merged.capacity = capacity;
        merged.updatedAt = new Date().toISOString();

        if (newSetting.customTexts || existing.customTexts || def.customTexts) {
            merged.customTexts = Object.assign({}, def.customTexts || {}, existing.customTexts || {}, newSetting.customTexts || {});
        }

        if (merged.deadlineDate && merged.deadlineDate.trim()) {
            merged.deadlineTimestamp = this.jalaliToTimestamp(merged.deadlineDate, merged.deadlineTime || "23:59");
            merged.deadlineJalali = `${merged.deadlineDate} ساعت ${merged.deadlineTime || '۲۳:۵۹'}`;
        } else if (!merged.isClosed) {
            merged.deadlineTimestamp = 0;
            merged.deadlineJalali = '';
        }

        all[eventId] = merged;
        try {
            localStorage.setItem(this.DEADLINES_KEY, JSON.stringify(all));
        } catch (e) {}

        // ذخیره در Supabase PostgreSQL
        const spConfig = typeof getActiveSupabaseConfig === 'function' ? getActiveSupabaseConfig() : null;
        if (spConfig && spConfig.url && spConfig.anonKey) {
            try {
                const recordId = `__config_event_${eventId}`;
                await fetch(`${spConfig.url}/rest/v1/${spConfig.table}?id=eq.${encodeURIComponent(recordId)}`, {
                    method: 'DELETE',
                    headers: {
                        'apikey': spConfig.anonKey,
                        'Authorization': `Bearer ${spConfig.anonKey}`
                    }
                });

                const payload = {
                    id: recordId,
                    event_id: '__settings__',
                    event_title: `CONFIG_${eventId}`,
                    personnel_code: '__CONFIG__',
                    full_name: `تنظیمات رویداد ${eventId}`,
                    status: merged.isClosed ? 'closed' : 'open',
                    status_text: JSON.stringify(merged),
                    timestamp: new Date().toISOString(),
                    jalali_date: this.toJalaliString(new Date()),
                    user_agent: 'Admin Panel Config'
                };

                await fetch(`${spConfig.url}/rest/v1/${spConfig.table}`, {
                    method: 'POST',
                    headers: {
                        'apikey': spConfig.anonKey,
                        'Authorization': `Bearer ${spConfig.anonKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                console.warn("خطا در ذخیره تنظیمات در دیتابیس:", err);
            }
        }

        return Object.assign({ success: true, settings: merged }, merged);
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
                        // اگر در دیتابیس آنلاین رکوردی نبود ولی در حافظه محلی ذخیره شده بود (مثلاً توسط ادمین حذف شده)، کش محلی را پاکسازی می‌کنیم
                        if (localRec) {
                            const updatedList = localList.filter(r => !(r.eventId === eventId && String(r.personnelCode).trim() === cleanCode));
                            this.setLocalRegistrations(updatedList);
                        }
                        return null; // رکوردی برای این کاربر ثبت نشده است
                    }
                }
            } catch (e) {
                console.warn("خطا در دریافت وضعیت کاربر از دیتابیس:", e);
            }
        }

        return localRec || null;
    },

    // دریافت تعداد افراد مایل به شرکت (attending) در یک رویداد خاص
    getEventAttendingCount: async function(eventId, excludePersonnelCode = null) {
        let cleanExclude = excludePersonnelCode ? String(excludePersonnelCode).trim() : null;

        const spConfig = typeof getActiveSupabaseConfig === 'function' ? getActiveSupabaseConfig() : null;
        if (spConfig && spConfig.url && spConfig.anonKey) {
            try {
                const fetchUrl = `${spConfig.url}/rest/v1/${spConfig.table}?event_id=eq.${encodeURIComponent(eventId)}&status=eq.attending&select=personnel_code`;
                const res = await fetch(fetchUrl, {
                    headers: {
                        'apikey': spConfig.anonKey,
                        'Authorization': `Bearer ${spConfig.anonKey}`,
                        'Accept': 'application/json'
                    }
                });
                if (res.ok) {
                    const rows = await res.json();
                    if (Array.isArray(rows)) {
                        const filtered = cleanExclude 
                            ? rows.filter(r => String(r.personnel_code || '').trim() !== cleanExclude)
                            : rows;
                        return filtered.length;
                    }
                }
            } catch (e) {
                console.warn("خطا در شمارش افراد حاضر از دیتابیس:", e);
            }
        }

        const localList = this.getLocalRegistrations();
        const attendingList = localList.filter(r => 
            r.eventId === eventId && 
            r.status === 'attending' &&
            (!cleanExclude || String(r.personnelCode).trim() !== cleanExclude)
        );
        return attendingList.length;
    },

    // بررسی تکمیل بودن حد نصاب رویداد
    // نکته کلیدی: فقط و فقط تعداد افراد "attending" (مایل به شرکت) شمارش می‌شود
    isEventCapacityFull: async function(eventId, userPersonnelCode = null) {
        try {
            const setting = await this.getEventSettings(eventId);
            const cap = parseInt(setting.capacity, 10) || 0;
            if (cap <= 0) {
                return { isFull: false, capacity: 0, currentCount: 0 };
            }
            const currentCount = await this.getEventAttendingCount(eventId, userPersonnelCode);
            return {
                isFull: currentCount >= cap,
                capacity: cap,
                currentCount: currentCount
            };
        } catch (e) {
            return { isFull: false, capacity: 0, currentCount: 0 };
        }
    },

    // ثبت یا به‌روزرسانی اطلاعات پرسنل (اعلام حضور یا انصراف)
    saveRegistration: async function(formData) {
        // ۱. بررسی هوشمند وضعیت پایان مهلت یا مسدودی ثبت‌نام بر اساس تنظیمات ادمین و دیتابیس
        if (formData && formData.eventId) {
            if (this.isEventClosed(formData.eventId)) {
                throw new Error("مهلت ثبت‌نام یا انصراف در این رویداد به پایان رسیده است و امکان تغییر وضعیت وجود ندارد.");
            }

            // ۲. بررسی حد نصاب رویداد: در صورت تکمیل حد نصاب، ثبت تمایل یا عدم تمایل جدید امکان‌پذیر نیست
            const capCheck = await this.isEventCapacityFull(formData.eventId, formData.personnelCode);
            if (capCheck.isFull) {
                const localListCheck = this.getLocalRegistrations() || [];
                const existing = localListCheck.find(r => 
                    r.eventId === formData.eventId && String(r.personnelCode).trim() === pCode
                );
                if (!existing || existing.status !== 'attending' || formData.status === 'attending') {
                    throw new Error("تعداد ثبت نام نفرات به حد نصاب رسیده است");
                }
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
        let localData = (this.getLocalRegistrations() || []).filter(r => {
            const ev = r.eventId || r.event_id || '';
            const pc = r.personnelCode || r.personnel_code || '';
            return ev !== '__settings__' && ev !== '__master_personnel__' && pc !== '__CONFIG__' && pc !== '__BANK__';
        });

        // ۱. اولویت نخست: خواندن از دیتابیس متمرکز PostgreSQL (Supabase)
        const spConfig = typeof getActiveSupabaseConfig === 'function' ? getActiveSupabaseConfig() : null;
        if (spConfig && spConfig.url && spConfig.anonKey) {
            try {
                const fetchUrl = `${spConfig.url}/rest/v1/${spConfig.table}?event_id=in.(sobh-hamdeli,kavir-varzaneh,rafting-markadeh)&select=id,event_id,event_title,personnel_code,full_name,status,status_text,timestamp,jalali_date,user_agent,created_at&order=created_at.desc`;
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
                        const formatted = rows
                            .filter(r => {
                                const ev = r.event_id || r.eventId || '';
                                const pc = r.personnel_code || r.personnelCode || '';
                                return ev !== '__settings__' && ev !== '__master_personnel__' && pc !== '__CONFIG__' && pc !== '__BANK__';
                            })
                            .map(r => ({
                                id: r.id,
                                eventId: r.event_id || r.eventId || '',
                                event_id: r.event_id || r.eventId || '',
                                eventTitle: r.event_title || r.eventTitle || '',
                                event_title: r.event_title || r.eventTitle || '',
                                personnelCode: r.personnel_code || r.personnelCode || '',
                                personnel_code: r.personnel_code || r.personnelCode || '',
                                fullName: r.full_name || r.fullName || '',
                                full_name: r.full_name || r.fullName || '',
                                status: r.status || '',
                                statusText: r.status_text || r.statusText || (r.status === 'attending' ? 'مایل به شرکت در این برنامه هستم' : 'تمایلی به حضور ندارم'),
                                status_text: r.status_text || r.statusText || '',
                                timestamp: r.timestamp || r.created_at || '',
                                jalaliDate: r.jalali_date || r.jalaliDate || (r.timestamp ? this.toJalaliString(r.timestamp) : ''),
                                jalali_date: r.jalali_date || r.jalaliDate || '',
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

    // حذف یک رکورد (پشتیبانی جامع از شناسه رکورد، شناسه رویداد و شماره پرسنلی)
    deleteRegistration: async function(id, eventId = null, personnelCode = null) {
        let list = this.getLocalRegistrations();
        const target = list.find(item => item.id === id || String(item.cloudId) === String(id));

        const targetEventId = eventId || (target ? target.eventId : null);
        const targetPCode = personnelCode ? String(personnelCode).trim() : (target ? String(target.personnelCode).trim() : null);

        // ۱. حذف از حافظه محلی
        list = list.filter(item => {
            if (item.id === id || String(item.cloudId) === String(id)) return false;
            if (targetEventId && targetPCode && item.eventId === targetEventId && String(item.personnelCode).trim() === targetPCode) return false;
            return true;
        });
        this.setLocalRegistrations(list);

        // ۲. حذف از Supabase PostgreSQL
        const spConfig = typeof getActiveSupabaseConfig === 'function' ? getActiveSupabaseConfig() : null;
        if (spConfig && spConfig.url && spConfig.anonKey) {
            const headers = {
                'apikey': spConfig.anonKey,
                'Authorization': `Bearer ${spConfig.anonKey}`,
                'Prefer': 'return=minimal'
            };

            let deleteError = null;
            try {
                const deletePromises = [];
                // الف) حذف بر اساس id
                if (id) {
                    deletePromises.push(
                        fetch(`${spConfig.url}/rest/v1/${spConfig.table}?id=eq.${encodeURIComponent(id)}`, {
                            method: 'DELETE',
                            headers: headers
                        })
                    );
                }

                // ب) حذف مضاعف بر اساس ترکیب event_id و personnel_code جهت تضمین ۱۰۰٪ پاک شدن در دیتابیس
                if (targetEventId && targetPCode) {
                    deletePromises.push(
                        fetch(`${spConfig.url}/rest/v1/${spConfig.table}?event_id=eq.${encodeURIComponent(targetEventId)}&personnel_code=eq.${encodeURIComponent(targetPCode)}`, {
                            method: 'DELETE',
                            headers: headers
                        })
                    );
                }

                if (deletePromises.length > 0) {
                    await Promise.all(deletePromises);
                }
            } catch (e) {
                console.error("خطا در حذف از Supabase PostgreSQL:", e);
                deleteError = e;
            }

            if (deleteError) {
                throw new Error("خطا در برقراری ارتباط با دیتابیس ابری جهت حذف رکورد: " + (deleteError.message || deleteError));
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
            const evId = item.eventId || item.event_id || '';
            const evTitle = item.eventTitle || item.event_title || '';
            const pCode = item.personnelCode || item.personnel_code || '';
            const fName = item.fullName || item.full_name || '';
            const stText = item.status === 'attending' 
                ? 'مایل به شرکت' 
                : (item.status === 'declined' ? 'عدم حضور' : (item.statusText || item.status_text || item.status || ''));
            const jDate = item.jalaliDate || item.jalali_date || item.timestamp || '';
            const row = [
                index + 1,
                `"${String(evId).replace(/"/g, '""')}"`,
                `"${String(evTitle).replace(/"/g, '""')}"`,
                `="${String(pCode).replace(/"/g, '""')}"`,
                `"${String(fName).replace(/"/g, '""')}"`,
                `"${String(stText).replace(/"/g, '""')}"`,
                `"${String(jDate).replace(/"/g, '""')}"`
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
    },

    // کلیدهای ذخیره‌سازی بانک اطلاعات پرسنل در کش مرورگر
    PERSONNEL_CACHE_KEY: "entekhab_custom_personnel_map",
    PERSONNEL_CACHE_TIME_KEY: "entekhab_custom_personnel_time",

    // همگام‌سازی بانک پرسنل از دیتابیس ابری Supabase در تمامی صفحات (بدون نیاز به گیت)
    syncMasterPersonnelBank: async function() {
        // ۱. مقداردهی فوری از کش محلی
        try {
            const cached = localStorage.getItem(this.PERSONNEL_CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
                    window.PERSONNEL_MAP = Object.assign({}, window.PERSONNEL_MAP || {}, parsed);
                }
            }
        } catch(e) {}

        // ۲. دریافت از دیتابیس متمرکز ابری Supabase
        const spConfig = typeof getActiveSupabaseConfig === 'function' ? getActiveSupabaseConfig() : null;
        if (!spConfig || !spConfig.url || !spConfig.anonKey) return;

        try {
            const cachedTime = localStorage.getItem(this.PERSONNEL_CACHE_TIME_KEY);
            // بررسی سریع با دریافت تنها فیلد timestamp جهت جلوگیری از دانلود مجدد ۸۰۰ کیلوبایت داده در هر لود صفحه
            const headUrl = `${spConfig.url}/rest/v1/${spConfig.table}?event_id=eq.__master_personnel__&select=id,timestamp&order=id.asc&limit=1`;
            const headRes = await fetch(headUrl, {
                headers: {
                    'apikey': spConfig.anonKey,
                    'Authorization': `Bearer ${spConfig.anonKey}`,
                    'Accept': 'application/json'
                }
            });

            if (headRes.ok) {
                const headRows = await headRes.json();
                if (Array.isArray(headRows) && headRows.length > 0) {
                    const serverTimestamp = headRows[0].timestamp;
                    if (serverTimestamp && cachedTime && serverTimestamp === cachedTime && window.PERSONNEL_MAP && Object.keys(window.PERSONNEL_MAP).length > 100) {
                        return window.PERSONNEL_MAP;
                    }
                }
            }

            const fetchUrl = `${spConfig.url}/rest/v1/${spConfig.table}?event_id=eq.__master_personnel__&select=id,status_text,timestamp&order=id.asc`;
            const res = await fetch(fetchUrl, {
                headers: {
                    'apikey': spConfig.anonKey,
                    'Authorization': `Bearer ${spConfig.anonKey}`,
                    'Accept': 'application/json'
                }
            });

            if (res.ok) {
                const rows = await res.json();
                if (Array.isArray(rows) && rows.length > 0) {
                    let mergedMap = {};
                    for (const row of rows) {
                        if (row.status_text) {
                            try {
                                const chunk = JSON.parse(row.status_text);
                                if (chunk && typeof chunk === 'object') {
                                    Object.assign(mergedMap, chunk);
                                }
                            } catch(err) {}
                        }
                    }

                    if (Object.keys(mergedMap).length > 0) {
                        window.PERSONNEL_MAP = Object.assign({}, window.PERSONNEL_MAP || {}, mergedMap);
                        try {
                            localStorage.setItem(this.PERSONNEL_CACHE_KEY, JSON.stringify(mergedMap));
                            if (rows[0].timestamp) {
                                localStorage.setItem(this.PERSONNEL_CACHE_TIME_KEY, rows[0].timestamp);
                            }
                        } catch(e) {}
                        return mergedMap;
                    }
                }
            }
        } catch(err) {
            console.warn("همگام‌سازی ابری بانک پرسنل:", err);
        }
    },

    // ذخیره و انتشار بانک پرسنل در دیتابیس ابری متمرکز (توسط هر ادمینی، بدون نیاز به گیت)
    saveMasterPersonnelBank: async function(personnelMap, onProgress = null) {
        if (!personnelMap || typeof personnelMap !== 'object') {
            throw new Error("داده‌های پرسنل نامعتبر است.");
        }

        const totalCount = Object.keys(personnelMap).length;
        if (totalCount === 0) {
            throw new Error("لیست پرسنل خالی است.");
        }

        // اطمینان از دسترسی ادمین‌ها
        if (!personnelMap['992113']) personnelMap['992113'] = ['مارال پورمند', '1272744868'];
        if (!personnelMap['980253']) personnelMap['980253'] = ['حسن لندی', '1272126803'];

        // ۱. اعمال فوری در حافظه جاری مرورگر
        window.PERSONNEL_MAP = personnelMap;
        const nowIso = new Date().toISOString();
        try {
            localStorage.setItem(this.PERSONNEL_CACHE_KEY, JSON.stringify(personnelMap));
            localStorage.setItem(this.PERSONNEL_CACHE_TIME_KEY, nowIso);
        } catch(e) {}

        // ۲. ذخیره در Supabase
        const spConfig = typeof getActiveSupabaseConfig === 'function' ? getActiveSupabaseConfig() : null;
        if (!spConfig || !spConfig.url || !spConfig.anonKey) {
            throw new Error("تنظیمات دیتابیس ابری Supabase یافت نشد.");
        }

        const headers = {
            'apikey': spConfig.anonKey,
            'Authorization': `Bearer ${spConfig.anonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        };

        const entries = Object.entries(personnelMap);
        const CHUNK_SIZE = 5000;
        const totalChunks = Math.ceil(entries.length / CHUNK_SIZE);

        for (let c = 0; c < totalChunks; c++) {
            const chunkSlice = entries.slice(c * CHUNK_SIZE, (c + 1) * CHUNK_SIZE);
            const chunkObj = Object.fromEntries(chunkSlice);
            const chunkId = `__master_personnel_part_${c + 1}`;

            if (onProgress) {
                onProgress(c + 1, totalChunks, `در حال ذخیره بخش ${c + 1} از ${totalChunks} در فضای ابری (${chunkSlice.length} رکورد)...`);
            }

            // ۱. حذف رکورد قبلی با شناسه مشخص (سریع و ایمن)
            try {
                await fetch(`${spConfig.url}/rest/v1/${spConfig.table}?id=eq.${encodeURIComponent(chunkId)}`, {
                    method: 'DELETE',
                    headers
                });
            } catch(e) {}

            // ۲. درج رکورد بخش جدید
            const payload = {
                id: chunkId,
                event_id: '__master_personnel__',
                event_title: `بانک پرسنل سازمان (بخش ${c + 1} از ${totalChunks})`,
                personnel_code: '__BANK__',
                full_name: `تعداد پرسنل: ${totalCount}`,
                status: 'active',
                status_text: JSON.stringify(chunkObj),
                timestamp: nowIso,
                jalali_date: this.toJalaliString(new Date()),
                user_agent: navigator.userAgent.substring(0, 100)
            };

            const postRes = await fetch(`${spConfig.url}/rest/v1/${spConfig.table}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (!postRes.ok) {
                const errText = await postRes.text();
                throw new Error(`خطا در ذخیره بخش ${c + 1}: ${errText}`);
            }
        }

        // پاکسازی بخش‌های اضافی قبلی در صورت کاهش تعداد چانک‌ها (تا ۱۰ بخش)
        for (let extra = totalChunks + 1; extra <= 10; extra++) {
            const extraId = `__master_personnel_part_${extra}`;
            try {
                await fetch(`${spConfig.url}/rest/v1/${spConfig.table}?id=eq.${encodeURIComponent(extraId)}`, {
                    method: 'DELETE',
                    headers
                });
            } catch(e) {}
        }

        if (onProgress) {
            onProgress(totalChunks, totalChunks, `بانک اطلاعاتی شامل ${totalCount.toLocaleString('fa-IR')} پرسنل با موفقیت در فضای ابری ذخیره و در تمام صفحات اعمال شد!`, true);
        }

        return {
            success: true,
            totalCount: totalCount,
            updatedAt: nowIso
        };
    }
};

// همگام‌سازی خودکار و پس‌زمینه بانک اطلاعات پرسنل در تمامی صفحات
if (typeof StorageService !== 'undefined' && StorageService.syncMasterPersonnelBank) {
    try {
        StorageService.syncMasterPersonnelBank();
    } catch(e) {}
}
