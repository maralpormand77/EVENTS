/**
 * سامانه مدیریت رویدادهای سازمانی گروه توسعه سرمایه‌گذاری انتخاب
 * Enterprise Event Management Portal Engine
 */

(function () {
  'use strict';

  // ==========================================================================
  // CONFIG & STORAGE KEYS (PRESERVED & EXTENDED)
  // ==========================================================================
  const PORTAL_KEYS = {
    EVENTS: 'entekhab_portal_events_v2',
    REGISTRATIONS: 'entekhab_events_registrations',
    NOTIFICATIONS: 'entekhab_portal_notifications_v2',
    SURVEYS: 'entekhab_portal_surveys_v2',
    AUTH_USER: 'entekhab_portal_auth_user',
    ADMIN_SESSION: 'entekhab_portal_admin_session',
    ADMIN_PIN: 'entekhab_portal_admin_pin',
    SETTINGS: 'entekhab_portal_general_settings'
  };

  const ADMIN_CODES = ['992113', '980253'];

  // Hardcoded Admin Data for Immediate Offline/Pre-load Authentication
  const ADMIN_FALLBACK = {
    '992113': { name: 'مارال پورمند', nationalId: '1272744868' },
    '980253': { name: 'حسن لندی اصفهانی', nationalId: '1272126803' }
  };

  const DEFAULT_ADMIN_PIN = '992113';

  // SVG Icons System (Lucide / Feather enterprise standard)
  const SVG = {
    calendar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    mapPin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    users: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>',
    chevronDown: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
    trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>',
    plus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>',
    copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
    lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    shieldCheck: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    fileText: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>'
  };

  // ۳ رویداد سازمانی پیش‌فرض
  const DEFAULT_EVENTS = [
    {
      id: 'sobh-hamdeli',
      title: 'صبح همدلی',
      category: 'پیاده‌روی مدیران',
      subtitle: 'پیاده روی مدیران گروه توسعه سرمایه گذاری انتخاب',
      dateText: 'یکشنبه ۲۲/۰۶/۱۴۰۵',
      timeText: 'ساعت ۰۶:۳۰ صبح',
      returnText: 'ساعت ۰۹:۳۰ صبح',
      locationText: 'خیابان نشاط، کوچه ۲۰، عمارت ماهور',
      deadlineDate: '1405/06/21',
      deadlineTime: '20:00',
      capacity: 0,
      status: 'active',
      themeColor: 'accent-theme-1',
      notes: [
        'لطفاً با لباس و کفش مناسب جهت پیاده‌روی و نرمش صبحگاهی حضور به‌هم رسانید.',
        'جهت برنامه‌ریزی هرچه بهتر پذیرایی و امور هماهنگی، اعلام حضور الزامی است.'
      ],
      checklist: [
        'کفش ورزشی مناسب پیاده‌روی',
        'لباس ورزشی راحت',
        'کارت شناسایی پرسنلی'
      ]
    },
    {
      id: 'kavir-varzaneh',
      title: 'تور کویر ورزنه',
      category: 'علمی و تفریحی',
      subtitle: 'ایونت علمی تفریحی گروه توسعه سرمایه گذاری انتخاب',
      dateText: 'چهارشنبه ۲۵/۰۶/۱۴۰۵ الی پنجشنبه ۲۶/۰۶/۱۴۰۵',
      timeText: 'چهارشنبه ساعت ۱۴:۰۰ (حرکت)',
      returnText: 'پنجشنبه ساعت ۱۳:۰۰ (بازگشت)',
      locationText: 'ساختمان مرکزی (خیابان امام خمینی)',
      deadlineDate: '1405/06/22',
      deadlineTime: '13:00',
      capacity: 120,
      status: 'active',
      themeColor: 'accent-theme-2',
      notes: [
        'مهلت ثبت‌نام نهایتاً تا ساعت ۱۳:۰۰ روز یکشنبه مورخ ۱۴۰۵/۰۶/۲۲ می‌باشد.',
        'در صورت ثبت‌نام و عدم حضور بدون اطلاع موجه، هزینه سرانه کسر خواهد گردید.'
      ],
      checklist: [
        'لوازم شخصی (دارو، کرم ضدآفتاب، کلاه لبه‌دار)',
        'تیشرت آستین بلند و عینک آفتابی',
        'دستمال مرطوب و ملزومات بهداشتی فردی'
      ]
    },
    {
      id: 'rafting-markadeh',
      title: 'تور رفتینگ مارکده',
      category: 'تفریحی و ورزشی',
      subtitle: 'ایونت تفریحی گروه توسعه سرمایه گذاری انتخاب',
      dateText: 'پنجشنبه ۰۲/۰۷/۱۴۰۵',
      timeText: 'ساعت ۰۶:۰۰ صبح (حرکت)',
      returnText: 'ساعت ۱۸:۰۰ عصر (بازگشت)',
      locationText: 'ساختمان مرکزی',
      deadlineDate: '1405/06/28',
      deadlineTime: '15:00',
      capacity: 80,
      status: 'active',
      themeColor: 'accent-theme-3',
      notes: [
        'جهت بهره‌مندی هرچه بیشتر از این سفر، ملزومات اعلام‌شده را دقیقاً مد نظر قرار دهید.',
        'با توجه به حضور در رودخانه و مواجهه با آب، همراه داشتن لباس اضافی الزامی است.'
      ],
      checklist: [
        '۱- همراه داشتن لوازم شخصی (دارو و ضدآفتاب، کلاه، تیشرت آستین بلند، عینک آفتابی، دستمال مرطوب)',
        '۲- لباس اضافه و حوله (با توجه به مواجهه مستقیم با آب رودخانه)',
        '۳- خودداری از آوردن زیورآلات، ساعت مچی و اکسسوری‌های گران‌قیمت',
        '۴- همراه داشتن صندل مناسب جهت تردد آسان در آب و بستر رودخانه',
        '۵- وسایل شخصی صرف غذا: لیوان شخصی، قاشق و چنگال'
      ]
    }
  ];

  const DEFAULT_NOTIFICATIONS = [
    {
      id: 'notif_1',
      title: 'سامانه یکپارچه رویدادهای گروه انتخاب راه‌اندازی شد',
      category: 'سیستمی',
      date: '۱۴۰۵/۰۶/۲۰',
      content: 'همکاران گرامی، من‌بعد تمامی مراحل اعلام حضور، مشاهده مشخصات و ثبت نظرسنجی رویدادهای سازمانی از طریق این پرتال انجام می‌پذیرد.'
    },
    {
      id: 'notif_2',
      title: 'یادآوری مهلت ثبت‌نام رویداد کویر ورزنه',
      category: 'رویداد ۲',
      date: '۱۴۰۵/۰۶/۲۱',
      content: 'مهلت اعلام حضور در تور کویر ورزنه تا ساعت ۱۳:۰۰ روز یکشنبه ۲۲ شهریورماه می‌باشد. لطفاً پیش از موعد مقرر وضعیت حضور خود را مشخص نمایید.'
    },
    {
      id: 'notif_3',
      title: 'نکات بهداشتی و تجهیزات تور رفتینگ مارکده',
      category: 'رویداد ۳',
      date: '۱۴۰۵/۰۶/۲۲',
      content: 'با توجه به ماهیت ورزشی رفتینگ، به همراه داشتن صندل ضدلغزش، لباس اضافه و خودداری از حمل وسایل قیمتی اکیداً توصیه می‌گردد.'
    }
  ];

  // ==========================================================================
  // DATA SERVICES (100% PRESERVED BUSINESS LOGIC)
  // ==========================================================================

  const PortalEvents = {
    getAll: function () {
      try {
        const raw = localStorage.getItem(PORTAL_KEYS.EVENTS);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list) && list.length > 0) return list;
        }
      } catch (e) {
        console.warn('Error reading portal events:', e);
      }
      return DEFAULT_EVENTS;
    },

    saveAll: function (eventsList) {
      try {
        localStorage.setItem(PORTAL_KEYS.EVENTS, JSON.stringify(eventsList));
      } catch (e) {
        console.error('Error saving portal events:', e);
      }
    },

    getById: function (id) {
      return this.getAll().find(ev => ev.id === id) || null;
    },

    saveEvent: function (eventData) {
      const all = this.getAll();
      const idx = all.findIndex(ev => ev.id === eventData.id);
      if (idx >= 0) {
        all[idx] = Object.assign({}, all[idx], eventData);
      } else {
        if (!eventData.id) eventData.id = 'event_' + Date.now();
        all.push(eventData);
      }
      this.saveAll(all);
    },

    deleteEvent: function (id) {
      const all = this.getAll().filter(ev => ev.id !== id);
      this.saveAll(all);
    },

    resetToDefaults: function () {
      this.saveAll(DEFAULT_EVENTS);
    }
  };

  const PersonnelService = {
    lookup: function (code) {
      if (!code) return null;
      const cleanCode = String(code).trim();
      if (!cleanCode) return null;

      if (window.PERSONNEL_MAP && window.PERSONNEL_MAP[cleanCode]) {
        const data = window.PERSONNEL_MAP[cleanCode];
        return {
          code: cleanCode,
          name: Array.isArray(data) ? data[0] : (data.name || cleanCode),
          nationalId: Array.isArray(data) ? data[1] : (data.nationalId || '')
        };
      }
      return null;
    }
  };

  const RegistrationService = {
    getAll: function () {
      try {
        const raw = localStorage.getItem(PORTAL_KEYS.REGISTRATIONS);
        if (raw) {
          const list = JSON.parse(raw);
          return Array.isArray(list) ? list : [];
        }
      } catch (e) {}
      return [];
    },

    saveAll: function (list) {
      try {
        localStorage.setItem(PORTAL_KEYS.REGISTRATIONS, JSON.stringify(list));
      } catch (e) {
        console.error('Error saving registrations:', e);
      }
    },

    getUserRegistration: function (eventId, personnelCode) {
      const list = this.getAll();
      return list.find(r => r.eventId === eventId && String(r.personnelCode).trim() === String(personnelCode).trim()) || null;
    },

    getUserAllRegistrations: function (personnelCode) {
      const list = this.getAll();
      return list.filter(r => String(r.personnelCode).trim() === String(personnelCode).trim());
    },

    register: function (record) {
      const list = this.getAll();
      const cleanCode = String(record.personnelCode).trim();
      const existingIdx = list.findIndex(r => r.eventId === record.eventId && String(r.personnelCode).trim() === cleanCode);

      const timestamp = new Date().toISOString();
      const jalaliDate = formatJalaliDateTime(new Date());

      const finalRecord = {
        id: existingIdx >= 0 ? list[existingIdx].id : ('reg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)),
        eventId: record.eventId,
        personnelCode: cleanCode,
        fullName: record.fullName || cleanCode,
        nationalId: record.nationalId || '',
        status: record.status || 'attending',
        note: record.note || '',
        createdAt: existingIdx >= 0 ? (list[existingIdx].createdAt || timestamp) : timestamp,
        updatedAt: timestamp,
        jalaliDate: jalaliDate
      };

      if (existingIdx >= 0) {
        list[existingIdx] = finalRecord;
      } else {
        list.push(finalRecord);
      }

      this.saveAll(list);
      return { success: true, record: finalRecord, isUpdate: existingIdx >= 0 };
    },

    deleteRegistration: function (id) {
      const list = this.getAll().filter(r => r.id !== id);
      this.saveAll(list);
    },

    updateStatus: function (id, newStatus) {
      const list = this.getAll();
      const item = list.find(r => r.id === id);
      if (item) {
        item.status = newStatus;
        item.updatedAt = new Date().toISOString();
        this.saveAll(list);
      }
    }
  };

  const NotificationService = {
    getAll: function () {
      try {
        const raw = localStorage.getItem(PORTAL_KEYS.NOTIFICATIONS);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list) && list.length > 0) return list;
        }
      } catch (e) {}
      return DEFAULT_NOTIFICATIONS;
    },

    saveAll: function (list) {
      try {
        localStorage.setItem(PORTAL_KEYS.NOTIFICATIONS, JSON.stringify(list));
      } catch (e) {}
    },

    add: function (notif) {
      const list = this.getAll();
      if (!notif.id) notif.id = 'notif_' + Date.now();
      if (!notif.date) notif.date = formatJalaliDateTime(new Date()).split(' ')[0];
      list.unshift(notif);
      this.saveAll(list);
    },

    delete: function (id) {
      const list = this.getAll().filter(n => n.id !== id);
      this.saveAll(list);
    }
  };

  const SurveyService = {
    getAll: function () {
      try {
        const raw = localStorage.getItem(PORTAL_KEYS.SURVEYS);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    submit: function (surveyData) {
      const list = this.getAll();
      surveyData.id = 'surv_' + Date.now();
      surveyData.submittedAt = formatJalaliDateTime(new Date());
      list.push(surveyData);
      try {
        localStorage.setItem(PORTAL_KEYS.SURVEYS, JSON.stringify(list));
      } catch (e) {}
      return true;
    }
  };

  function normalizeDigits(str) {
    if (!str) return '';
    return String(str)
      .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
      .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
      .trim();
  }

  const PortalAuth = {
    getCurrentUser: function () {
      try {
        const raw = localStorage.getItem(PORTAL_KEYS.AUTH_USER);
        if (raw) {
          const u = JSON.parse(raw);
          if (u && u.code) {
            u.isAdmin = ADMIN_CODES.includes(String(u.code).trim());
            return u;
          }
        }
      } catch (e) {}
      return null;
    },

    isAdmin: function () {
      const user = this.getCurrentUser();
      return !!(user && user.isAdmin);
    },

    login: function (rawCode, rawNationalId) {
      const code = normalizeDigits(rawCode);
      const nationalId = normalizeDigits(rawNationalId);

      if (!code) {
        return { success: false, message: 'لطفاً شماره پرسنلی را وارد نمایید.' };
      }
      if (!nationalId) {
        return { success: false, message: 'لطفاً کد ملی را وارد نمایید.' };
      }

      let matchedName = '';
      let matchedNationalId = '';
      let isValid = false;

      // 1. Check Hardcoded Admin Fallback (Admins: 992113 & 980253)
      if (ADMIN_FALLBACK[code]) {
        matchedName = ADMIN_FALLBACK[code].name;
        matchedNationalId = normalizeDigits(ADMIN_FALLBACK[code].nationalId);
        if (nationalId === matchedNationalId) {
          isValid = true;
        } else {
          return { success: false, message: 'کد ملی وارد شده با شماره پرسنلی مدیر مطابقت ندارد.' };
        }
      } else if (window.PERSONNEL_MAP && window.PERSONNEL_MAP[code]) {
        // 2. Check full Personnel Database
        const data = window.PERSONNEL_MAP[code];
        matchedName = Array.isArray(data) ? data[0] : (data.name || code);
        matchedNationalId = normalizeDigits(Array.isArray(data) ? data[1] : (data.nationalId || ''));

        if (matchedNationalId && nationalId === matchedNationalId) {
          isValid = true;
        } else {
          return { success: false, message: 'کد ملی وارد شده با شماره پرسنلی مطابقت ندارد.' };
        }
      } else {
        return { success: false, message: 'شماره پرسنلی در سامانه یافت نشد.' };
      }

      if (isValid) {
        const isAdmin = ADMIN_CODES.includes(code);
        const userSession = {
          code: code,
          name: matchedName,
          nationalId: nationalId,
          isAdmin: isAdmin
        };
        try {
          localStorage.setItem(PORTAL_KEYS.AUTH_USER, JSON.stringify(userSession));
          if (isAdmin) {
            sessionStorage.setItem(PORTAL_KEYS.ADMIN_SESSION, 'true');
          } else {
            sessionStorage.removeItem(PORTAL_KEYS.ADMIN_SESSION);
          }
        } catch (e) {}

        return { success: true, user: userSession };
      }

      return { success: false, message: 'اطلاعات ورود نامعتبر است.' };
    },

    logout: function () {
      try {
        localStorage.removeItem(PORTAL_KEYS.AUTH_USER);
        sessionStorage.removeItem(PORTAL_KEYS.ADMIN_SESSION);
      } catch (e) {}
      if (window.PortalUI && typeof window.PortalUI.handleAuthChange === 'function') {
        window.PortalUI.handleAuthChange();
      }
    }
  };

  const AdminAuth = {
    isAuthenticated: function () {
      return PortalAuth.isAdmin();
    },
    getPin: function () {
      return DEFAULT_ADMIN_PIN;
    },
    setPin: function () {},
    login: function () {
      return PortalAuth.isAdmin();
    },
    logout: function () {
      PortalAuth.logout();
    }
  };

  function formatJalaliDateTime(date = new Date()) {
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
      return new Intl.DateTimeFormat('fa-IR', options).format(d);
    } catch (e) {
      return new Date(date).toLocaleString('fa-IR');
    }
  }

  function showToast(message, type = 'info') {
    let container = document.getElementById('portalToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'portalToastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    const icon = type === 'success' ? SVG.check : type === 'error' ? SVG.x : SVG.fileText;
    toast.innerHTML = `<span style="display:inline-flex; align-items:center;">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 180ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 3800);
  }

  // ==========================================================================
  // UI RENDER ENGINE (ENTERPRISE MINIMALIST REDESIGN)
  // ==========================================================================

  const PortalUI = {
    activeTab: 'home',
    activeFilter: 'all',

    init: function () {
      this.bindTabNavigation();
      this.bindAuthControls();
      this.bindInquiryForm();
      this.handleAuthChange();
    },

    handleAuthChange: function () {
      const user = PortalAuth.getCurrentUser();
      const loginScreen = document.getElementById('portalLoginScreen');
      const appHeader = document.getElementById('mainAppHeader');
      const appMain = document.getElementById('mainAppContainer');
      const userNameEl = document.getElementById('headerUserName');
      const userBadgeEl = document.getElementById('headerUserBadge');

      if (!user) {
        if (loginScreen) loginScreen.style.display = 'flex';
        if (appHeader) appHeader.style.display = 'none';
        if (appMain) appMain.style.display = 'none';
        const codeInput = document.getElementById('loginPersonnelCode');
        const natInput = document.getElementById('loginNationalId');
        if (codeInput) codeInput.value = '';
        if (natInput) natInput.value = '';
        const errAlert = document.getElementById('loginErrorMessage');
        if (errAlert) errAlert.style.display = 'none';
        return;
      }

      // User authenticated
      if (loginScreen) loginScreen.style.display = 'none';
      if (appHeader) appHeader.style.display = 'block';
      if (appMain) appMain.style.display = 'block';

      if (userNameEl) userNameEl.textContent = user.name || `پرسنل ${user.code}`;
      if (userBadgeEl) {
        if (user.isAdmin) {
          userBadgeEl.textContent = 'مدیر سیستم';
          userBadgeEl.classList.add('admin-badge');
        } else {
          userBadgeEl.textContent = 'همکار گرامی';
          userBadgeEl.classList.remove('admin-badge');
        }
      }

      this.updateAdminVisibility();

      if ((this.activeTab === 'dashboard' || this.activeTab === 'settings') && !user.isAdmin) {
        this.switchTab('home');
      } else {
        this.switchTab(this.activeTab || 'home');
      }

      this.renderHomeOverview();
      this.renderEventsGrid();
      this.renderNotificationsList();
      if (user.isAdmin) {
        this.renderAdminDashboard();
        this.renderAdminSettings();
      }
    },

    switchTab: function (tabName) {
      const user = PortalAuth.getCurrentUser();

      // Guard admin tabs strictly
      if ((tabName === 'dashboard' || tabName === 'settings') && (!user || !user.isAdmin)) {
        showToast('دسترسی به این بخش صرفاً برای مدیران سامانه مجاز است.', 'error');
        tabName = 'home';
      }

      this.activeTab = tabName;

      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        if (btn.dataset.tab === tabName) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      document.querySelectorAll('.tab-content-view').forEach(view => {
        if (view.id === `tabView-${tabName}`) {
          view.classList.add('active-view');
        } else {
          view.classList.remove('active-view');
        }
      });

      if (tabName === 'events') {
        this.renderEventsGrid();
      } else if (tabName === 'dashboard') {
        if (user && user.isAdmin) this.renderAdminDashboard();
      } else if (tabName === 'settings') {
        if (user && user.isAdmin) this.renderAdminSettings();
      } else if (tabName === 'notifications') {
        this.renderNotificationsList();
      } else if (tabName === 'home') {
        this.renderHomeOverview();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    bindTabNavigation: function () {
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.switchTab(btn.dataset.tab);
        });
      });
    },

    bindAuthControls: function () {
      const loginForm = document.getElementById('globalLoginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const codeInput = document.getElementById('loginPersonnelCode');
          const natInput = document.getElementById('loginNationalId');
          const errAlert = document.getElementById('loginErrorMessage');

          const res = PortalAuth.login(codeInput ? codeInput.value : '', natInput ? natInput.value : '');
          if (res.success) {
            if (errAlert) {
              errAlert.style.display = 'none';
              errAlert.textContent = '';
            }
            PortalUI.handleAuthChange();
            showToast(`خوش آمدید، ${res.user.name}`, 'success');
          } else {
            if (errAlert) {
              errAlert.textContent = res.message;
              errAlert.style.display = 'block';
            }
          }
        });
      }

      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.remove('open');
        });
        const closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => modal.classList.remove('open'));
        }
      });
    },

    updateAdminVisibility: function () {
      const isAuth = PortalAuth.isAdmin();
      const adminTabs = document.querySelectorAll('.admin-only-tab');

      adminTabs.forEach(tab => {
        if (isAuth) tab.classList.add('admin-visible');
        else tab.classList.remove('admin-visible');
      });
    },

    isEventRelevantToUser: function (ev, user) {
      if (!user) return false;
      if (user.isAdmin) return true; // Admins 992113 & 980253 see ALL events

      // 1. User registered for it?
      const userReg = RegistrationService.getUserRegistration(ev.id, user.code);
      if (userReg) return true;

      // 2. Check if event has restricted allowedPersonnel (whitelist)
      let isRestricted = ev.isRestricted === true;
      let allowedPersonnel = Array.isArray(ev.allowedPersonnel) ? ev.allowedPersonnel : [];

      try {
        const deadlinesRaw = localStorage.getItem('entekhab_events_deadlines');
        if (deadlinesRaw) {
          const deadlines = JSON.parse(deadlinesRaw);
          if (deadlines && deadlines[ev.id]) {
            if (deadlines[ev.id].isRestricted) {
              isRestricted = true;
              if (Array.isArray(deadlines[ev.id].allowedPersonnel) && deadlines[ev.id].allowedPersonnel.length > 0) {
                allowedPersonnel = deadlines[ev.id].allowedPersonnel;
              }
            }
          }
        }
      } catch (e) {}

      if (isRestricted && allowedPersonnel.length > 0) {
        return allowedPersonnel.some(item => {
          if (!item) return false;
          let c = '', n = '';
          if (typeof item === 'string' || typeof item === 'number') {
            c = normalizeDigits(item);
          } else if (typeof item === 'object') {
            c = normalizeDigits(item.code || item.personnelCode || '');
            n = normalizeDigits(item.nationalCode || item.nationalId || '');
          }
          if (c && (c === user.code || c.replace(/^0+/, '') === user.code.replace(/^0+/, ''))) return true;
          if (n && user.nationalId && n === user.nationalId) return true;
          return false;
        });
      }

      // 3. Open corporate event available to all personnel
      return true;
    },

    // ------------------------------------------------------------------------
    // Home Overview Rendering
    // ------------------------------------------------------------------------
    renderHomeOverview: function () {
      const user = PortalAuth.getCurrentUser();
      const events = PortalEvents.getAll();
      const regs = RegistrationService.getAll();
      const attendees = regs.filter(r => r.status === 'attending');

      const elActiveCount = document.getElementById('heroActiveEventsCount');
      const elTotalRegs = document.getElementById('heroTotalRegsCount');

      if (user && user.isAdmin) {
        const activeEventsCount = events.filter(e => e.status === 'active').length;
        if (elActiveCount) elActiveCount.textContent = activeEventsCount;
        if (elTotalRegs) elTotalRegs.textContent = attendees.length;
      } else if (user) {
        const myRelevantEvents = events.filter(ev => this.isEventRelevantToUser(ev, user));
        const myRegs = regs.filter(r => String(r.personnelCode).trim() === user.code && r.status === 'attending');
        if (elActiveCount) elActiveCount.textContent = myRelevantEvents.filter(e => e.status === 'active').length;
        if (elTotalRegs) elTotalRegs.textContent = myRegs.length;
      }

      this.renderUserStatusInquiry();

      const container = document.getElementById('homeHighlightsGrid');
      if (!container) return;

      const visibleEvents = events.filter(ev => this.isEventRelevantToUser(ev, user));

      if (visibleEvents.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 36px; background: var(--surface); border-radius: var(--radius-md); border: 1px solid var(--border); color: var(--text-muted);">
            در حال حاضر رویداد فعالی برای شما ثبت نشده است.
          </div>
        `;
        return;
      }

      container.innerHTML = visibleEvents.slice(0, 3).map(ev => {
        const evRegs = regs.filter(r => r.eventId === ev.id && r.status === 'attending');
        const capText = ev.capacity > 0 ? `${evRegs.length} / ${ev.capacity}` : `${evRegs.length} نفر`;
        const statusLabel = ev.status === 'active' ? 'در حال ثبت‌نام' : ev.status === 'survey' ? 'نظرسنجی فعال' : 'پایان‌یافته';
        const statusClass = ev.status === 'active' ? 'status-active' : ev.status === 'survey' ? 'status-survey' : 'status-closed';

        return `
          <div class="event-card">
            <div class="event-card-banner ${ev.themeColor || 'accent-theme-1'}">
              <div class="event-badge-row">
                <span class="event-category-tag">${ev.category || 'رویداد سازمانی'}</span>
                <span class="event-status-pill ${statusClass}">${statusLabel}</span>
              </div>
              <h3 class="event-card-title" style="color: #fff; margin: 0;">${ev.title}</h3>
            </div>
            <div class="event-card-body">
              <p class="event-card-subtitle">${ev.subtitle || ''}</p>
              <div class="event-meta-list">
                <div class="event-meta-item">
                  <span class="event-meta-icon">${SVG.calendar}</span>
                  <span class="event-meta-label">تاریخ:</span>
                  <span class="event-meta-val">${ev.dateText || '-'}</span>
                </div>
                <div class="event-meta-item">
                  <span class="event-meta-icon">${SVG.mapPin}</span>
                  <span class="event-meta-label">مکان:</span>
                  <span class="event-meta-val">${ev.locationText || '-'}</span>
                </div>
                <div class="event-meta-item">
                  <span class="event-meta-icon">${SVG.users}</span>
                  <span class="event-meta-label">مشارکت:</span>
                  <span class="event-meta-val">${capText}</span>
                </div>
              </div>
              <button class="btn-action btn-secondary" style="width: 100%;" onclick="PortalUI.openEventDetail('${ev.id}')">
                مشاهده جزئیات و اعلام وضعیت
              </button>
            </div>
          </div>
        `;
      }).join('');
    },

    renderUserStatusInquiry: function () {
      const resultBox = document.getElementById('quickInquiryResult');
      if (!resultBox) return;

      const user = PortalAuth.getCurrentUser();
      if (!user) {
        resultBox.style.display = 'none';
        return;
      }

      resultBox.style.display = 'block';
      const userRegs = RegistrationService.getUserAllRegistrations(user.code);
      const events = PortalEvents.getAll();

      let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <strong style="color: var(--primary); font-size: 1rem; font-weight: 700;">${user.name}</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted); margin-right: 8px;">(کد پرسنلی: ${user.code})</span>
          </div>
          <span class="badge-status attending">${SVG.check} احراز هویت شده</span>
        </div>
      `;

      if (userRegs.length === 0) {
        html += `
          <div style="font-size: 0.86rem; color: var(--text-secondary); text-align: center; padding: 14px 0;">
            شما هنوز در هیچ رویدادی وضعیت حضور خود را اعلام ننموده‌اید.
            <br><button class="btn-action btn-secondary" style="margin-top: 12px;" onclick="PortalUI.switchTab('events')">مشاهده رویدادها و اعلام وضعیت</button>
          </div>
        `;
      } else {
        html += `<div style="display: flex; flex-direction: column; gap: 8px;">`;
        userRegs.forEach(reg => {
          const ev = events.find(e => e.id === reg.eventId) || { title: reg.eventId, id: reg.eventId };
          const isAttending = reg.status === 'attending';
          html += `
            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--surface); border: 1px solid var(--border); padding: 12px 14px; border-radius: var(--radius-sm); flex-wrap: wrap; gap: 10px;">
              <div>
                <strong style="font-size: 0.9rem; color: var(--primary);">${ev.title}</strong>
                <div style="font-size: 0.76rem; color: var(--text-muted);">ثبت شده: ${reg.jalaliDate || '-'}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="badge-status ${isAttending ? 'attending' : 'declining'}">
                  ${isAttending ? `${SVG.check} مایل به شرکت` : `${SVG.x} عدم تمایل`}
                </span>
                <button class="btn-action btn-secondary" style="padding: 4px 12px; font-size: 0.78rem; height: 32px;" onclick="PortalUI.openEventDetail('${reg.eventId}')">
                  تغییر وضعیت
                </button>
              </div>
            </div>
          `;
        });
        html += `</div>`;
      }

      resultBox.innerHTML = html;
    },

    openEventDetail: function (eventId) {
      this.switchTab('events');
      setTimeout(() => {
        const card = document.getElementById(`eventCard_${eventId}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const toggleBtn = card.querySelector('.register-accordion-toggle');
          if (toggleBtn) toggleBtn.click();
        }
      }, 150);
    },

    bindInquiryForm: function () {
      this.renderUserStatusInquiry();
    },

    // ------------------------------------------------------------------------
    // Events Grid Rendering
    // ------------------------------------------------------------------------
    renderEventsGrid: function () {
      const container = document.getElementById('eventsGridContainer');
      if (!container) return;

      const user = PortalAuth.getCurrentUser();
      const events = PortalEvents.getAll();
      const regs = RegistrationService.getAll();

      // Filter events relevant to this specific employee (admins see all)
      const relevantEvents = events.filter(ev => this.isEventRelevantToUser(ev, user));

      let filtered = relevantEvents;
      if (this.activeFilter === 'active') {
        filtered = relevantEvents.filter(e => e.status === 'active');
      } else if (this.activeFilter === 'survey') {
        filtered = relevantEvents.filter(e => e.status === 'survey');
      } else if (this.activeFilter === 'closed') {
        filtered = relevantEvents.filter(e => e.status === 'closed');
      }

      if (filtered.length === 0) {
        const emptyMsg = (user && user.isAdmin)
          ? 'هیچ رویدادی با این فیلتر یافت نشد.'
          : 'در حال حاضر هیچ رویدادی برای شماره پرسنلی شما تعریف نشده است.';
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--surface); border-radius: var(--radius-md); border: 1px solid var(--border); color: var(--text-muted);">
            ${emptyMsg}
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(ev => {
        const evRegs = regs.filter(r => r.eventId === ev.id && r.status === 'attending');
        const capText = ev.capacity > 0 ? `${evRegs.length} از ${ev.capacity} نفر` : `${evRegs.length} نفر ثبت‌نام`;
        const isSurvey = ev.status === 'survey';
        const isClosed = ev.status === 'closed';

        const statusLabel = isSurvey ? 'نظرسنجی فعال' : isClosed ? 'مهلت پایان‌یافته' : 'در حال ثبت‌نام';
        const statusClass = isSurvey ? 'status-survey' : isClosed ? 'status-closed' : 'status-active';

        const userReg = user ? RegistrationService.getUserRegistration(ev.id, user.code) : null;
        const isAttending = userReg && userReg.status === 'attending';
        const isDeclined = userReg && userReg.status === 'declined';

        let userStatusHtml = '';
        if (user) {
          if (isAttending) {
            userStatusHtml = `
              <div class="user-event-status-badge attending">
                ${SVG.check}
                <span>وضعیت شما: <strong>مایل به شرکت در این رویداد</strong></span>
                <span style="font-size: 0.72rem; opacity: 0.8; margin-right: auto;">(${userReg.jalaliDate || ''})</span>
              </div>
            `;
          } else if (isDeclined) {
            userStatusHtml = `
              <div class="user-event-status-badge declined">
                ${SVG.x}
                <span>وضعیت شما: <strong>عدم تمایل به حضور</strong></span>
                <span style="font-size: 0.72rem; opacity: 0.8; margin-right: auto;">(${userReg.jalaliDate || ''})</span>
              </div>
            `;
          } else {
            userStatusHtml = `
              <div class="user-event-status-badge not-registered">
                <span>وضعیت شما: <strong>هنوز پاسخی ثبت نکرده‌اید</strong></span>
              </div>
            `;
          }
        }

        return `
          <div class="event-card" id="eventCard_${ev.id}">
            <div class="event-card-banner ${ev.themeColor || 'accent-theme-1'}">
              <div class="event-badge-row">
                <span class="event-category-tag">${ev.category || 'رویداد سازمانی'}</span>
                <span class="event-status-pill ${statusClass}">${statusLabel}</span>
              </div>
              <div>
                <h3 class="event-card-title" style="color: #fff; margin: 0;">${ev.title}</h3>
              </div>
            </div>

            <div class="event-card-body">
              <p class="event-card-subtitle">${ev.subtitle || ''}</p>

              ${userStatusHtml}

              <div class="event-meta-list">
                <div class="event-meta-item">
                  <span class="event-meta-icon">${SVG.calendar}</span>
                  <span class="event-meta-label">تاریخ رویداد:</span>
                  <span class="event-meta-val">${ev.dateText || '-'}</span>
                </div>
                <div class="event-meta-item">
                  <span class="event-meta-icon">${SVG.clock}</span>
                  <span class="event-meta-label">ساعت حرکت:</span>
                  <span class="event-meta-val">${ev.timeText || '-'}</span>
                </div>
                ${ev.returnText ? `
                <div class="event-meta-item">
                  <span class="event-meta-icon">${SVG.clock}</span>
                  <span class="event-meta-label">ساعت بازگشت:</span>
                  <span class="event-meta-val">${ev.returnText}</span>
                </div>` : ''}
                <div class="event-meta-item">
                  <span class="event-meta-icon">${SVG.mapPin}</span>
                  <span class="event-meta-label">محل تجمع:</span>
                  <span class="event-meta-val">${ev.locationText || '-'}</span>
                </div>
                <div class="event-meta-item">
                  <span class="event-meta-icon">${SVG.users}</span>
                  <span class="event-meta-label">ظرفیت:</span>
                  <span class="event-meta-val">${capText}</span>
                </div>
                ${ev.deadlineDate ? `
                <div class="event-meta-item">
                  <span class="event-meta-icon">${SVG.clock}</span>
                  <span class="event-meta-label">مهلت ثبت‌نام:</span>
                  <span class="event-meta-val" style="color: var(--danger); font-weight: 600;">تا ${ev.deadlineDate} ساعت ${ev.deadlineTime || ''}</span>
                </div>` : ''}
              </div>

              <!-- Rules & Checklist Drawer -->
              <div class="event-rules-preview">
                <div class="rules-expander" onclick="PortalUI.toggleRulesDrawer('${ev.id}')">
                  <span>${SVG.fileText}</span>
                  <span>مشاهده ضوابط و ملزومات ضروری</span>
                  <span>${SVG.chevronDown}</span>
                </div>
                <div class="rules-content-drawer" id="rulesDrawer_${ev.id}">
                  <strong style="color: var(--primary); display: block; margin-bottom: 6px;">نکات مهم حضور:</strong>
                  <ul>
                    ${(ev.notes || []).map(n => `<li>${n}</li>`).join('')}
                  </ul>
                  ${ev.checklist && ev.checklist.length > 0 ? `
                  <strong style="color: var(--primary); display: block; margin: 10px 0 6px;">وسایل و ملزومات ضروری:</strong>
                  <ul>
                    ${ev.checklist.map(c => `<li>${c}</li>`).join('')}
                  </ul>` : ''}
                </div>
              </div>

              <!-- Action Footer (In-place registration or survey) -->
              <div class="event-card-footer">
                ${isSurvey ? `
                  <div style="background: var(--accent-soft); border: 1px solid rgba(37,99,235,0.15); border-radius: var(--radius-sm); padding: 14px; text-align: center;">
                    <div style="font-weight: 700; color: var(--primary); margin-bottom: 4px;">
                      نظرسنجی کیفیت این برنامه فعال است
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px;">
                      در صورت حضور در این برنامه، لطفاً دیدگاه خود را ثبت فرمایید.
                    </p>
                    <button class="btn-action btn-primary" style="width: 100%;" onclick="PortalUI.openSurveyModal('${ev.id}')">
                      ثبت نظرسنجی و امتیازدهی
                    </button>
                  </div>
                ` : isClosed ? `
                  <div style="background: var(--surface-soft); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px; text-align: center; color: var(--text-muted); font-size: 0.84rem;">
                    مهلت اعلام حضور در این رویداد به اتمام رسیده است.
                  </div>
                ` : `
                  <button class="register-accordion-toggle" onclick="PortalUI.toggleRegisterAccordion('${ev.id}')">
                    <span>${SVG.edit}</span>
                    <span>${userReg ? 'ویرایش اعلام وضعیت حضور' : 'اعلام وضعیت حضور در این برنامه'}</span>
                  </button>

                  <div class="register-accordion-content" id="registerBox_${ev.id}">
                    <div class="form-group">
                      <label class="form-label">شماره پرسنلی:</label>
                      <input type="text" class="form-input" id="inputPersonnelCode_${ev.id}" value="${user ? user.code : ''}" ${user && !user.isAdmin ? 'readonly style="background: var(--surface-soft);"' : 'oninput="PortalUI.handlePersonnelCodeInput(\'' + ev.id + '\', this.value)"'}>
                      <div class="personnel-lookup-feedback ${user ? 'found' : ''}" id="feedback_${ev.id}" style="${user ? 'display: block;' : 'display: none;'}">${user ? 'همکار گرامی: ' + user.name : ''}</div>
                    </div>

                    <div id="hiddenFields_${ev.id}" style="${user ? 'display: block;' : 'display: none;'}">
                      <div class="form-group">
                        <label class="form-label">نام و نام خانوادگی:</label>
                        <input type="text" class="form-input" id="inputFullName_${ev.id}" value="${user ? user.name : ''}" readonly style="background: var(--surface-soft);">
                      </div>
                      <div class="form-group">
                        <label class="form-label">کد ملی:</label>
                        <input type="text" class="form-input" id="inputNationalId_${ev.id}" value="${user ? user.nationalId : ''}" readonly style="background: var(--surface-soft);">
                      </div>
                      <div class="form-group">
                        <label class="form-label">توضیحات اختیاری (شماره همراه یا ملاحظات):</label>
                        <input type="text" class="form-input" id="inputNote_${ev.id}" value="${userReg ? (userReg.note || '') : ''}">
                      </div>

                      <div class="btn-row-dual">
                        <button class="btn-action btn-attend" onclick="PortalUI.submitRegistration('${ev.id}', 'attending')">
                          ${SVG.check} مایل به شرکت هستم
                        </button>
                        <button class="btn-action btn-decline" onclick="PortalUI.submitRegistration('${ev.id}', 'declined')">
                          ${SVG.x} تمایلی به حضور ندارم
                        </button>
                      </div>
                    </div>
                  </div>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('');
    },

    toggleRulesDrawer: function (eventId) {
      const drawer = document.getElementById(`rulesDrawer_${eventId}`);
      if (drawer) {
        drawer.style.display = drawer.style.display === 'block' ? 'none' : 'block';
      }
    },

    toggleRegisterAccordion: function (eventId) {
      const box = document.getElementById(`registerBox_${eventId}`);
      if (box) {
        box.classList.toggle('open');
        if (box.classList.contains('open')) {
          const input = document.getElementById(`inputPersonnelCode_${eventId}`);
          if (input) input.focus();
        }
      }
    },

    handlePersonnelCodeInput: function (eventId, val) {
      const clean = val.trim();
      const feedback = document.getElementById(`feedback_${eventId}`);
      const hiddenFields = document.getElementById(`hiddenFields_${eventId}`);
      const inputName = document.getElementById(`inputFullName_${eventId}`);
      const inputNat = document.getElementById(`inputNationalId_${eventId}`);

      if (!clean) {
        feedback.className = 'personnel-lookup-feedback';
        feedback.style.display = 'none';
        hiddenFields.style.display = 'none';
        return;
      }

      const person = PersonnelService.lookup(clean);
      if (person) {
        feedback.className = 'personnel-lookup-feedback found';
        feedback.textContent = `همکار گرامی: ${person.name}`;
        inputName.value = person.name;
        inputNat.value = person.nationalId || '';
        hiddenFields.style.display = 'block';

        const existing = RegistrationService.getUserRegistration(eventId, clean);
        if (existing) {
          feedback.textContent += ` (وضعیت فعلی: ${existing.status === 'attending' ? 'مایل به شرکت' : 'عدم تمایل'})`;
        }
      } else {
        feedback.className = 'personnel-lookup-feedback not-found';
        feedback.textContent = 'شماره پرسنلی در لیست یافت نشد؛ می‌توانید نام را دستی وارد نمایید.';
        inputName.value = '';
        inputNat.value = '';
        inputName.removeAttribute('readonly');
        inputNat.removeAttribute('readonly');
        hiddenFields.style.display = 'block';
      }
    },

    submitRegistration: function (eventId, status) {
      const codeInput = document.getElementById(`inputPersonnelCode_${eventId}`);
      const nameInput = document.getElementById(`inputFullName_${eventId}`);
      const natInput = document.getElementById(`inputNationalId_${eventId}`);
      const noteInput = document.getElementById(`inputNote_${eventId}`);

      const code = codeInput ? codeInput.value.trim() : '';
      const name = nameInput ? nameInput.value.trim() : '';
      const nat = natInput ? natInput.value.trim() : '';
      const note = noteInput ? noteInput.value.trim() : '';

      if (!code) {
        showToast('لطفاً شماره پرسنلی را وارد فرمایید.', 'error');
        return;
      }

      const result = RegistrationService.register({
        eventId: eventId,
        personnelCode: code,
        fullName: name || code,
        nationalId: nat,
        status: status,
        note: note
      });

      if (status === 'attending') {
        showToast(`اعلام حضور شما با موفقیت ${result.isUpdate ? 'به‌روزرسانی' : 'ثبت'} شد.`, 'success');
      } else {
        showToast('عدم تمایل شما به حضور در این برنامه ثبت گردید.', 'info');
      }

      this.renderEventsGrid();
      this.renderHomeOverview();
    },

    // ------------------------------------------------------------------------
    // Survey Modal & Interactive Rating
    // ------------------------------------------------------------------------
    openSurveyModal: function (eventId) {
      const ev = PortalEvents.getById(eventId);
      if (!ev) return;

      const modal = document.getElementById('surveyModal');
      const titleEl = document.getElementById('surveyModalEventTitle');
      const form = document.getElementById('portalSurveyForm');

      if (titleEl) titleEl.textContent = `نظرسنجی رویداد: ${ev.title}`;
      if (form) {
        form.dataset.eventId = eventId;
        form.reset();
      }
      const user = PortalAuth.getCurrentUser();
      if (user) {
        const codeInput = document.getElementById('surveyPersonnelCode');
        const nameInput = document.getElementById('surveyFullName');
        if (codeInput) codeInput.value = user.code;
        if (nameInput) nameInput.value = user.name;
      }
      this.setStarRating(5);
      if (modal) modal.classList.add('open');
    },

    setStarRating: function (rating) {
      const select = document.getElementById('surveyRatingQuality');
      if (select) select.value = String(rating);

      const stars = document.querySelectorAll('.star-interactive-btn');
      stars.forEach(btn => {
        const val = parseInt(btn.dataset.val);
        if (val <= rating) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    },

    bindSurveyForm: function () {
      const form = document.getElementById('portalSurveyForm');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventId = form.dataset.eventId;
        const code = document.getElementById('surveyPersonnelCode').value.trim();
        const name = document.getElementById('surveyFullName').value.trim();
        const ratingQuality = document.getElementById('surveyRatingQuality').value;
        const comment = document.getElementById('surveyComment').value.trim();

        if (!code) {
          showToast('لطفاً شماره پرسنلی را وارد فرمایید.', 'error');
          return;
        }

        SurveyService.submit({
          eventId,
          personnelCode: code,
          fullName: name,
          ratingQuality: parseInt(ratingQuality) || 5,
          comment: comment
        });

        document.getElementById('surveyModal').classList.remove('open');
        showToast('دیدگاه و نظرسنجی شما با سپاس ثبت گردید.', 'success');
      });

      // Star click handlers
      document.querySelectorAll('.star-interactive-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const val = parseInt(btn.dataset.val);
          this.setStarRating(val);
        });
      });
    },

    // ------------------------------------------------------------------------
    // Notifications Rendering (Timeline Layout)
    // ------------------------------------------------------------------------
    renderNotificationsList: function () {
      const container = document.getElementById('notificationsListContainer');
      if (!container) return;

      const notifs = NotificationService.getAll();
      const isAdmin = PortalAuth.isAdmin();

      if (notifs.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 48px; background: var(--surface); border-radius: var(--radius-md); border: 1px solid var(--border); color: var(--text-muted);">
            در حال حاضر هیچ اطلاعیه‌ای منتشر نشده است.
          </div>
        `;
        return;
      }

      container.innerHTML = notifs.map(n => `
        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px 20px; margin-bottom: 12px; box-shadow: var(--shadow-xs);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="event-category-tag" style="background: var(--primary-soft); color: var(--primary); font-size: 0.72rem;">${n.category || 'اطلاعیه'}</span>
              <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--primary); margin: 0;">${n.title}</h4>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 0.76rem; color: var(--text-muted);">${n.date || ''}</span>
              ${isAdmin ? `
                <button class="btn-action btn-ghost" style="padding: 2px 8px; font-size: 0.74rem; height: 26px; color: var(--danger);" onclick="PortalUI.deleteNotification('${n.id}')">
                  ${SVG.trash} حذف
                </button>
              ` : ''}
            </div>
          </div>
          <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.65; margin: 0;">${n.content}</p>
        </div>
      `).join('');
    },

    deleteNotification: function (id) {
      if (confirm('آیا از حذف این اطلاعیه اطمینان دارید؟')) {
        NotificationService.delete(id);
        this.renderNotificationsList();
        showToast('اطلاعیه حذف شد.', 'info');
      }
    },

    // ------------------------------------------------------------------------
    // ADMIN DASHBOARD & REPORTS (فقط ادمین)
    // ------------------------------------------------------------------------
    renderAdminDashboard: function () {
      const statsTotal = document.getElementById('dashStatTotal');
      const statsAttending = document.getElementById('dashStatAttending');
      const statsDeclined = document.getElementById('dashStatDeclined');
      const statsRate = document.getElementById('dashStatRate');

      const regs = RegistrationService.getAll();
      const events = PortalEvents.getAll();

      const attendingCount = regs.filter(r => r.status === 'attending').length;
      const declinedCount = regs.filter(r => r.status === 'declined').length;
      const totalCount = regs.length;
      const rate = totalCount > 0 ? Math.round((attendingCount / totalCount) * 100) : 0;

      if (statsTotal) statsTotal.textContent = totalCount;
      if (statsAttending) statsAttending.textContent = attendingCount;
      if (statsDeclined) statsDeclined.textContent = declinedCount;
      if (statsRate) statsRate.textContent = rate + '%';

      const filterSelect = document.getElementById('dashFilterEvent');
      if (filterSelect && filterSelect.options.length <= 1) {
        events.forEach(ev => {
          const opt = document.createElement('option');
          opt.value = ev.id;
          opt.textContent = ev.title;
          filterSelect.appendChild(opt);
        });
      }

      this.filterDashboardTable();
    },

    filterDashboardTable: function () {
      const container = document.getElementById('dashboardTableBody');
      if (!container) return;

      const regs = RegistrationService.getAll();
      const events = PortalEvents.getAll();

      const filterEvent = (document.getElementById('dashFilterEvent') || {}).value || 'all';
      const filterStatus = (document.getElementById('dashFilterStatus') || {}).value || 'all';
      const searchVal = ((document.getElementById('dashSearchInput') || {}).value || '').trim().toLowerCase();

      const filtered = regs.filter(r => {
        if (filterEvent !== 'all' && r.eventId !== filterEvent) return false;
        if (filterStatus !== 'all' && r.status !== filterStatus) return false;
        if (searchVal) {
          const matchCode = String(r.personnelCode || '').toLowerCase().includes(searchVal);
          const matchName = String(r.fullName || '').toLowerCase().includes(searchVal);
          const matchNat = String(r.nationalId || '').toLowerCase().includes(searchVal);
          if (!matchCode && !matchName && !matchNat) return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 36px; color: var(--text-muted);">
              رکوردی منطبق با فیلترهای انتخابی یافت نشد.
            </td>
          </tr>
        `;
        return;
      }

      container.innerHTML = filtered.map((r, idx) => {
        const ev = events.find(e => e.id === r.eventId) || { title: r.eventId };
        const isAttending = r.status === 'attending';

        return `
          <tr>
            <td style="font-weight: 600; color: var(--text-muted);">${idx + 1}</td>
            <td style="font-family: monospace; font-weight: 700; color: var(--primary);">${r.personnelCode}</td>
            <td style="font-weight: 600; color: var(--primary);">${r.fullName}</td>
            <td style="font-family: monospace; color: var(--text-secondary);">${r.nationalId || '-'}</td>
            <td><span class="event-category-tag" style="background: var(--surface-soft); color: var(--primary); border: 1px solid var(--border);">${ev.title}</span></td>
            <td>
              <span class="badge-status ${isAttending ? 'attending' : 'declining'}">
                ${isAttending ? `${SVG.check} حاضر` : `${SVG.x} عدم تمایل`}
              </span>
            </td>
            <td style="font-size: 0.76rem; color: var(--text-muted);">${r.jalaliDate || '-'}</td>
            <td>
              <div style="display: flex; gap: 4px;">
                <button class="btn-action btn-ghost" style="height: 28px; width: 28px; padding: 0;" onclick="PortalUI.toggleParticipantStatus('${r.id}')" title="تغییر وضعیت">
                  ${SVG.refresh}
                </button>
                <button class="btn-action btn-ghost" style="height: 28px; width: 28px; padding: 0; color: var(--danger);" onclick="PortalUI.deleteParticipant('${r.id}')" title="حذف رکورد">
                  ${SVG.trash}
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    },

    toggleParticipantStatus: function (id) {
      const regs = RegistrationService.getAll();
      const r = regs.find(item => item.id === id);
      if (r) {
        const nextStatus = r.status === 'attending' ? 'declined' : 'attending';
        RegistrationService.updateStatus(id, nextStatus);
        this.renderAdminDashboard();
        showToast('وضعیت شرکت‌کننده تغییر یافت.', 'success');
      }
    },

    deleteParticipant: function (id) {
      if (confirm('آیا از حذف این رکورد اطمینان دارید؟')) {
        RegistrationService.deleteRegistration(id);
        this.renderAdminDashboard();
        showToast('رکورد با موفقیت حذف گردید.', 'info');
      }
    },

    exportToExcel: function () {
      const regs = RegistrationService.getAll();
      const events = PortalEvents.getAll();

      if (regs.length === 0) {
        showToast('هیچ رکوردی برای دانلود وجود ندارد.', 'error');
        return;
      }

      let csv = '\uFEFF';
      csv += 'ردیف,کد پرسنلی,نام و نام خانوادگی,کد ملی,عنوان رویداد,وضعیت حضور,تاریخ ثبت,توضیحات\n';

      regs.forEach((r, idx) => {
        const ev = events.find(e => e.id === r.eventId) || { title: r.eventId };
        const statusText = r.status === 'attending' ? 'مایل به شرکت' : 'تمایلی به حضور ندارم';
        const cleanNote = (r.note || '').replace(/"/g, '""');

        csv += `"${idx + 1}","${r.personnelCode}","${r.fullName}","${r.nationalId || ''}","${ev.title}","${statusText}","${r.jalaliDate || ''}","${cleanNote}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `entekhab_events_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('گزارش اکسل با موفقیت دانلود شد.', 'success');
    },

    generateSMS: function () {
      const eventSelect = document.getElementById('smsEventSelect');
      const typeSelect = document.getElementById('smsTypeSelect');
      const outputText = document.getElementById('smsOutputText');
      if (!eventSelect || !typeSelect || !outputText) return;

      const eventId = eventSelect.value;
      const type = typeSelect.value;
      const ev = PortalEvents.getById(eventId);
      if (!ev) return;

      const portalUrl = window.location.href.split('#')[0];
      let msg = '';

      if (type === 'invite') {
        msg = `همکار گرامی گروه انتخاب\nجهت اعلام حضور در برنامه «${ev.title}» (${ev.dateText || ''}) لطفاً از طریق پیوند زیر وضعیت خود را مشخص فرمایید:\n${portalUrl}\nگروه توسعه سرمایه گذاری انتخاب`;
      } else if (type === 'reminder') {
        msg = `همکار گرامی، یادآوری برگزاری رویداد «${ev.title}»:\nزمان: ${ev.timeText || ''}\nمحل گردهمایی: ${ev.locationText || ''}\nلطفاً ملزومات و وسایل اعلام‌شده را به همراه داشته باشید.\nگروه انتخاب`;
      } else if (type === 'survey') {
        msg = `همکار گرامی، با سپاس از حضور شما در برنامه «${ev.title}»\nخواهشمند است جهت ارتقای کیفی رویدادهای آتی در نظرسنجی شرکت فرمایید:\n${portalUrl}\nگروه انتخاب`;
      }

      outputText.value = msg;
    },

    copySMS: function () {
      const outputText = document.getElementById('smsOutputText');
      if (!outputText || !outputText.value.trim()) {
        showToast('ابتدا متن پیامک را ایجاد کنید.', 'error');
        return;
      }
      navigator.clipboard.writeText(outputText.value.trim()).then(() => {
        showToast('متن پیامک با موفقیت کپی شد.', 'success');
      }).catch(() => {
        outputText.select();
        document.execCommand('copy');
        showToast('متن پیامک کپی شد.', 'success');
      });
    },

    // ------------------------------------------------------------------------
    // SETTINGS & DYNAMIC EVENT MANAGER
    // ------------------------------------------------------------------------
    renderAdminSettings: function () {
      this.renderEventsManagerList();
      const pinInput = document.getElementById('settingAdminPin');
      if (pinInput) pinInput.value = AdminAuth.getPin();
    },

    renderEventsManagerList: function () {
      const container = document.getElementById('eventsManagerList');
      if (!container) return;

      const events = PortalEvents.getAll();
      container.innerHTML = events.map(ev => `
        <div class="event-manager-item">
          <div class="event-manager-info">
            <h4>${ev.title} <span class="event-category-tag" style="background: var(--primary-soft); color: var(--primary); font-size: 0.7rem;">${ev.category || ''}</span></h4>
            <p>${ev.subtitle || ''} · وضعیت: <strong>${ev.status === 'active' ? 'در حال ثبت‌نام' : ev.status === 'survey' ? 'نظرسنجی فعال' : 'بسته شده'}</strong> · ظرفیت: ${ev.capacity > 0 ? ev.capacity : 'نامحدود'}</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-action btn-secondary" style="height: 32px; padding: 0 10px; font-size: 0.78rem;" onclick="PortalUI.openEditEventModal('${ev.id}')">
              ${SVG.edit} ویرایش
            </button>
            <button class="btn-action btn-ghost" style="height: 32px; padding: 0 10px; font-size: 0.78rem; color: var(--danger);" onclick="PortalUI.deleteEvent('${ev.id}')">
              ${SVG.trash} حذف
            </button>
          </div>
        </div>
      `).join('');
    },

    openAddEventModal: function () {
      const modal = document.getElementById('editEventModal');
      const form = document.getElementById('editEventForm');
      document.getElementById('editEventModalTitle').textContent = 'افزودن رویداد جدید به سامانه';
      form.reset();
      document.getElementById('formEventId').value = '';
      modal.classList.add('open');
    },

    openEditEventModal: function (eventId) {
      const ev = PortalEvents.getById(eventId);
      if (!ev) return;

      const modal = document.getElementById('editEventModal');
      document.getElementById('editEventModalTitle').textContent = `ویرایش رویداد: ${ev.title}`;

      document.getElementById('formEventId').value = ev.id;
      document.getElementById('formEventTitle').value = ev.title || '';
      document.getElementById('formEventCategory').value = ev.category || '';
      document.getElementById('formEventSubtitle').value = ev.subtitle || '';
      document.getElementById('formEventDate').value = ev.dateText || '';
      document.getElementById('formEventTime').value = ev.timeText || '';
      document.getElementById('formEventReturn').value = ev.returnText || '';
      document.getElementById('formEventLocation').value = ev.locationText || '';
      document.getElementById('formEventCapacity').value = ev.capacity || 0;
      document.getElementById('formEventDeadlineDate').value = ev.deadlineDate || '';
      document.getElementById('formEventDeadlineTime').value = ev.deadlineTime || '';
      document.getElementById('formEventStatus').value = ev.status || 'active';
      document.getElementById('formEventNotes').value = (ev.notes || []).join('\n');
      document.getElementById('formEventChecklist').value = (ev.checklist || []).join('\n');

      modal.classList.add('open');
    },

    saveEventFromModal: function (e) {
      e.preventDefault();
      const id = document.getElementById('formEventId').value.trim();
      const title = document.getElementById('formEventTitle').value.trim();
      const category = document.getElementById('formEventCategory').value.trim();
      const subtitle = document.getElementById('formEventSubtitle').value.trim();
      const dateText = document.getElementById('formEventDate').value.trim();
      const timeText = document.getElementById('formEventTime').value.trim();
      const returnText = document.getElementById('formEventReturn').value.trim();
      const locationText = document.getElementById('formEventLocation').value.trim();
      const capacity = parseInt(document.getElementById('formEventCapacity').value) || 0;
      const deadlineDate = document.getElementById('formEventDeadlineDate').value.trim();
      const deadlineTime = document.getElementById('formEventDeadlineTime').value.trim();
      const status = document.getElementById('formEventStatus').value;
      const notesRaw = document.getElementById('formEventNotes').value;
      const checklistRaw = document.getElementById('formEventChecklist').value;

      if (!title) {
        showToast('عنوان رویداد الزامی است.', 'error');
        return;
      }

      const notes = notesRaw.split('\n').map(s => s.trim()).filter(Boolean);
      const checklist = checklistRaw.split('\n').map(s => s.trim()).filter(Boolean);

      PortalEvents.saveEvent({
        id: id || ('ev_' + Date.now()),
        title,
        category,
        subtitle,
        dateText,
        timeText,
        returnText,
        locationText,
        capacity,
        deadlineDate,
        deadlineTime,
        status,
        notes,
        checklist
      });

      document.getElementById('editEventModal').classList.remove('open');
      this.renderEventsManagerList();
      this.renderEventsGrid();
      this.renderHomeOverview();
      showToast('مشخصات رویداد با موفقیت ذخیره شد.', 'success');
    },

    deleteEvent: function (id) {
      if (confirm('آیا مطمئن هستید که می‌خواهید این رویداد را حذف نمایید؟')) {
        PortalEvents.deleteEvent(id);
        this.renderEventsManagerList();
        this.renderEventsGrid();
        this.renderHomeOverview();
        showToast('رویداد حذف شد.', 'info');
      }
    },

    resetEventsToDefaults: function () {
      if (confirm('آیا مایل به بازنشانی تمام رویدادها به ۳ رویداد اولیه پیش‌فرض هستید؟')) {
        PortalEvents.resetToDefaults();
        this.renderEventsManagerList();
        this.renderEventsGrid();
        this.renderHomeOverview();
        showToast('رویدادها به حالت پیش‌فرض بازنشانی شدند.', 'success');
      }
    },

    saveAdminPin: function () {
      const pinInput = document.getElementById('settingAdminPin');
      if (!pinInput || !pinInput.value.trim()) {
        showToast('رمز عبور نمی‌تواند خالی باشد.', 'error');
        return;
      }
      AdminAuth.setPin(pinInput.value.trim());
      showToast('رمز عبور مدیر با موفقیت تغییر یافت.', 'success');
    },

    openAddNotificationModal: function () {
      const title = prompt('عنوان اطلاعیه جدید:');
      if (!title) return;
      const category = prompt('دسته‌بندی (مثلاً: عمومی، رویداد ۱):', 'عمومی') || 'عمومی';
      const content = prompt('متن اطلاعیه:');
      if (!content) return;

      NotificationService.add({
        title,
        category,
        content
      });

      this.renderNotificationsList();
      showToast('اطلاعیه جدید با موفقیت منتشر گردید.', 'success');
    }
  };

  window.PortalUI = PortalUI;
  window.PortalAuth = PortalAuth;

  document.addEventListener('DOMContentLoaded', () => {
    PortalUI.init();
    PortalUI.bindSurveyForm();

    const editForm = document.getElementById('editEventForm');
    if (editForm) {
      editForm.addEventListener('submit', (e) => PortalUI.saveEventFromModal(e));
    }

    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        PortalUI.activeFilter = chip.dataset.filter || 'all';
        PortalUI.renderEventsGrid();
      });
    });

    const dashSearch = document.getElementById('dashSearchInput');
    const dashFilterEv = document.getElementById('dashFilterEvent');
    const dashFilterSt = document.getElementById('dashFilterStatus');
    if (dashSearch) dashSearch.addEventListener('input', () => PortalUI.filterDashboardTable());
    if (dashFilterEv) dashFilterEv.addEventListener('change', () => PortalUI.filterDashboardTable());
    if (dashFilterSt) dashFilterSt.addEventListener('change', () => PortalUI.filterDashboardTable());
  });

})();
