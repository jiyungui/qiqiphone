/**
 * widgets.js - 小组件渲染与可持久化配置引擎
 * 负责 P1, P2, P3 的交互渲染、弹窗编辑、原图无损转存到 IndexedDB
 * 默认图片全部采用高级浅灰色纯色/极简底图，文字采用随笔语录风格
 */

// 高质感浅灰色占位矢量图 (SVG Base64)，无外部依赖，纯净白灰INS感
const LIGHT_GRAY_PLACEHOLDER = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23E8EAE8'/%3E%3Cpath d='M160 200h80M200 160v80' stroke='%23D0D4D0' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E";

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
    this.bindModalEvents();
  }

  // ------------------------------------------------------------------------
  // P1 小组件渲染与编辑
  // ------------------------------------------------------------------------
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
          <!-- 回形针 SVG 装饰 -->
          <svg class="widget-p1-clip" viewBox="0 0 32 40" fill="none" stroke="#444444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8v20a6 6 0 0 1-12 0V12a8 8 0 0 1 16 0v16a10 10 0 0 1-20 0V16" />
          </svg>
          <img class="widget-p1-img" src="${data.img || LIGHT_GRAY_PLACEHOLDER}" alt="Cover">
          
          <!-- 右侧半透明 Ins 风格功能按钮 -->
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

          <!-- 左下角磨砂玻璃贴纸气泡 -->
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

  // ------------------------------------------------------------------------
  // P2 小组件渲染
  // ------------------------------------------------------------------------
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

  // ------------------------------------------------------------------------
  // P3 小组件渲染
  // ------------------------------------------------------------------------
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

  // ------------------------------------------------------------------------
  // 通用自定义编辑表单与无损图片转换
  // ------------------------------------------------------------------------
  async openEditDialog(widgetId) {
    this.currentEditingId = widgetId;
    let data = await window.storageDB.getWidgetData(widgetId);
    if (!data) {
      if (widgetId === 'p1') data = DEFAULT_P1_DATA;
      if (widgetId === 'p2') data = DEFAULT_P2_DATA;
      if (widgetId === 'p3') data = DEFAULT_P3_DATA;
    }
    this.tempFormData = { ...data };

    let fieldsHtml = '';
    if (widgetId === 'p1') {
      this.modalTitleEl.textContent = '自定义 P1 宽幅卡片组件';
      fieldsHtml = `
        <div class="edit-form-group">
          <label class="edit-form-label">顶部艺术标题</label>
          <input type="text" class="edit-input" id="field-headerTitle" value="${this.tempFormData.headerTitle || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">更换海报大图 (无损存储通道)</label>
          <div class="edit-file-wrapper">
            <label class="edit-file-btn">
              <span>选择图片</span>
              <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'img', 'prev-p1-img')">
            </label>
            <button type="button" class="edit-file-btn" style="background:#555" onclick="widgetManager.resetToGray(event, 'img', 'prev-p1-img')">设为浅灰默认</button>
            <img id="prev-p1-img" class="edit-file-preview" src="${this.tempFormData.img}">
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">贴纸头像</label>
          <div class="edit-file-wrapper">
            <label class="edit-file-btn">
              <span>选择头像</span>
              <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'stickerAvatar', 'prev-p1-avatar')">
            </label>
            <button type="button" class="edit-file-btn" style="background:#555" onclick="widgetManager.resetToGray(event, 'stickerAvatar', 'prev-p1-avatar')">设为浅灰默认</button>
            <img id="prev-p1-avatar" class="edit-file-preview" src="${this.tempFormData.stickerAvatar}">
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">贴纸微言 / 文案语录</label>
          <input type="text" class="edit-input" id="field-stickerQuote" value="${this.tempFormData.stickerQuote || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">名字 / 署名</label>
          <input type="text" class="edit-input" id="field-name" value="${this.tempFormData.name || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">标签组 (用 · 分割)</label>
          <input type="text" class="edit-input" id="field-tags" value="${this.tempFormData.tags || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">随笔文案 / 语录</label>
          <textarea class="edit-textarea" id="field-bio">${this.tempFormData.bio || ''}</textarea>
        </div>
      `;
    } else if (widgetId === 'p2') {
      this.modalTitleEl.textContent = '自定义 P2 胶囊卡片';
      fieldsHtml = `
        <div class="edit-form-group">
          <label class="edit-form-label">顶部胶囊文案</label>
          <input type="text" class="edit-input" id="field-searchWord" value="${this.tempFormData.searchWord || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">更换侧边照片 (无损存储通道)</label>
          <div class="edit-file-wrapper">
            <label class="edit-file-btn">
              <span>选择图片</span>
              <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'img', 'prev-p2-img')">
            </label>
            <button type="button" class="edit-file-btn" style="background:#555" onclick="widgetManager.resetToGray(event, 'img', 'prev-p2-img')">设为浅灰默认</button>
            <img id="prev-p2-img" class="edit-file-preview" src="${this.tempFormData.img}">
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">衬线字符语录</label>
          <input type="text" class="edit-input" id="field-line2" value="${this.tempFormData.line2 || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">状态 / 音律文案</label>
          <input type="text" class="edit-input" id="field-line3" value="${this.tempFormData.line3 || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">随笔注记</label>
          <input type="text" class="edit-input" id="field-line4" value="${this.tempFormData.line4 || ''}">
        </div>
      `;
    } else if (widgetId === 'p3') {
      this.modalTitleEl.textContent = '自定义 P3 日历随笔卡片';
      fieldsHtml = `
        <div class="edit-form-group">
          <label class="edit-form-label">顶部背景美图 (无损存储通道)</label>
          <div class="edit-file-wrapper">
            <label class="edit-file-btn">
              <span>选择图片</span>
              <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'img', 'prev-p3-img')">
            </label>
            <button type="button" class="edit-file-btn" style="background:#555" onclick="widgetManager.resetToGray(event, 'img', 'prev-p3-img')">设为浅灰默认</button>
            <img id="prev-p3-img" class="edit-file-preview" src="${this.tempFormData.img}">
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">月份衬线标题</label>
          <input type="text" class="edit-input" id="field-monthTitle" value="${this.tempFormData.monthTitle || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">主标语录</label>
          <input type="text" class="edit-input" id="field-quoteTitle" value="${this.tempFormData.quoteTitle || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">底部便签小头像</label>
          <div class="edit-file-wrapper">
            <label class="edit-file-btn">
              <span>选择头像</span>
              <input type="file" accept="image/*" style="display:none" onchange="widgetManager.handleFileSelect(event, 'pillAvatar', 'prev-p3-avatar')">
            </label>
            <button type="button" class="edit-file-btn" style="background:#555" onclick="widgetManager.resetToGray(event, 'pillAvatar', 'prev-p3-avatar')">设为浅灰默认</button>
            <img id="prev-p3-avatar" class="edit-file-preview" src="${this.tempFormData.pillAvatar}">
          </div>
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">便签日期</label>
          <input type="text" class="edit-input" id="field-pillDate" value="${this.tempFormData.pillDate || ''}">
        </div>
        <div class="edit-form-group">
          <label class="edit-form-label">便签心情随笔语录</label>
          <input type="text" class="edit-input" id="field-pillText" value="${this.tempFormData.pillText || ''}">
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
    this.showToast('已设为浅灰默认图');
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
      this.showToast('原图载入成功');
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

    this.closeModal();
    this.showToast('保存成功，已持久化');
  }

  closeModal() {
    this.modalEl.classList.remove('open');
    this.currentEditingId = null;
  }

  bindModalEvents() {
    document.getElementById('modal-close-btn').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-save-btn').addEventListener('click', () => this.saveCurrentEdit());
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
