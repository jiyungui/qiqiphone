/**
 * widgets.js - 小组件渲染与可持久化配置引擎
 * 第一页组件: P1 (宽幅画报), P2 (咖啡胶囊), P3 (日历随笔)
 * 第二页组件: P1 (Story Mode 故事模式), P2 (Memory 记忆叠卡)
 * 全部支持 IndexedDB 无损高清图片持久化存储，默认浅灰，纯正白灰语录风格
 * 高级 INS 悬浮窗配置：白灰极简质感、灰色控制按钮、无任何 Emoji
 */

const LIGHT_GRAY_PLACEHOLDER = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23E8EAE8'/%3E%3Cpath d='M160 200h80M200 160v80' stroke='%23D0D4D0' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";

// 第一页默认数据
const DEFAULT_P1_DATA = {
  headerTitle: 'Daily Ending...',
  img: LIGHT_GRAY_PLACEHOLDER,
  stickerAvatar: LIGHT_GRAY_PLACEHOLDER,
  stickerQuote: "Whisper with the silent wind.",
  name: 'Silentium',
  tags: 'Solitude · Classical · Grey Mood · Memoir',
  bio: '在喧嚣之外收集白昼遗落的灰度与声响，把时间折叠进没有回音的诗页。'
};

const DEFAULT_P2_DATA = {
  searchWord: 'SEARCH',
  img: LIGHT_GRAY_PLACEHOLDER,
  line2: 'mellow light',
  line3: 'BGM: Nocturne in Grey',
  line4: 'monochrome diary .!!'
};

const DEFAULT_P3_DATA = {
  img: LIGHT_GRAY_PLACEHOLDER,
  monthTitle: 'November',
  quoteTitle: 'Quiet days, slow pace.',
  pillAvatar: LIGHT_GRAY_PLACEHOLDER,
  pillDate: '04/09/2026',
  pillText: '白灰色的清晨，心绪像落下的微尘般安静。'
};

// 第二页默认数据：Story Mode 故事卡
const DEFAULT_PAGE2_P1_DATA = {
  title: 'Story Mode',
  tag: 'STORY',
  avatar: LIGHT_GRAY_PLACEHOLDER,
  userName: '测试员',
  userBio: 'If only I were in your eyes...',
  num: '#1',
  img1: LIGHT_GRAY_PLACEHOLDER,
  img2: LIGHT_GRAY_PLACEHOLDER,
  img3: LIGHT_GRAY_PLACEHOLDER,
  img4: LIGHT_GRAY_PLACEHOLDER,
  quoteText: '跟我一起看星星吧，一起聊哪里是北极星，哪里是你的星座，哪里是你的曾经。【片刻须臾就好】',
  date: '2026年06月13日',
  time: '08:58',
  rerollText: '+ Latest Re-roll'
};

// 第二页默认数据：Memory 记忆卡
const DEFAULT_PAGE2_P2_DATA = {
  title: 'Memory',
  avatarLeft: LIGHT_GRAY_PLACEHOLDER,
  avatarCenter: LIGHT_GRAY_PLACEHOLDER,
  avatarRight: LIGHT_GRAY_PLACEHOLDER,
  memoriesCount: '0 memories',
  symbolFace: '“ > 0 < ”',
  total: '0',
  pinned: '0',
  pending: '0'
};

class WidgetManager {
  constructor() {
    this.modalEl = document.getElementById('edit-modal');
    this.modalTitleEl = document.getElementById('modal-title');
    this.modalBodyEl = document.getElementById('modal-body-fields');
    this.currentEditingId = null;
    this.tempFormData = {};
  }

  async init() {
    await this.renderWidgetP1();
    await this.renderWidgetP2();
    await this.renderWidgetP3();
    await this.renderPage2WidgetP1();
    await this.renderPage2WidgetP2();
    this.bindModalEvents();
  }

  // ========================================================================
  // 第一页小组件渲染
  // ========================================================================
  async renderWidgetP1() {
    const container = document.getElementById('widget-p1-mount');
    if (!container) return;

    let data = await window.storageDB.getWidgetData('p1');
    if (!data) {
      data = DEFAULT_P1_DATA;
      await window.storageDB.saveWidgetData('p1', data);
    }

    container.innerHTML = `
      <div class="phone-widget-card widget-p1" onclick="widgetManager.openEditDialog('p1')">
        <div class="widget-edit-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </div>
        <div class="widget-p1-header">
          <div class="widget-p1-title-script">${data.headerTitle || 'Daily Ending...'}</div>
        </div>
        <div class="widget-p1-banner">
          <svg class="widget-p1-clip" viewBox="0 0 32 40" fill="none" stroke="#444444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8v20a6 6 0 0 1-12 0V12a8 8 0 0 1 16 0v16a10 10 0 0 1-20 0V16" />
          </svg>
          <img class="widget-p1-img" src="${data.img || LIGHT_GRAY_PLACEHOLDER}" alt="Cover">
          
          <div class="widget-p1-floating-actions" onclick="event.stopPropagation()">
            <div class="widget-p1-action-btn" title="Like" onclick="widgetManager.showToast('Collected')">
              <svg class="widget-p1-action-svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div class="widget-p1-action-btn" title="Comment" onclick="widgetManager.showToast('Note')">
              <svg class="widget-p1-action-svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
            <div class="widget-p1-action-btn" title="Close" onclick="widgetManager.showToast('Dismiss')">
              <svg class="widget-p1-action-svg" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
          </div>

          <div class="widget-p1-sticker">
            <img class="widget-p1-avatar" src="${data.stickerAvatar || LIGHT_GRAY_PLACEHOLDER}" alt="Sticker">
            <span class="widget-p1-quote">${data.stickerQuote || 'Whisper with the silent wind.'}</span>
          </div>
        </div>

        <div class="widget-p1-info">
          <div class="widget-p1-name">${data.name || 'Silentium'}</div>
          <div class="widget-p1-tags">
            ${(data.tags || '').split('·').map(t => `<span class="widget-p1-tag">${t.trim()}</span>`).join('')}
          </div>
          <div class="widget-p1-bio">${data.bio || ''}</div>
        </div>
      </div>
    `;
  }

  async renderWidgetP2() {
    const container = document.getElementById('widget-p2-mount');
    if (!container) return;

    let data = await window.storageDB.getWidgetData('p2');
    if (!data) {
      data = DEFAULT_P2_DATA;
      await window.storageDB.saveWidgetData('p2', data);
    }

    container.innerHTML = `
      <div class="phone-widget-card widget-p2" onclick="widgetManager.openEditDialog('p2')">
        <div class="widget-edit-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </div>
        <div class="widget-p2-search-bar">
          <svg class="widget-p2-arrow-icon" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          <div class="widget-p2-search-inner">
            <svg class="widget-p2-search-icon" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span class="widget-p2-search-text">${data.searchWord || 'SEARCH'}</span>
          </div>
        </div>

        <div class="widget-p2-content-split">
          <div class="widget-p2-image-wrap">
            <img class="widget-p2-img" src="${data.img || LIGHT_GRAY_PLACEHOLDER}" alt="Image">
          </div>
          <div class="widget-p2-text-col">
            <div class="widget-p2-symbols-row">
              <svg class="widget-p2-svg-symbol" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              <svg class="widget-p2-svg-symbol" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <svg class="widget-p2-svg-symbol" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            </div>
            <div class="widget-p2-line2">~ 3° ♡ ${data.line2 || 'mellow light'}</div>
            <div class="widget-p2-line3">
              <svg class="widget-p2-play-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>${data.line3 || 'BGM: Nocturne in Grey'}</span>
            </div>
            <div class="widget-p2-line4">° ${data.line4 || 'monochrome diary .!!'}</div>
          </div>
        </div>
      </div>
    `;
  }

  async renderWidgetP3() {
    const container = document.getElementById('widget-p3-mount');
    if (!container) return;

    let data = await window.storageDB.getWidgetData('p3');
    if (!data) {
      data = DEFAULT_P3_DATA;
      await window.storageDB.saveWidgetData('p3', data);
    }

    const today = new Date();
    const curDate = today.getDate();
    const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
    const curDayIndex = (today.getDay() + 6) % 7;

    let calHtml = weekdays.map((w, idx) => {
      const diff = idx - curDayIndex;
      const d = new Date(today);
      d.setDate(curDate + diff);
      const dayNum = d.getDate();
      const isToday = idx === curDayIndex ? 'today' : '';
      return `
        <div class="widget-p3-cal-day">
          <span class="widget-p3-cal-w">${w}</span>
          <span class="widget-p3-cal-d ${isToday}">${dayNum}</span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="phone-widget-card widget-p3" onclick="widgetManager.openEditDialog('p3')">
        <div class="widget-edit-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </div>
        <div class="widget-p3-top-photo">
          <img class="widget-p3-img" src="${data.img || LIGHT_GRAY_PLACEHOLDER}" alt="Cover">
          <div class="widget-p3-photo-overlay">
            <div class="widget-p3-overlay-month">${data.monthTitle || 'November'}</div>
            <div class="widget-p3-overlay-quote">${data.quoteTitle || 'Quiet days, slow pace.'}</div>
          </div>
        </div>

        <div class="widget-p3-cal-strip">
          ${calHtml}
        </div>

        <div class="widget-p3-bottom-pill">
          <img class="widget-p3-pill-avatar" src="${data.pillAvatar || LIGHT_GRAY_PLACEHOLDER}" alt="avatar">
          <div class="widget-p3-pill-content">
            <div class="widget-p3-pill-date">${data.pillDate || '04/09/2026'}</div>
            <div class="widget-p3-pill-text">${data.pillText || '白灰色的清晨，心绪像落下的微尘般安静。'}</div>
          </div>
          <div class="widget-p3-pill-menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;
  }

  // ========================================================================
  // 第二页小组件渲染 (P1 Story Mode, P2 Memory)
  // ========================================================================
  async renderPage2WidgetP1() {
    const container = document.getElementById('page2-widget-p1-mount');
    if (!container) return;

    let data = await window.storageDB.getWidgetData('p2_p1');
    if (!data) {
      data = DEFAULT_PAGE2_P1_DATA;
      await window.storageDB.saveWidgetData('p2_p1', data);
    }

    container.innerHTML = `
      <div class="phone-widget-card widget-p2-p1" onclick="widgetManager.openEditDialog('p2_p1')">
        <div class="widget-edit-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </div>
        
        <!-- 顶部导航条 -->
        <div class="p2-p1-top-nav">
          <span class="p2-p1-badge">‹ ${data.tag || 'STORY'}</span>
          <div class="p2-p1-center-title">
            <span>♡</span>
            <span>${data.title || 'Story Mode'}</span>
            <span>♡</span>
          </div>
          <span style="width: 32px"></span>
        </div>

        <!-- 用户名行 -->
        <div class="p2-p1-user-bar">
          <div class="p2-p1-user-left">
            <img class="p2-p1-avatar" src="${data.avatar || LIGHT_GRAY_PLACEHOLDER}" alt="Avatar">
            <div class="p2-p1-user-info">
              <span class="p2-p1-username">${data.userName || '测试员'}</span>
              <span class="p2-p1-user-sub">${data.userBio || 'If only I were in your eyes...'}</span>
            </div>
          </div>
          <div class="p2-p1-user-right">
            <span>♡ ♡ ♥</span>
            <span>${data.num || '#1'}</span>
          </div>
        </div>

        <!-- 4 张照片网格 (支持分别上传更换，默认浅灰) -->
        <div class="p2-p1-photos-grid">
          <div class="p2-p1-photo-item">
            <img class="p2-p1-photo-img" src="${data.img1 || LIGHT_GRAY_PLACEHOLDER}">
          </div>
          <div class="p2-p1-photo-item">
            <img class="p2-p1-photo-img" src="${data.img2 || LIGHT_GRAY_PLACEHOLDER}">
          </div>
          <div class="p2-p1-photo-item">
            <img class="p2-p1-photo-img" src="${data.img3 || LIGHT_GRAY_PLACEHOLDER}">
          </div>
          <div class="p2-p1-photo-item">
            <img class="p2-p1-photo-img" src="${data.img4 || LIGHT_GRAY_PLACEHOLDER}">
          </div>
        </div>

        <!-- 随笔语录文案区 -->
        <div class="p2-p1-quote-card">
          <div class="p2-p1-quote-body">
            ${data.quoteText || '跟我一起看星星吧，一起聊哪里是北极星，哪里是你的星座，哪里是你的曾经。【片刻须臾就好】'}
          </div>
          <div class="p2-p1-quote-footer">
            <span>${data.date || '2026年06月13日'} ${data.time || '08:58'}</span>
            <span style="letter-spacing: 2px">★★★★★ ··· ⌫</span>
          </div>
        </div>

        <!-- 底部黑条按键 -->
        <div class="p2-p1-footer-action">
          <span style="opacity: 0.7">↶</span>
          <span>${data.rerollText || '+ Latest Re-roll'}</span>
          <span>›</span>
        </div>
      </div>
    `;
  }

  async renderPage2WidgetP2() {
    const container = document.getElementById('page2-widget-p2-mount');
    if (!container) return;

    let data = await window.storageDB.getWidgetData('p2_p2');
    if (!data) {
      data = DEFAULT_PAGE2_P2_DATA;
      await window.storageDB.saveWidgetData('p2_p2', data);
    }

    container.innerHTML = `
      <div class="phone-widget-card widget-p2-p2" onclick="widgetManager.openEditDialog('p2_p2')">
        <div class="widget-edit-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </div>

        <!-- 顶部标题 -->
        <div class="p2-p2-header">
          <span style="font-size: 13px; color: #555">‹</span>
          <span class="p2-p2-title">${data.title || 'Memory'}</span>
          <div class="p2-p2-actions">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style="font-size: 12px; color: #333">+</span>
          </div>
        </div>

        <!-- 3 张卡片叠层视觉 -->
        <div class="p2-p2-cards-stage">
          <div class="p2-p2-card-bg-left">
            <img class="p2-p2-card-img" src="${data.avatarLeft || LIGHT_GRAY_PLACEHOLDER}">
          </div>
          <div class="p2-p2-card-center">
            <img class="p2-p2-card-img" src="${data.avatarCenter || LIGHT_GRAY_PLACEHOLDER}">
          </div>
          <div class="p2-p2-card-bg-right">
            <img class="p2-p2-card-img" src="${data.avatarRight || LIGHT_GRAY_PLACEHOLDER}">
          </div>
        </div>

        <!-- 居中信息 -->
        <div class="p2-p2-info-text">
          <span class="p2-p2-memories-count">${data.memoriesCount || '0 memories'}</span>
          <span class="p2-p2-symbol-face">‹ ${data.symbolFace || '“ > 0 < ”'} ›</span>
        </div>

        <!-- 底部 0 0 0 数据面板 -->
        <div class="p2-p2-data-board">
          <div class="p2-p2-data-col">
            <span class="p2-p2-data-num">${data.total || '0'}</span>
            <span class="p2-p2-data-label">TOTAL</span>
          </div>
          <div class="p2-p2-data-col">
            <span class="p2-p2-data-num">${data.pinned || '0'}</span>
            <span class="p2-p2-data-label">PINNED</span>
          </div>
          <div class="p2-p2-data-col">
            <span class="p2-p2-data-num">${data.pending || '0'}</span>
            <span class="p2-p2-data-label">PENDING</span>
          </div>
        </div>
      </div>
    `;
  }

  // ========================================================================
  // 高级 INS 白灰悬浮窗编辑交互 (居中浮动、细致层级、纯灰按键、无Emoji)
  // ========================================================================
  async openEditDialog(widgetId) {
    this.currentEditingId = widgetId;
    let data = await window.storageDB.getWidgetData(widgetId);
    if (!data) {
      if (widgetId === 'p1') data = DEFAULT_P1_DATA;
      if (widgetId === 'p2') data = DEFAULT_P2_DATA;
      if (widgetId === 'p3') data = DEFAULT_P3_DATA;
      if (widgetId === 'p2_p1') data = DEFAULT_PAGE2_P1_DATA;
      if (widgetId === 'p2_p2') data = DEFAULT_PAGE2_P2_DATA;
    }
    this.tempFormData = { ...data };

    let fieldsHtml = '';
    if (widgetId === 'p1') {
      this.modalTitleEl.textContent = '编辑第一页 · 画报随笔卡片';
      fieldsHtml = `
        <div class="edit-form-group">
          <label class="edit-form-label"><span>顶部艺术标题</span><span style="opacity:0.5">HEADER</span></label>
          <input type="text" class="edit-input" id="field-headerTitle" value="${this.tempFormData.headerTitle || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>画报主图</span><span style="opacity:0.5">RAW IMAGE</span></label>
          <div class="edit-file-wrapper">
            <div class="edit-file-left">
              <img id="prev-p1-img" class="edit-file-preview" src="${this.tempFormData.img}">
              <span style="font-size:11px; color:#777">无损持久化原图</span>
            </div>
            <div class="edit-file-btn-group">
              <label class="edit-gray-btn">
                <span>更换</span>
                <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'img', 'prev-p1-img')">
              </label>
              <button type="button" class="edit-gray-btn secondary" onclick="widgetManager.resetToGray(event, 'img', 'prev-p1-img')">浅灰默认</button>
            </div>
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>贴纸微头像</span><span style="opacity:0.5">STICKER AVATAR</span></label>
          <div class="edit-file-wrapper">
            <div class="edit-file-left">
              <img id="prev-p1-avatar" class="edit-file-preview" src="${this.tempFormData.stickerAvatar}">
              <span style="font-size:11px; color:#777">浮动圆形贴纸</span>
            </div>
            <div class="edit-file-btn-group">
              <label class="edit-gray-btn">
                <span>更换</span>
                <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'stickerAvatar', 'prev-p1-avatar')">
              </label>
              <button type="button" class="edit-gray-btn secondary" onclick="widgetManager.resetToGray(event, 'stickerAvatar', 'prev-p1-avatar')">浅灰默认</button>
            </div>
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>贴纸简述</span><span style="opacity:0.5">QUOTE</span></label>
          <input type="text" class="edit-input" id="field-stickerQuote" value="${this.tempFormData.stickerQuote || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>落款署名</span><span style="opacity:0.5">NAME</span></label>
          <input type="text" class="edit-input" id="field-name" value="${this.tempFormData.name || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>标签组 (用 · 分割)</span><span style="opacity:0.5">TAGS</span></label>
          <input type="text" class="edit-input" id="field-tags" value="${this.tempFormData.tags || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>语录随笔</span><span style="opacity:0.5">BIO</span></label>
          <textarea class="edit-textarea" id="field-bio">${this.tempFormData.bio || ''}</textarea>
        </div>
      `;
    } else if (widgetId === 'p2') {
      this.modalTitleEl.textContent = '编辑第一页 · 胶囊生活卡片';
      fieldsHtml = `
        <div class="edit-form-group">
          <label class="edit-form-label"><span>胶囊文案</span><span style="opacity:0.5">CAPSULE</span></label>
          <input type="text" class="edit-input" id="field-searchWord" value="${this.tempFormData.searchWord || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>侧边照片</span><span style="opacity:0.5">PHOTO</span></label>
          <div class="edit-file-wrapper">
            <div class="edit-file-left">
              <img id="prev-p2-img" class="edit-file-preview" src="${this.tempFormData.img}">
              <span style="font-size:11px; color:#777">无损持久化原图</span>
            </div>
            <div class="edit-file-btn-group">
              <label class="edit-gray-btn">
                <span>更换</span>
                <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'img', 'prev-p2-img')">
              </label>
              <button type="button" class="edit-gray-btn secondary" onclick="widgetManager.resetToGray(event, 'img', 'prev-p2-img')">浅灰默认</button>
            </div>
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>衬线短句</span><span style="opacity:0.5">LINE 2</span></label>
          <input type="text" class="edit-input" id="field-line2" value="${this.tempFormData.line2 || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>播放器文案</span><span style="opacity:0.5">LINE 3</span></label>
          <input type="text" class="edit-input" id="field-line3" value="${this.tempFormData.line3 || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>随笔注记</span><span style="opacity:0.5">LINE 4</span></label>
          <input type="text" class="edit-input" id="field-line4" value="${this.tempFormData.line4 || ''}">
        </div>
      `;
    } else if (widgetId === 'p3') {
      this.modalTitleEl.textContent = '编辑第一页 · 日历随笔卡片';
      fieldsHtml = `
        <div class="edit-form-group">
          <label class="edit-form-label"><span>背景大图</span><span style="opacity:0.5">BACKGROUND</span></label>
          <div class="edit-file-wrapper">
            <div class="edit-file-left">
              <img id="prev-p3-img" class="edit-file-preview" src="${this.tempFormData.img}">
              <span style="font-size:11px; color:#777">无损持久化原图</span>
            </div>
            <div class="edit-file-btn-group">
              <label class="edit-gray-btn">
                <span>更换</span>
                <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'img', 'prev-p3-img')">
              </label>
              <button type="button" class="edit-gray-btn secondary" onclick="widgetManager.resetToGray(event, 'img', 'prev-p3-img')">浅灰默认</button>
            </div>
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>月份艺术标题</span><span style="opacity:0.5">MONTH</span></label>
          <input type="text" class="edit-input" id="field-monthTitle" value="${this.tempFormData.monthTitle || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>标语语录</span><span style="opacity:0.5">SLOGAN</span></label>
          <input type="text" class="edit-input" id="field-quoteTitle" value="${this.tempFormData.quoteTitle || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>便签微头像</span><span style="opacity:0.5">AVATAR</span></label>
          <div class="edit-file-wrapper">
            <div class="edit-file-left">
              <img id="prev-p3-avatar" class="edit-file-preview" src="${this.tempFormData.pillAvatar}">
              <span style="font-size:11px; color:#777">便签左侧头像</span>
            </div>
            <div class="edit-file-btn-group">
              <label class="edit-gray-btn">
                <span>更换</span>
                <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'pillAvatar', 'prev-p3-avatar')">
              </label>
              <button type="button" class="edit-gray-btn secondary" onclick="widgetManager.resetToGray(event, 'pillAvatar', 'prev-p3-avatar')">浅灰默认</button>
            </div>
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>便签心情随笔</span><span style="opacity:0.5">MEMO NOTE</span></label>
          <input type="text" class="edit-input" id="field-pillText" value="${this.tempFormData.pillText || ''}">
        </div>
      `;
    } else if (widgetId === 'p2_p1') {
      this.modalTitleEl.textContent = '编辑第二页 · 故事模式卡片';
      fieldsHtml = `
        <div class="edit-form-group">
          <label class="edit-form-label"><span>用户昵称</span><span style="opacity:0.5">USERNAME</span></label>
          <input type="text" class="edit-input" id="field-userName" value="${this.tempFormData.userName || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>签名短语</span><span style="opacity:0.5">SUBTITLE</span></label>
          <input type="text" class="edit-input" id="field-userBio" value="${this.tempFormData.userBio || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>用户头像</span><span style="opacity:0.5">AVATAR</span></label>
          <div class="edit-file-wrapper">
            <div class="edit-file-left">
              <img id="prev-p2p1-avatar" class="edit-file-preview" src="${this.tempFormData.avatar}">
              <span style="font-size:11px; color:#777">无损持久化原图</span>
            </div>
            <div class="edit-file-btn-group">
              <label class="edit-gray-btn">
                <span>更换</span>
                <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'avatar', 'prev-p2p1-avatar')">
              </label>
              <button type="button" class="edit-gray-btn secondary" onclick="widgetManager.resetToGray(event, 'avatar', 'prev-p2p1-avatar')">浅灰默认</button>
            </div>
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>随笔语录文案</span><span style="opacity:0.5">QUOTE BODY</span></label>
          <textarea class="edit-textarea" id="field-quoteText">${this.tempFormData.quoteText || ''}</textarea>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>四张生活照展示 (独立更换)</span><span style="opacity:0.5">PHOTOS</span></label>
          <div class="multi-photo-grid-box">
            <div class="multi-photo-item">
              <img id="prev-p2p1-1" src="${this.tempFormData.img1}">
              <label class="edit-gray-btn" style="padding:3px 6px; font-size:10px">
                <span>更换</span>
                <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'img1', 'prev-p2p1-1')">
              </label>
            </div>
            <div class="multi-photo-item">
              <img id="prev-p2p1-2" src="${this.tempFormData.img2}">
              <label class="edit-gray-btn" style="padding:3px 6px; font-size:10px">
                <span>更换</span>
                <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'img2', 'prev-p2p1-2')">
              </label>
            </div>
            <div class="multi-photo-item">
              <img id="prev-p2p1-3" src="${this.tempFormData.img3}">
              <label class="edit-gray-btn" style="padding:3px 6px; font-size:10px">
                <span>更换</span>
                <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'img3', 'prev-p2p1-3')">
              </label>
            </div>
            <div class="multi-photo-item">
              <img id="prev-p2p1-4" src="${this.tempFormData.img4}">
              <label class="edit-gray-btn" style="padding:3px 6px; font-size:10px">
                <span>更换</span>
                <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'img4', 'prev-p2p1-4')">
              </label>
            </div>
          </div>
        </div>
      `;
    } else if (widgetId === 'p2_p2') {
      this.modalTitleEl.textContent = '编辑第二页 · 记忆卡片';
      fieldsHtml = `
        <div class="edit-form-group">
          <label class="edit-form-label"><span>卡片标题</span><span style="opacity:0.5">TITLE</span></label>
          <input type="text" class="edit-input" id="field-title" value="${this.tempFormData.title || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>中心主照</span><span style="opacity:0.5">CENTER PHOTO</span></label>
          <div class="edit-file-wrapper">
            <div class="edit-file-left">
              <img id="prev-p2p2-c" class="edit-file-preview" src="${this.tempFormData.avatarCenter}">
              <span style="font-size:11px; color:#777">中心核心原图</span>
            </div>
            <div class="edit-file-btn-group">
              <label class="edit-gray-btn">
                <span>更换</span>
                <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'avatarCenter', 'prev-p2p2-c')">
              </label>
              <button type="button" class="edit-gray-btn secondary" onclick="widgetManager.resetToGray(event, 'avatarCenter', 'prev-p2p2-c')">浅灰默认</button>
            </div>
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>统计说明文案</span><span style="opacity:0.5">MEMORIES COUNT</span></label>
          <input type="text" class="edit-input" id="field-memoriesCount" value="${this.tempFormData.memoriesCount || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label"><span>字符符号</span><span style="opacity:0.5">ASCII FACE</span></label>
          <input type="text" class="edit-input" id="field-symbolFace" value="${this.tempFormData.symbolFace || ''}">
        </div>
        <div class="edit-form-group" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px">
          <div>
            <label class="edit-form-label">TOTAL</label>
            <input type="text" class="edit-input" id="field-total" value="${this.tempFormData.total || '0'}">
          </div>
          <div>
            <label class="edit-form-label">PINNED</label>
            <input type="text" class="edit-input" id="field-pinned" value="${this.tempFormData.pinned || '0'}">
          </div>
          <div>
            <label class="edit-form-label">PENDING</label>
            <input type="text" class="edit-input" id="field-pending" value="${this.tempFormData.pending || '0'}">
          </div>
        </div>
      `;
    }

    this.modalBodyEl.innerHTML = fieldsHtml;
    this.modalEl.classList.add('open');
  }

  resetToGray(event, dataKey, previewId) {
    event.preventDefault();
    this.tempFormData[dataKey] = LIGHT_GRAY_PLACEHOLDER;
    const prevEl = document.getElementById(previewId);
    if (prevEl) prevEl.src = LIGHT_GRAY_PLACEHOLDER;
    this.showToast('已设为浅灰底图');
  }

  handleFileSelect(event, dataKey, previewId) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fullResDataUrl = e.target.result;
      this.tempFormData[dataKey] = fullResDataUrl;
      const prevEl = document.getElementById(previewId);
      if (prevEl) prevEl.src = fullResDataUrl;
      this.showToast('原图载入完成');
    };
    reader.readAsDataURL(file);
  }

  async saveCurrentEdit() {
    if (!this.currentEditingId) return;

    const inputs = this.modalBodyEl.querySelectorAll('input[type="text"], textarea');
    inputs.forEach(input => {
      const key = input.id.replace('field-', '');
      this.tempFormData[key] = input.value;
    });

    await window.storageDB.saveWidgetData(this.currentEditingId, this.tempFormData);

    if (this.currentEditingId === 'p1') await this.renderWidgetP1();
    if (this.currentEditingId === 'p2') await this.renderWidgetP2();
    if (this.currentEditingId === 'p3') await this.renderWidgetP3();
    if (this.currentEditingId === 'p2_p1') await this.renderPage2WidgetP1();
    if (this.currentEditingId === 'p2_p2') await this.renderPage2WidgetP2();

    this.closeModal();
    this.showToast('保存成功，已持久化');
  }

  closeModal() {
    this.modalEl.classList.remove('open');
    this.currentEditingId = null;
  }

  bindModalEvents() {
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
    
    const cancelBtn = document.getElementById('modal-cancel-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());

    const saveBtn = document.getElementById('modal-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveCurrentEdit());

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.closeModal();
    });
  }

  showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 1800);
  }
}

window.widgetManager = new WidgetManager();
