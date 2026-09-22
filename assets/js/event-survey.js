/**
 * ماژول نظرسنجی اختصاصی درون‌صفحه‌ای رویدادهای گروه انتخاب
 * Entekhab In-Page Event Survey Module
 * پشتیبانی کامل از رویدادهای صبح همدلی، کویر ورزنه و رفتینگ مارکده
 * همراه با قابلیت ارسال با نام و ارسال به‌صورت ناشناس
 */

(function (window) {
  'use strict';

  // سوالات و قالب‌های پیش‌فرض هر ۳ رویداد
  const EVENT_SURVEY_DEFAULTS = {
    'sobh-hamdeli': {
      id: 'survey_sobh-hamdeli',
      eventId: 'sobh-hamdeli',
      title: 'نظرسنجی کیفیت برگزاری رویداد صبح همدلی',
      description: 'همکار گرامی، خواهشمند است با اعلام نظرات و ارزیابی بخش‌های مختلف برنامه پیاده‌روی صبح همدلی، ما را در ارتقای کیفیت برنامه‌های آتی یاری فرمایید.',
      questions: [
        {
          id: 'q1_sobh_satisfaction',
          text: 'میزان رضایت کلی شما از برگزاری رویداد پیاده‌روی صبح همدلی:',
          type: 'radio',
          required: true,
          options: ['بسیار عالی', 'خوب', 'متوسط', 'ضعیف']
        },
        {
          id: 'q2_sobh_schedule',
          text: 'نحوه اطلاع‌رسانی، زمان‌بندی و هماهنگی‌های صبحگاهی رویداد:',
          type: 'radio',
          required: true,
          options: ['عالی', 'مناسب', 'نیاز به بهبود', 'ضعیف']
        },
        {
          id: 'q3_sobh_location',
          text: 'مکان گردهمایی (عمارت ماهور)، خدمات ترانسفر و پذیرایی صبحانه:',
          type: 'radio',
          required: true,
          options: ['بسیار مطلوب', 'خوب', 'متوسط', 'نامناسب']
        },
        {
          id: 'q4_sobh_continue',
          text: 'میزان تمایل شما به تداوم و برگزاری مجدد برنامه‌های پیاده‌روی صبحگاهی:',
          type: 'radio',
          required: true,
          options: ['بسیار زیاد', 'زیاد', 'متوسط', 'تمایلی ندارم']
        },
        {
          id: 'q5_sobh_feedback',
          text: 'پیشنهادات، انتقادات و نظرات شما جهت بهبود برنامه‌های آتی:',
          type: 'textarea',
          required: false,
          options: []
        }
      ]
    },
    'kavir-varzaneh': {
      id: 'survey_kavir-varzaneh',
      eventId: 'kavir-varzaneh',
      title: 'نظرسنجی کیفیت برگزاری تور کویر ورزنه',
      description: 'همکار گرامی، خواهشمند است با ارزیابی بخش‌های مختلف تور کویر ورزنه، ما را در برگزاری هرچه بهتر برنامه‌های آتی همراهی فرمایید.',
      questions: [
        {
          id: 'q1_kavir_satisfaction',
          text: 'میزان رضایت کلی شما از سفر و تور کویر ورزنه:',
          type: 'radio',
          required: true,
          options: ['بسیار عالی', 'خوب', 'متوسط', 'ضعیف']
        },
        {
          id: 'q2_kavir_transport',
          text: 'کیفیت ترابری، اتوبوس‌ها و نظم زمان‌بندی رفت و برگشت:',
          type: 'radio',
          required: true,
          options: ['بسیار خوب', 'مناسب', 'نیاز به بهبود', 'ضعیف']
        },
        {
          id: 'q3_kavir_catering',
          text: 'کیفیت پذیرایی، وعده‌های غذایی و میان‌وعده‌های سفر:',
          type: 'radio',
          required: true,
          options: ['عالی', 'خوب', 'متوسط', 'نامناسب']
        },
        {
          id: 'q4_kavir_programs',
          text: 'میزان جذابیت و کیفیت برنامه‌های رصدی، علمی و تفریحات کویر:',
          type: 'radio',
          required: true,
          options: ['بسیار جذاب', 'خوب', 'متوسط', 'نیازمند ارتقا']
        },
        {
          id: 'q5_kavir_feedback',
          text: 'پیشنهادات، انتقادات یا نکات تکمیلی شما برای سفرهای بعدی:',
          type: 'textarea',
          required: false,
          options: []
        }
      ]
    },
    'rafting-markadeh': {
      id: 'survey_rafting-markadeh',
      eventId: 'rafting-markadeh',
      title: 'نظرسنجی کیفیت برگزاری تور رفتینگ مارکده',
      description: 'همکار گرامی، با سپاس از حضور پرشور شما در تور رفتینگ مارکده، لطفاً با تکمیل این فرم ما را در ارزیابی و بهبود خدمات یاری نمایید.',
      questions: [
        {
          id: 'q1_rafting_satisfaction',
          text: 'میزان رضایت کلی شما از تجربه و هیجان تور رفتینگ مارکده:',
          type: 'radio',
          required: true,
          options: ['بسیار عالی و هیجان‌انگیز', 'خوب و لذت‌بخش', 'متوسط', 'ضعیف']
        },
        {
          id: 'q2_rafting_team',
          text: 'نحوه هماهنگی، زمان‌بندی و برخورد تیم اجرایی و مربیان قایقرانی:',
          type: 'radio',
          required: true,
          options: ['عالی و حرفه‌ای', 'خوب و مناسب', 'متوسط', 'ضعیف']
        },
        {
          id: 'q3_rafting_safety',
          text: 'رعایت استانداردهای ایمنی، جلیقه‌ها و تجهیزات رودخانه:',
          type: 'radio',
          required: true,
          options: ['بسیار مطمئن و عالی', 'خوب و استاندارد', 'متوسط', 'نیازمند ارتقا']
        },
        {
          id: 'q4_rafting_catering',
          text: 'کیفیت ناهار، پذیرایی و خدمات ترابری رفت و برگشت:',
          type: 'radio',
          required: true,
          options: ['عالی', 'مناسب', 'قابل قبول', 'ضعیف']
        },
        {
          id: 'q5_rafting_feedback',
          text: 'نظرات، پیشنهادات و انتقادات شما برای تورهای طبیعت‌گردی و ورزشی آتی:',
          type: 'textarea',
          required: false,
          options: []
        }
      ]
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // بررسی وضعیت ثبت قبلی نظر توسط کاربر
  function getUserExistingVote(surveyId, personnelCode) {
    if (!personnelCode) return null;
    const key = `entekhab_survey_voted_${surveyId}_${personnelCode}`;
    const votedFlag = localStorage.getItem(key);

    if (typeof StorageService !== 'undefined') {
      const localList = StorageService.getLocalSurveyResponses(surveyId);
      const found = localList.find(r => r.personnelCode === personnelCode);
      if (found) return found;
    }
    return votedFlag ? { personnelCode: personnelCode } : null;
  }

  // تشخیص فعال بودن حالت نظرسنجی (بر اساس URL یا تنظیمات دیتابیس ادمین)
  function isSurveyModeActive(eventId, eventSetting) {
    const url = (window.location.href || '').toLowerCase();
    const params = new URLSearchParams(window.location.search);
    if (params.get('survey') === '1' || params.get('mode') === 'survey' || url.includes('survey=1') || window.location.hash.includes('survey')) {
      return true;
    }
    if (eventSetting && (eventSetting.activeMode === 'survey' || eventSetting.isSurveyActive === true)) {
      return true;
    }
    try {
      const raw = localStorage.getItem('entekhab_event_deadlines');
      if (raw && eventId) {
        const all = JSON.parse(raw);
        if (all && all[eventId] && (all[eventId].activeMode === 'survey' || all[eventId].isSurveyActive === true)) {
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  // اعمال تغییرات پوسته در صورت فعال بودن نظرسنجی
  function applySurveyModeLayout(eventId) {
    document.body.classList.add('survey-active-mode');

    // مخفی‌سازی کامل بخش فرم ثبت‌نام و پیام‌های انقضا
    const regSection = document.getElementById('registrationSection');
    if (regSection) {
      regSection.style.display = 'none';
    }

    const deadlineExpired = document.getElementById('statusDeadlineExpired');
    if (deadlineExpired) deadlineExpired.style.display = 'none';

    const capacityFull = document.getElementById('statusCapacityFull');
    if (capacityFull) capacityFull.style.display = 'none';

    const loading = document.getElementById('statusLoading');
    if (loading) loading.style.display = 'none';

    // اضافه کردن نشانگر حالت نظرسنجی در بالای محتوای کارت رویداد
    const eventContent = document.querySelector('.event-content');
    if (eventContent && !document.getElementById('surveyNoticePill')) {
      const pill = document.createElement('div');
      pill.id = 'surveyNoticePill';
      pill.className = 'survey-active-notice-pill';
      pill.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        <span>بخش ارزیابی و نظرسنجی کیفیت برگزاری رویداد</span>
      `;
      eventContent.insertBefore(pill, eventContent.firstChild);
    }
  }

  // راه‌اندازی و تزریق نظرسنجی به صفحه رویداد
  async function initEventSurvey(eventId, user) {
    if (!eventId || !user) return;

    // بارگذاری تنظیمات رویداد
    let eventSetting = null;
    if (typeof StorageService !== 'undefined' && StorageService.getEventSettings) {
      try {
        eventSetting = await StorageService.getEventSettings(eventId);
      } catch (e) {}
    }

    const inSurveyMode = isSurveyModeActive(eventId, eventSetting);

    if (inSurveyMode) {
      applySurveyModeLayout(eventId);
    }

    // ۱. پیدا کردن یا ساخت کانتینر در صفحه
    let container = document.getElementById('eventSurveyContainer');
    if (!container) {
      container = document.createElement('section');
      container.id = 'eventSurveyContainer';
      const mainCard = document.querySelector('.event-card');
      if (mainCard && mainCard.parentNode) {
        mainCard.parentNode.insertBefore(container, mainCard.nextSibling);
      } else {
        const mainWrap = document.getElementById('mainContainer');
        if (mainWrap) mainWrap.appendChild(container);
      }
    }

    if (!container) return;

    // ۲. بارگذاری پیکربندی نظرسنجی (پیش‌فرض یا تغییرات ادمین)
    let surveyConfig = EVENT_SURVEY_DEFAULTS[eventId] || {
      id: 'survey_' + eventId,
      eventId: eventId,
      title: 'نظرسنجی کیفیت برگزاری رویداد',
      description: 'همکار گرامی، خواهشمند است با اعلام نظرات خود، ما را در ارتقای کیفیت برنامه‌ها یاری فرمایید.',
      questions: []
    };

    if (typeof StorageService !== 'undefined' && StorageService.getSurveyById) {
      try {
        const cloudSurvey = await StorageService.getSurveyById(eventId);
        if (cloudSurvey && cloudSurvey.questions && cloudSurvey.questions.length > 0) {
          surveyConfig = Object.assign({}, surveyConfig, cloudSurvey);
        }
      } catch (err) {
        console.warn('استفاده از سوالات پیش‌فرض نظرسنجی رویداد:', err);
      }
    }

    // ۳. بررسی شرکت قبلی کاربر
    const existingVote = getUserExistingVote(surveyConfig.id, user.personnelCode);

    // ۴. اضافه کردن دکمه پرش به نظرسنجی در نوار بالای کاربر در حالت عادی
    if (!inSurveyMode) {
      injectTopSurveyLink(existingVote !== null);
    }

    // ۵. رندر محتوای کارت نظرسنجی
    if (existingVote) {
      renderCompletedView(container, surveyConfig, user, existingVote);
    } else {
      renderSurveyForm(container, surveyConfig, user);
    }

    // ۶. بررسی اسکرول خودکار به نظرسنجی اگر در URL درخواست شده باشد
    if (!inSurveyMode) {
      checkAutoScrollToSurvey();
    }
  }

  // تزریق لینک سریع در هدر کاربر
  function injectTopSurveyLink(hasVoted) {
    const userBar = document.querySelector('.user-header-bar');
    if (!userBar || document.getElementById('btnTopSurveyJump')) return;

    const link = document.createElement('a');
    link.id = 'btnTopSurveyJump';
    link.href = '#eventSurveyContainer';
    link.className = 'btn-top-survey-jump';
    link.innerHTML = hasVoted
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>نظرسنجی ثبت شده</span>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> <span>نظرسنجی کیفیت رویداد</span>`;

    if (hasVoted) {
      link.classList.add('voted');
    }

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('eventSurveyContainer');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    const logoutBtn = document.getElementById('btnLogoutUser');
    if (logoutBtn && logoutBtn.parentNode === userBar) {
      userBar.insertBefore(link, logoutBtn);
    } else {
      userBar.appendChild(link);
    }
  }

  // رندر فرم سوالات نظرسنجی با تم مدرن و نوار پیشرفت زنده
  function renderSurveyForm(container, survey, user) {
    const questions = survey.questions || [];
    const eventId = survey.eventId || '';
    const themeClass = (eventId === 'kavir-varzaneh') ? 'theme-kavir' : ((eventId === 'rafting-markadeh') ? 'theme-rafting' : 'theme-sobh');

    let questionsHtml = '';
    questions.forEach((q, idx) => {
      const qNum = (idx + 1).toLocaleString('fa-IR');
      const reqBadge = q.required ? '<span class="survey-req-star" title="پاسخ به این سوال الزامی است">* الزامی</span>' : '<span class="survey-opt-badge">اختیاری</span>';

      let optionsHtml = '';
      if (q.type === 'radio' && Array.isArray(q.options)) {
        optionsHtml = `
          <div class="survey-options-grid">
            ${q.options.map((opt, optIdx) => `
              <label class="survey-option-label" for="opt_${q.id}_${optIdx}">
                <input type="radio" name="${q.id}" id="opt_${q.id}_${optIdx}" value="${escapeHtml(opt)}" ${q.required ? 'required' : ''} data-qid="${q.id}">
                <span class="survey-option-custom"></span>
                <span class="survey-option-text">${escapeHtml(opt)}</span>
              </label>
            `).join('')}
          </div>
        `;
      } else {
        optionsHtml = `
          <div class="survey-textarea-wrap">
            <textarea class="survey-textarea" name="${q.id}" id="input_${q.id}" data-qid="${q.id}" rows="3" placeholder="دیدگاه‌ها، پیشنهادات یا انتقادات سازنده خود را در این بخش بنویسید..."></textarea>
          </div>
        `;
      }

      questionsHtml += `
        <div class="survey-question-card" id="card_${q.id}">
          <div class="survey-question-header">
            <div class="survey-q-badge">سوال ${qNum}</div>
            <div class="survey-q-text">${escapeHtml(q.text)}</div>
            ${reqBadge}
          </div>
          <div class="survey-question-body">
            ${optionsHtml}
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="event-survey-card" id="eventSurveySection">
        <div class="event-survey-banner ${themeClass}">
          <div class="survey-banner-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div>
            <span class="survey-mini-badge">نظرسنجی کیفیت برگزاری رویداد</span>
            <h2 class="survey-main-title">${escapeHtml(survey.title)}</h2>
            <p class="survey-main-desc">${escapeHtml(survey.description)}</p>
          </div>
        </div>

        <div class="survey-inner-body">
          <!-- نوار پیشرفت پاسخ به سوالات -->
          <div class="survey-progress-card">
            <div class="survey-progress-header">
              <span>میزان تکمیل فرم نظرسنجی:</span>
              <span id="surveyProgressLabel">۰ از ${questions.length.toLocaleString('fa-IR')} سوال (۰٪)</span>
            </div>
            <div class="survey-progress-track">
              <div class="survey-progress-fill" id="surveyProgressFill" style="width: 0%;"></div>
            </div>
          </div>

          <div class="survey-user-strip">
            <div class="survey-user-details">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>همکار گرامی: <strong>${escapeHtml(user.fullName)}</strong> (شماره پرسنلی: <strong>${escapeHtml(user.personnelCode)}</strong>)</span>
            </div>
          </div>

          <form id="eventSurveyForm" novalidate>
            <div class="survey-questions-list">
              ${questionsHtml}
            </div>

            <!-- پیام اعتبارسنجی خطا -->
            <div id="surveyValidationMsg" class="survey-validation-alert" style="display: none;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>لطفاً به تمامی سوالات الزامی مشخص شده پاسخ دهید.</span>
            </div>

            <!-- بخش انتخاب نحوه ارسال و دکمه‌ها -->
            <div class="survey-submission-section">
              <div class="survey-privacy-box">
                <div class="privacy-box-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div class="privacy-box-text">
                  <strong>حق انتخاب در نحوه ثبت نظر:</strong>
                  <p>پاسخ‌های شما با هدف سنجش کیفیت و ارتقای خدمات رویدادها گردآوری می‌شود. شما می‌توانید نظر ارزشمند خود را <strong>با مشخصات هویتی خود</strong> یا <strong>به‌صورت کاملاً ناشناس</strong> ارسال فرمایید.</p>
                </div>
              </div>

              <div class="survey-buttons-grid">
                <!-- دکمه ۱: ارسال با نام -->
                <button type="button" class="btn-survey-action btn-submit-named" id="btnSurveyNamed">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <div class="btn-text-wrap">
                    <span class="btn-title">ثبت نظر به نام من</span>
                    <span class="btn-sub">(${escapeHtml(user.fullName)})</span>
                  </div>
                </button>

                <!-- دکمه ۲: ارسال به‌صورت ناشناس -->
                <button type="button" class="btn-survey-action btn-submit-anonymous" id="btnSurveyAnonymous">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <div class="btn-text-wrap">
                    <span class="btn-title">ارسال به‌صورت کاملاً ناشناس</span>
                    <span class="btn-sub">(عدم درج نام در گزارش‌ها)</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;

    // محاسبه زنده پیشرفت پاسخ‌ها
    function updateProgress() {
      let answeredCount = 0;
      questions.forEach(q => {
        if (q.type === 'radio') {
          if (document.querySelector(`input[name="${q.id}"]:checked`)) {
            answeredCount++;
          }
        } else {
          const txt = document.getElementById(`input_${q.id}`);
          if (txt && txt.value.trim().length > 0) {
            answeredCount++;
          }
        }
      });

      const total = questions.length || 1;
      const pct = Math.round((answeredCount / total) * 100);
      const fillEl = document.getElementById('surveyProgressFill');
      const labelEl = document.getElementById('surveyProgressLabel');

      if (fillEl) fillEl.style.width = pct + '%';
      if (labelEl) labelEl.textContent = `${answeredCount.toLocaleString('fa-IR')} از ${total.toLocaleString('fa-IR')} سوال (${pct.toLocaleString('fa-IR')}٪)`;
    }

    const formEl = document.getElementById('eventSurveyForm');
    if (formEl) {
      formEl.addEventListener('change', updateProgress);
      formEl.addEventListener('input', updateProgress);
    }

    // تنظیم رویدادهای دکمه‌ها
    const btnNamed = document.getElementById('btnSurveyNamed');
    const btnAnon = document.getElementById('btnSurveyAnonymous');

    if (btnNamed) {
      btnNamed.addEventListener('click', () => handleSurveySubmission(container, survey, user, false));
    }
    if (btnAnon) {
      btnAnon.addEventListener('click', () => handleSurveySubmission(container, survey, user, true));
    }
  }

  // اعتبارسنجی و ثبت پاسخ
  async function handleSurveySubmission(container, survey, user, isAnonymous) {
    const questions = survey.questions || [];
    const answers = {};
    let hasError = false;
    let firstErrorElement = null;

    const valMsg = document.getElementById('surveyValidationMsg');
    if (valMsg) valMsg.style.display = 'none';

    // پاکسازی خطاهای قبلی
    document.querySelectorAll('.survey-question-card').forEach(c => c.classList.remove('has-error'));

    for (const q of questions) {
      if (q.type === 'radio') {
        const selected = document.querySelector(`input[name="${q.id}"]:checked`);
        if (selected) {
          answers[q.id] = selected.value;
        } else if (q.required) {
          hasError = true;
          const card = document.getElementById(`card_${q.id}`);
          if (card) {
            card.classList.add('has-error');
            if (!firstErrorElement) firstErrorElement = card;
          }
        }
      } else {
        const textEl = document.getElementById(`input_${q.id}`);
        const val = textEl ? textEl.value.trim() : '';
        if (val) {
          answers[q.id] = val;
        } else if (q.required) {
          hasError = true;
          const card = document.getElementById(`card_${q.id}`);
          if (card) {
            card.classList.add('has-error');
            if (!firstErrorElement) firstErrorElement = card;
          }
        }
      }
    }

    if (hasError) {
      if (valMsg) valMsg.style.display = 'flex';
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // قفل دکمه‌ها و نمایش حالت ارسال
    const btnNamed = document.getElementById('btnSurveyNamed');
    const btnAnon = document.getElementById('btnSurveyAnonymous');
    if (btnNamed) btnNamed.disabled = true;
    if (btnAnon) btnAnon.disabled = true;

    const activeBtn = isAnonymous ? btnAnon : btnNamed;
    const oldText = activeBtn ? activeBtn.innerHTML : '';
    if (activeBtn) {
      activeBtn.innerHTML = `
        <span class="survey-spinner"></span>
        <span class="btn-title">در حال ثبت پاسخ در سامانه...</span>
      `;
    }

    try {
      const responsePayload = {
        surveyTitle: survey.title,
        personnelCode: user.personnelCode,
        fullName: user.fullName,
        isAnonymous: isAnonymous,
        answers: answers
      };

      if (typeof StorageService !== 'undefined' && StorageService.submitSurveyResponse) {
        await StorageService.submitSurveyResponse(survey.id, responsePayload);
      } else {
        // حالت لوکال
        localStorage.setItem(`entekhab_survey_voted_${survey.id}_${user.personnelCode}`, '1');
      }

      // به‌روزرسانی لینک هدر
      const topLink = document.getElementById('btnTopSurveyJump');
      if (topLink) {
        topLink.classList.add('voted');
        topLink.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>نظرسنجی ثبت شده</span>`;
      }

      // رندر نمای تشکر
      renderCompletedView(container, survey, user, {
        personnelCode: user.personnelCode,
        fullName: user.fullName,
        isAnonymous: isAnonymous,
        jalaliDate: (typeof StorageService !== 'undefined' && StorageService.toJalaliString) ? StorageService.toJalaliString(new Date()) : ''
      });

      // اسکرول نرم به بالای باکس نظرسنجی
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
      console.error('خطا در ثبت نظرسنجی:', err);
      alert('خطا در برقراری ارتباط با سرور: ' + (err.message || 'لطفاً دوباره تلاش فرمایید.'));
      if (btnNamed) btnNamed.disabled = false;
      if (btnAnon) btnAnon.disabled = false;
      if (activeBtn) activeBtn.innerHTML = oldText;
    }
  }

  // نمایش پیام تشکر و وضعیت ثبت نظرسنجی
  function renderCompletedView(container, survey, user, record) {
    const isAnon = Boolean(record && record.isAnonymous);

    const privacyBadge = isAnon
      ? `<span class="completed-mode-badge mode-anon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> نظر شما به‌صورت ناشناس ثبت گردید</span>`
      : `<span class="completed-mode-badge mode-named"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> نظر با مشخصات همکار ثبت گردید</span>`;

    const subText = isAnon
      ? 'پاسخ شما با موفقیت و در کمال محرمانگی ثبت شد و مشخصات هویتی شما در گزارش‌های بازخورد درج نخواهد شد.'
      : `همکار ارجمند ${escapeHtml(user.fullName)}، پاسخ شما به همراه مشخصات پرسنلی با موفقیت در سامانه رویدادها دریافت شد.`;

    container.innerHTML = `
      <div class="event-survey-card survey-completed-card" id="eventSurveySection">
        <div class="survey-completed-body">
          <div class="survey-check-icon">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 class="completed-title">پاسخ شما با موفقیت در سامانه ثبت شد</h3>
          <p class="completed-desc">${subText}</p>
          
          <div class="completed-meta-box">
            ${privacyBadge}
            <div class="completed-meta-item">
              <span>رویداد:</span>
              <strong>${escapeHtml(survey.title)}</strong>
            </div>
            ${record.jalaliDate ? `
              <div class="completed-meta-item">
                <span>زمان ثبت:</span>
                <strong>${escapeHtml(record.jalaliDate)}</strong>
              </div>
            ` : ''}
          </div>

          <div style="margin-top: 18px; color: #166534; font-size: 0.86rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>✓ پاسخ شما نهایی گردیده و در ارزیابی و بهبود خدمات رویدادها اعمال خواهد شد.</span>
          </div>
        </div>
      </div>
    `;
  }

  // پرش خودکار به نظرسنجی در صورت ارسال لینک با پارامتر survey
  function checkAutoScrollToSurvey() {
    const url = (window.location.href || '').toLowerCase();
    if (url.includes('survey') || window.location.hash.includes('survey')) {
      setTimeout(() => {
        const el = document.getElementById('eventSurveyContainer');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400);
    }
  }

  // سازگار کردن صفحه لاگین با حالت نظرسنجی در بدو ورود
  function adaptLoginScreenForSurvey() {
    const url = (window.location.href || '').toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const isSurvey = params.get('survey') === '1' || params.get('mode') === 'survey' || url.includes('survey=1') || window.location.hash.includes('survey');
    if (!isSurvey) return;

    document.body.classList.add('survey-active-mode');

    const badge = document.querySelector('.login-header .org-badge, .brand-header .org-badge');
    if (badge) {
      badge.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> سامانه نظرسنجی رویدادهای انتخاب`;
    }
    const title = document.querySelector('.login-card h2');
    if (title) {
      title.textContent = 'ورود به بخش نظرسنجی رویداد';
    }
    const desc = document.querySelector('.login-card p');
    if (desc) {
      desc.textContent = 'جهت شرکت در نظرسنجی و ارزیابی کیفیت برگزاری رویداد، لطفاً با مشخصات سازمانی خود وارد شوید:';
    }
    const btn = document.querySelector('#loginForm button[type="submit"]');
    if (btn) {
      btn.innerHTML = 'ورود به فرم نظرسنجی &larr;';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', adaptLoginScreenForSurvey);
  } else {
    adaptLoginScreenForSurvey();
  }

  // اکسپورت به سراسر صفحه
  window.initEventSurvey = initEventSurvey;
  window.isSurveyModeActive = isSurveyModeActive;
  window.applySurveyModeLayout = applySurveyModeLayout;

})(window);
