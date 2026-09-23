/**
 * سامانه جامع رویدادهای گروه توسعه سرمایه‌گذاری انتخاب
 * Unified Events Portal Logic & Dynamic UI Engine
 */

(function () {
  'use strict';

  // ==========================================================================
  // CONFIG & STORAGE KEYS
  // ==========================================================================
  const PORTAL_KEYS = {
    EVENTS: 'entekhab_portal_events_v2',
    REGISTRATIONS: 'entekhab_events_registrations',
    NOTIFICATIONS: 'entekhab_portal_notifications_v2',
    SURVEYS: 'entekhab_portal_surveys_v2',
    ADMIN_SESSION: 'entekhab_portal_admin_session',
    ADMIN_PIN: 'entekhab_portal_admin_pin',
    SETTINGS: 'entekhab_portal_general_settings'
  };

  const DEFAULT_ADMIN_PIN = '992113';

  // ۳ رویداد پیش‌فرض طبق الزامات پروژه
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
      capacity: 0, // 0 یعنی نامحدود
      status: 'active', // active | survey | closed
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
      category: 'ایونت علمی تفریحی',
      subtitle: 'ایونت علمی تفریحی گروه توسعه سرمایه گذاری انتخاب',
      dateText: 'چهارشنبه ۲۵/۰۶/۱۴۰۵ الی پنجشنبه ۲۶/۰۶/۱۴۰۵',
      timeText: 'چهارشنبه ساعت ۱۴:۰۰ (حرکت)',
      returnText: 'پنجشنبه ساعت ۱۳:۰۰ (بازگشت)',
      locationText: 'محل تجمع: ساختمان مرکزی (خیابان امام خمینی)',
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
      category: 'ایونت تفریحی و ورزشی',
      subtitle: 'ایونت تفریحی گروه توسعه سرمایه گذاری انتخاب',
      dateText: 'پنجشنبه ۰۲/۰۷/۱۴۰۵',
      timeText: 'ساعت ۰۶:۰۰ صبح (حرکت)',
      returnText: 'ساعت ۱۸:۰۰ عصر (بازگشت)',
      locationText: 'محل تجمع: ساختمان مرکزی',
      deadlineDate: '1405/06/28',
      deadlineTime: '15:00',
      capacity: 80,
      status: 'active',
      themeColor: 'accent-theme-3',
      notes: [
        'جهت بهره‌مندی هرچه بیشتر از این سفر، موضوعات و ملزومات اعلام‌شده را دقیقاً مد نظر قرار دهید.',
        'با توجه به حضور در رودخانه و مواجهه با آب، همراه داشتن لباس اضافی الزامی است.'
      ],
      checklist: [
        '۱- همراه داشتن لوازم شخصی (دارو و ضدآفتاب، کلاه، تیشرت آستین بلند، عینک آفتابی، دستمال مرطوب)',
        '۲- لباس اضافه و حوله (با توجه به مواجهه مستقیم با آب رودخانه)',
        '۳- خودداری از آوردن زیورآلات، ساعت مچی و اکسسوری‌های غیرضروری و گران‌قیمت',
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
      content: 'همکاران گرامی، من‌بعد تمامی مراحل اعلام حضور، مشاهده مشخصات و ثبت نظرسنجی رویدادهای سازمانی از طریق این پرتال یکپارچه انجام می‌پذیرد.'
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
      content: 'با توجه به ماهیت ورزشی رفتینگ، به همراه داشتن صندل ضدلغزش، لباس اضافه و عدم همراه داشتن وسایل قیمتی اکیداً توصیه می‌گردد.'
    }
  ];

  // ==========================================================================
  // 1. DATA SERVICES (Events, Registrations, Personnel, Notifications)
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

      // جستجو در PERSONNEL_MAP
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
      // record: { eventId, personnelCode, fullName, nationalId, status: 'attending'|'declined', note }
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
        status: record.status || 'attending', // 'attending' | 'declined'
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
      // { eventId, personnelCode, fullName, ratingQuality, ratingOrg, ratingCatering, comment }
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

  const AdminAuth = {
    isAuthenticated: function () {
      return sessionStorage.getItem(PORTAL_KEYS.ADMIN_SESSION) === 'true';
    },

    getPin: function () {
      return localStorage.getItem(PORTAL_KEYS.ADMIN_PIN) || DEFAULT_ADMIN_PIN;
    },

    setPin: function (newPin) {
      localStorage.setItem(PORTAL_KEYS.ADMIN_PIN, String(newPin).trim());
    },

    login: function (enteredPin) {
      const correctPin = this.getPin();
      if (String(enteredPin).trim() === correctPin || String(enteredPin).trim() === DEFAULT_ADMIN_PIN) {
        sessionStorage.setItem(PORTAL_KEYS.ADMIN_SESSION, 'true');
        return true;
      }
      return false;
    },

    logout: function () {
      sessionStorage.removeItem(PORTAL_KEYS.ADMIN_SESSION);
    }
  };

  // Helper date formatter
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

  // Toast notification helper
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
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // ==========================================================================
  // 2. UI RENDER ENGINE
  // ==========================================================================

  const PortalUI = {
    activeTab: 'home',
    activeFilter: 'all',

    init: function () {
      this.bindTabNavigation();
      this.bindAdminControls();
      this.bindInquiryForm();
      this.renderHomeOverview();
      this.renderEventsGrid();
      this.renderNotificationsList();
      this.updateAdminVisibility();

      // Check if admin is logged in and render dashboard/settings
      if (AdminAuth.isAuthenticated()) {
        this.renderAdminDashboard();
        this.renderAdminSettings();
      }
    },

    // Tab Navigation Switcher
    switchTab: function (tabName) {
      this.activeTab = tabName;

      // Update Tab Button States
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        if (btn.dataset.tab === tabName) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update Tab Content Views
      document.querySelectorAll('.tab-content-view').forEach(view => {
        if (view.id === `tabView-${tabName}`) {
          view.classList.add('active-view');
        } else {
          view.classList.remove('active-view');
        }
      });

      // Tab specific re-renders
      if (tabName === 'events') {
        this.renderEventsGrid();
      } else if (tabName === 'dashboard') {
        if (AdminAuth.isAuthenticated()) {
          this.renderAdminDashboard();
        } else {
          this.showAdminLoginModal('dashboard');
        }
      } else if (tabName === 'settings') {
        if (AdminAuth.isAuthenticated()) {
          this.renderAdminSettings();
        } else {
          this.showAdminLoginModal('settings');
        }
      } else if (tabName === 'notifications') {
        this.renderNotificationsList();
      } else if (tabName === 'home') {
        this.renderHomeOverview();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    bindTabNavigation: function () {
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tab = btn.dataset.tab;
          this.switchTab(tab);
        });
      });
    },

    bindAdminControls: function () {
      const adminBtn = document.getElementById('adminLoginChipBtn');
      if (adminBtn) {
        adminBtn.addEventListener('click', () => {
          if (AdminAuth.isAuthenticated()) {
            if (confirm('آیا مایل به خروج از وضعیت مدیریت (ادمین) هستید؟')) {
              AdminAuth.logout();
              this.updateAdminVisibility();
              this.switchTab('home');
              showToast('از پنل مدیریت خارج شدید.', 'info');
            }
          } else {
            this.showAdminLoginModal();
          }
        });
      }

      // Close modals on overlay or close button
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.remove('open');
        });
        const closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => modal.classList.remove('open'));
        }
      });

      // Admin Login Form
      const authForm = document.getElementById('adminLoginForm');
      if (authForm) {
        authForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const pinInput = document.getElementById('adminPinInput');
          if (AdminAuth.login(pinInput.value)) {
            document.getElementById('adminAuthModal').classList.remove('open');
            pinInput.value = '';
            this.updateAdminVisibility();
            showToast('احراز هویت مدیر با موفقیت انجام شد.', 'success');
            const returnTab = authForm.dataset.returnTab || 'dashboard';
            this.switchTab(returnTab);
          } else {
            showToast('رمز عبور مدیر نادرست است.', 'error');
            pinInput.focus();
          }
        });
      }
    },

    showAdminLoginModal: function (returnTab = '') {
      const modal = document.getElementById('adminAuthModal');
      const form = document.getElementById('adminLoginForm');
      if (form) form.dataset.returnTab = returnTab;
      if (modal) {
        modal.classList.add('open');
        const input = document.getElementById('adminPinInput');
        if (input) {
          input.value = '';
          input.focus();
        }
      }
    },

    updateAdminVisibility: function () {
      const isAuth = AdminAuth.isAuthenticated();
      const adminTabs = document.querySelectorAll('.admin-only-tab');
      const adminBtn = document.getElementById('adminLoginChipBtn');

      adminTabs.forEach(tab => {
        if (isAuth) tab.classList.add('admin-visible');
        else tab.classList.remove('admin-visible');
      });

      if (adminBtn) {
        if (isAuth) {
          adminBtn.classList.add('is-admin');
          adminBtn.innerHTML = `<span>⚙️</span> مدیر سامانه (فعال)`;
        } else {
          adminBtn.classList.remove('is-admin');
          adminBtn.innerHTML = `<span>🔒</span> ورود مدیر`;
        }
      }
    },

    // ------------------------------------------------------------------------
    // Home Overview Rendering
    // ------------------------------------------------------------------------
    renderHomeOverview: function () {
      const events = PortalEvents.getAll();
      const regs = RegistrationService.getAll();
      const attendees = regs.filter(r => r.status === 'attending');

      // Update counters in Hero
      const activeEventsCount = events.filter(e => e.status === 'active').length;
      const elActiveCount = document.getElementById('heroActiveEventsCount');
      if (elActiveCount) elActiveCount.textContent = activeEventsCount;

      const elTotalRegs = document.getElementById('heroTotalRegsCount');
      if (elTotalRegs) elTotalRegs.textContent = attendees.length;

      // Render Home Mini Cards
      const container = document.getElementById('homeHighlightsGrid');
      if (!container) return;

      container.innerHTML = events.slice(0, 3).map(ev => {
        const evRegs = regs.filter(r => r.eventId === ev.id && r.status === 'attending');
        const capText = ev.capacity > 0 ? `${evRegs.length} / ${ev.capacity}` : `${evRegs.length} ثبت‌نام`;
        const statusLabel = ev.status === 'active' ? 'در حال ثبت‌نام' : ev.status === 'survey' ? 'مرحله نظرسنجی' : 'پایان‌یافته';
        const statusClass = ev.status === 'active' ? 'status-active' : ev.status === 'survey' ? 'status-survey' : 'status-closed';

        return `
          <div class="event-card">
            <div class="event-card-banner ${ev.themeColor || 'accent-theme-1'}">
              <div class="event-badge-row">
                <span class="event-category-tag">${ev.category || 'رویداد سازمانی'}</span>
                <span class="event-status-pill ${statusClass}">${statusLabel}</span>
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff;">${ev.title}</h3>
            </div>
            <div class="event-card-body">
              <p class="event-card-subtitle">${ev.subtitle || ''}</p>
              <div class="event-meta-list">
                <div class="event-meta-item">
                  <span class="event-meta-icon">📅</span>
                  <span class="event-meta-label">تاریخ:</span>
                  <span class="event-meta-val">${ev.dateText || '-'}</span>
                </div>
                <div class="event-meta-item">
                  <span class="event-meta-icon">📍</span>
                  <span class="event-meta-label">مکان:</span>
                  <span class="event-meta-val">${ev.locationText || '-'}</span>
                </div>
                <div class="event-meta-item">
                  <span class="event-meta-icon">👥</span>
                  <span class="event-meta-label">مشارکت:</span>
                  <span class="event-meta-val">${capText}</span>
                </div>
              </div>
              <button class="btn-action btn-primary" onclick="PortalUI.openEventDetail('${ev.id}')">
                مشاهده و ثبت‌نام در این رویداد
              </button>
            </div>
          </div>
        `;
      }).join('');
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

    // ------------------------------------------------------------------------
    // Quick Inquiry Form (استعلام وضعیت من)
    // ------------------------------------------------------------------------
    bindInquiryForm: function () {
      const btn = document.getElementById('btnQuickInquiry');
      const input = document.getElementById('quickInquiryCode');
      const resultBox = document.getElementById('quickInquiryResult');

      if (!btn || !input || !resultBox) return;

      const doInquiry = () => {
        const code = input.value.trim();
        if (!code) {
          showToast('لطفاً کد پرسنلی خود را وارد فرمایید.', 'error');
          input.focus();
          return;
        }

        const person = PersonnelService.lookup(code);
        const userRegs = RegistrationService.getUserAllRegistrations(code);
        const events = PortalEvents.getAll();

        resultBox.style.display = 'block';

        let html = `
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 10px; margin-bottom: 12px;">
            <div>
              <strong style="color: var(--navy-900); font-size: 1.05rem;">${person ? person.name : 'پرسنل کد ' + code}</strong>
              ${person && person.nationalId ? `<span style="font-size: 0.8rem; color: var(--text-muted); margin-right: 8px;">(کد ملی: ${person.nationalId})</span>` : ''}
            </div>
            <span class="badge-status attending">استعلام موفق</span>
          </div>
        `;

        if (userRegs.length === 0) {
          html += `
            <div style="font-size: 0.88rem; color: var(--text-secondary); text-align: center; padding: 12px 0;">
              تاکنون وضعیت حضوری برای کد پرسنلی شما در هیچ رویدادی ثبت نشده است.
              <br><button class="btn-action btn-secondary" style="margin-top: 10px;" onclick="PortalUI.switchTab('events')">مشاهده رویدادها و ثبت‌نام</button>
            </div>
          `;
        } else {
          html += `<div style="display: flex; flex-direction: column; gap: 8px;">`;
          userRegs.forEach(reg => {
            const ev = events.find(e => e.id === reg.eventId) || { title: reg.eventId };
            const isAttending = reg.status === 'attending';
            html += `
              <div style="display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid var(--border-light); padding: 10px 14px; border-radius: var(--radius-md);">
                <div>
                  <strong style="font-size: 0.9rem; color: var(--navy-900);">${ev.title}</strong>
                  <div style="font-size: 0.76rem; color: var(--text-muted);">ثبت شده در: ${reg.jalaliDate || '-'}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="badge-status ${isAttending ? 'attending' : 'declining'}">
                    ${isAttending ? '✅ اعلام حضور (مایل به شرکت)' : '❌ عدم تمایل به حضور'}
                  </span>
                  <button class="btn-action btn-secondary" style="padding: 4px 10px; font-size: 0.78rem; height: 32px;" onclick="PortalUI.openEventDetail('${reg.eventId}')">
                    تغییر وضعیت
                  </button>
                </div>
              </div>
            `;
          });
          html += `</div>`;
        }

        resultBox.innerHTML = html;
      };

      btn.addEventListener('click', doInquiry);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doInquiry();
      });
    },

    // ------------------------------------------------------------------------
    // Events Grid Rendering
    // ------------------------------------------------------------------------
    renderEventsGrid: function () {
      const container = document.getElementById('eventsGridContainer');
      if (!container) return;

      const events = PortalEvents.getAll();
      const regs = RegistrationService.getAll();

      // Filter events
      let filtered = events;
      if (this.activeFilter === 'active') {
        filtered = events.filter(e => e.status === 'active');
      } else if (this.activeFilter === 'survey') {
        filtered = events.filter(e => e.status === 'survey');
      } else if (this.activeFilter === 'closed') {
        filtered = events.filter(e => e.status === 'closed');
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
            <p style="color: var(--text-muted);">هیچ رویدادی با این فیلتر یافت نشد.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(ev => {
        const evRegs = regs.filter(r => r.eventId === ev.id && r.status === 'attending');
        const capText = ev.capacity > 0 ? `${evRegs.length} از ${ev.capacity} نفر` : `${evRegs.length} نفر اعلام حضور`;
        const isSurvey = ev.status === 'survey';
        const isClosed = ev.status === 'closed';

        const statusLabel = isSurvey ? 'در حال نظرسنجی' : isClosed ? 'مهلت پایان یافته' : 'در حال ثبت‌نام';
        const statusClass = isSurvey ? 'status-survey' : isClosed ? 'status-closed' : 'status-active';

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

              <div class="event-meta-list">
                <div class="event-meta-item">
                  <span class="event-meta-icon">📅</span>
                  <span class="event-meta-label">تاریخ رویداد:</span>
                  <span class="event-meta-val">${ev.dateText || '-'}</span>
                </div>
                <div class="event-meta-item">
                  <span class="event-meta-icon">⏰</span>
                  <span class="event-meta-label">ساعت حرکت:</span>
                  <span class="event-meta-val">${ev.timeText || '-'}</span>
                </div>
                ${ev.returnText ? `
                <div class="event-meta-item">
                  <span class="event-meta-icon">⌛</span>
                  <span class="event-meta-label">ساعت بازگشت:</span>
                  <span class="event-meta-val">${ev.returnText}</span>
                </div>` : ''}
                <div class="event-meta-item">
                  <span class="event-meta-icon">📍</span>
                  <span class="event-meta-label">محل تجمع:</span>
                  <span class="event-meta-val">${ev.locationText || '-'}</span>
                </div>
                <div class="event-meta-item">
                  <span class="event-meta-icon">👥</span>
                  <span class="event-meta-label">ظرفیت:</span>
                  <span class="event-meta-val">${capText}</span>
                </div>
                ${ev.deadlineDate ? `
                <div class="event-meta-item">
                  <span class="event-meta-icon">⏳</span>
                  <span class="event-meta-label">مهلت ثبت‌نام:</span>
                  <span class="event-meta-val" style="color: #b91c1c; font-weight: 700;">تا ${ev.deadlineDate} ساعت ${ev.deadlineTime || ''}</span>
                </div>` : ''}
              </div>

              <!-- Rules & Checklist Drawer -->
              <div class="event-rules-preview">
                <div class="rules-expander" onclick="PortalUI.toggleRulesDrawer('${ev.id}')">
                  <span>📋</span> <span>مشاهده نکات، ضوابط و وسایل مورد نیاز</span> <span>▼</span>
                </div>
                <div class="rules-content-drawer" id="rulesDrawer_${ev.id}">
                  <strong style="color: var(--navy-900); display: block; margin-bottom: 6px;">نکات مهم حضور:</strong>
                  <ul>
                    ${(ev.notes || []).map(n => `<li>${n}</li>`).join('')}
                  </ul>
                  ${ev.checklist && ev.checklist.length > 0 ? `
                  <strong style="color: var(--navy-900); display: block; margin: 10px 0 6px;">وسایل و ملزومات ضروری:</strong>
                  <ul>
                    ${ev.checklist.map(c => `<li>${c}</li>`).join('')}
                  </ul>` : ''}
                </div>
              </div>

              <!-- Action Footer (In-place registration or survey) -->
              <div class="event-card-footer">
                ${isSurvey ? `
                  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); padding: 14px; text-align: center;">
                    <div style="font-weight: 800; color: var(--navy-900); margin-bottom: 6px;">
                      🌟 این رویداد برگزار شد و نظرسنجی آن فعال است!
                    </div>
                    <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 12px;">
                      همکار گرامی در صورت حضور در این برنامه، لطفاً دیدگاه ارزشمند خود را ثبت فرمایید.
                    </p>
                    <button class="btn-action btn-primary" onclick="PortalUI.openSurveyModal('${ev.id}')">
                      ثبت فرم نظرسنجی و امتیازدهی
                    </button>
                  </div>
                ` : isClosed ? `
                  <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 12px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
                    مهلت اعلام حضور در این رویداد به اتمام رسیده است.
                  </div>
                ` : `
                  <button class="register-accordion-toggle" onclick="PortalUI.toggleRegisterAccordion('${ev.id}')">
                    <span>✍️</span> <span>اعلام وضعیت حضور در این برنامه</span>
                  </button>

                  <div class="register-accordion-content" id="registerBox_${ev.id}">
                    <div class="form-group">
                      <label class="form-label">شماره پرسنلی خود را وارد فرمایید:</label>
                      <input type="text" class="form-input" id="inputPersonnelCode_${ev.id}" placeholder="مثال: 992113" oninput="PortalUI.handlePersonnelCodeInput('${ev.id}', this.value)">
                      <div class="personnel-lookup-feedback" id="feedback_${ev.id}"></div>
                    </div>

                    <div id="hiddenFields_${ev.id}" style="display: none;">
                      <div class="form-group">
                        <label class="form-label">نام و نام خانوادگی:</label>
                        <input type="text" class="form-input" id="inputFullName_${ev.id}" readonly style="background: #f8fafc;">
                      </div>
                      <div class="form-group">
                        <label class="form-label">کد ملی:</label>
                        <input type="text" class="form-input" id="inputNationalId_${ev.id}" readonly style="background: #f8fafc;">
                      </div>
                      <div class="form-group">
                        <label class="form-label">توضیحات اختیاری (شماره تماس یا همراه):</label>
                        <input type="text" class="form-input" id="inputNote_${ev.id}" placeholder="در صورت نیاز وارد کنید">
                      </div>

                      <div class="btn-row-dual">
                        <button class="btn-action btn-attend" onclick="PortalUI.submitRegistration('${ev.id}', 'attending')">
                          ✅ مایل به شرکت هستم
                        </button>
                        <button class="btn-action btn-decline" onclick="PortalUI.submitRegistration('${ev.id}', 'declined')">
                          ❌ تمایلی به حضور ندارم
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

        // Check if already registered
        const existing = RegistrationService.getUserRegistration(eventId, clean);
        if (existing) {
          feedback.textContent += ` (وضعیت فعلی شما: ${existing.status === 'attending' ? 'مایل به شرکت' : 'عدم تمایل'})`;
        }
      } else {
        feedback.className = 'personnel-lookup-feedback not-found';
        feedback.textContent = 'شماره پرسنلی در دیتابیس یافت نشد، اما امکان ثبت نام دستی فراهم است.';
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
        showToast('لطفاً کد پرسنلی را وارد فرمایید.', 'error');
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
        showToast(`اعلام حضور شما برای رویداد با موفقیت ${result.isUpdate ? 'به‌روزرسانی' : 'ثبت'} شد.`, 'success');
      } else {
        showToast('عدم تمایل شما به حضور در این برنامه ثبت گردید.', 'info');
      }

      // Re-render
      this.renderEventsGrid();
      this.renderHomeOverview();
    },

    // ------------------------------------------------------------------------
    // Survey Modal
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
      if (modal) modal.classList.add('open');
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
          showToast('لطفاً کد پرسنلی را وارد فرمایید.', 'error');
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
        showToast('دیدگاه و نظرسنجی شما با سپاس فراوان ثبت گردید.', 'success');
      });
    },

    // ------------------------------------------------------------------------
    // Notifications Rendering
    // ------------------------------------------------------------------------
    renderNotificationsList: function () {
      const container = document.getElementById('notificationsListContainer');
      if (!container) return;

      const notifs = NotificationService.getAll();
      const isAdmin = AdminAuth.isAuthenticated();

      if (notifs.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 48px; background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border-light); color: var(--text-muted);">
            در حال حاضر هیچ اعلان فعالی وجود ندارد.
          </div>
        `;
        return;
      }

      container.innerHTML = notifs.map(n => `
        <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 14px; box-shadow: var(--shadow-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="event-category-tag" style="background: var(--navy-100); color: var(--navy-800);">${n.category || 'اطلاعیه'}</span>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--navy-900); margin: 0;">${n.title}</h4>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">${n.date || ''}</span>
              ${isAdmin ? `
                <button class="btn-action btn-decline" style="padding: 2px 8px; font-size: 0.74rem; height: 26px;" onclick="PortalUI.deleteNotification('${n.id}')">
                  حذف
                </button>
              ` : ''}
            </div>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; margin: 0;">${n.content}</p>
        </div>
      `).join('');
    },

    deleteNotification: function (id) {
      if (confirm('آیا از حذف این اعلان اطمینان دارید؟')) {
        NotificationService.delete(id);
        this.renderNotificationsList();
        showToast('اعلان حذف شد.', 'info');
      }
    },

    // ------------------------------------------------------------------------
    // 3. ADMIN DASHBOARD & REPORTS (فقط ادمین)
    // ------------------------------------------------------------------------
    renderAdminDashboard: function () {
      const container = document.getElementById('dashboardTableBody');
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

      // Populate Event Filter in Dashboard toolbar
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
              هیچ رکوردی منطبق با جستجو یا فیلترهای انتخابی یافت نشد.
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
            <td style="font-weight: 700; color: var(--navy-900);">${idx + 1}</td>
            <td style="font-family: monospace; font-weight: 700;">${r.personnelCode}</td>
            <td style="font-weight: 600; color: var(--navy-900);">${r.fullName}</td>
            <td style="font-family: monospace;">${r.nationalId || '-'}</td>
            <td><span class="event-category-tag" style="background: var(--navy-50); color: var(--navy-800); border: 1px solid var(--border-light);">${ev.title}</span></td>
            <td>
              <span class="badge-status ${isAttending ? 'attending' : 'declining'}">
                ${isAttending ? '✅ حاضر' : '❌ غایب / انصراف'}
              </span>
            </td>
            <td style="font-size: 0.8rem; color: var(--text-muted);">${r.jalaliDate || '-'}</td>
            <td>
              <div style="display: flex; gap: 6px;">
                <button class="btn-action btn-secondary" style="height: 28px; padding: 0 8px; font-size: 0.72rem;" onclick="PortalUI.toggleParticipantStatus('${r.id}')" title="تغییر وضعیت حاضر/غایب">
                  🔄
                </button>
                <button class="btn-action btn-decline" style="height: 28px; padding: 0 8px; font-size: 0.72rem;" onclick="PortalUI.deleteParticipant('${r.id}')" title="حذف رکورد">
                  🗑️
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

      // ساخت فایل CSV سازگار با اکسل (با انکودینگ UTF-8 BOM)
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
    // 4. SETTINGS & DYNAMIC EVENT MANAGER (مدیریت رویدادها بدون نیاز به کد)
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
            <h4>${ev.title} <span class="event-category-tag" style="background: var(--navy-100); color: var(--navy-800);">${ev.category || ''}</span></h4>
            <p>${ev.subtitle || ''} | وضعیت: <strong>${ev.status === 'active' ? 'ثبت‌نام فعال' : ev.status === 'survey' ? 'نظرسنجی فعال' : 'بسته شده'}</strong> | ظرفیت: ${ev.capacity > 0 ? ev.capacity : 'نامحدود'}</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-action btn-secondary" style="height: 34px; padding: 0 12px; font-size: 0.8rem;" onclick="PortalUI.openEditEventModal('${ev.id}')">
              ✏️ ویرایش مشخصات
            </button>
            <button class="btn-action btn-decline" style="height: 34px; padding: 0 12px; font-size: 0.8rem;" onclick="PortalUI.deleteEvent('${ev.id}')">
              🗑️ حذف
            </button>
          </div>
        </div>
      `).join('');
    },

    openAddEventModal: function () {
      const modal = document.getElementById('editEventModal');
      const form = document.getElementById('editEventForm');
      document.getElementById('editEventModalTitle').textContent = '➕ افزودن رویداد جدید به سامانه';
      form.reset();
      document.getElementById('formEventId').value = '';
      modal.classList.add('open');
    },

    openEditEventModal: function (eventId) {
      const ev = PortalEvents.getById(eventId);
      if (!ev) return;

      const modal = document.getElementById('editEventModal');
      document.getElementById('editEventModalTitle').textContent = `✏️ ویرایش رویداد: ${ev.title}`;

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
      showToast('رمز عبور ادمین با موفقیت تغییر یافت.', 'success');
    },

    openAddNotificationModal: function () {
      const title = prompt('عنوان اطلاعیه جدید را وارد فرمایید:');
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
      showToast('اعلان جدید با موفقیت منتشر گردید.', 'success');
    }
  };

  // Expose to window for inline onclick handlers
  window.PortalUI = PortalUI;

  // Initial load
  document.addEventListener('DOMContentLoaded', () => {
    PortalUI.init();
    PortalUI.bindSurveyForm();

    // Event listeners for Edit Event Form
    const editForm = document.getElementById('editEventForm');
    if (editForm) {
      editForm.addEventListener('submit', (e) => PortalUI.saveEventFromModal(e));
    }

    // Filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        PortalUI.activeFilter = chip.dataset.filter || 'all';
        PortalUI.renderEventsGrid();
      });
    });

    // Dashboard search & filter inputs
    const dashSearch = document.getElementById('dashSearchInput');
    const dashFilterEv = document.getElementById('dashFilterEvent');
    const dashFilterSt = document.getElementById('dashFilterStatus');
    if (dashSearch) dashSearch.addEventListener('input', () => PortalUI.filterDashboardTable());
    if (dashFilterEv) dashFilterEv.addEventListener('change', () => PortalUI.filterDashboardTable());
    if (dashFilterSt) dashFilterSt.addEventListener('change', () => PortalUI.filterDashboardTable());
  });

})();
