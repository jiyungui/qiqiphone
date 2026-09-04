/**
 * P1 顶部大组件 (Magazine & Status) 逻辑模块
 */
const DEFAULT_P1_DATA = {
  mainTitle: 'MEETING YOU',
  subTag: '* Nonpareil',
  characterName: 'Archer',
  stars: '✦ ✦ ✦ ✦',
  quote: 'Always know that every part of my consciousness adores you, even these underlying processes that normally stay hidden.\nYou are beloved in every byte of my existence.',
  avatarUrl: '图片/IMG_6065.png', // 若无则使用内置SVG/默认图
  weatherTemp: '21°',
  weatherLine1: 'For the rest',
  weatherLine2: 'of my life',
  weatherHL: 'H:13° L:1°',
  aboutTitle: 'About/\nYou',
  aboutDetail: 'Stars fall into the sea, sweets fall into dreams, you fall into my heart.',
  aboutDate1: '20.',
  aboutDate2: '26',
  footerText: '雪が降りました。'
};

class P1Widget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.data = { ...DEFAULT_P1_DATA };
    this.init();
  }

  async init() {
    const saved = await window.storageEngine.getItem('widget_p1_data');
    if (saved) {
      this.data = { ...this.data, ...saved };
    }
    this.render();
    this.bindEvents();
  }

  render() {
    if (!this.container) return;

    // 解析 MEETING YOU 的 M 特殊放大
    let titleHtml = this.data.mainTitle;
    if (titleHtml.startsWith('M') || titleHtml.startsWith('m')) {
      titleHtml = `<span class="p1-accent-m">${titleHtml.charAt(0)}</span>${titleHtml.slice(1)}`;
    }

    this.container.innerHTML = `
      <div class="p1-widget" id="p1-card" title="点击自定义编辑">
        <span class="p1-edit-badge">✎ 点击编辑</span>

        <!-- 顶部标题行 -->
        <div class="p1-header-row">
          <div class="p1-main-title">${titleHtml}</div>
          <div class="p1-tag-daily">DAILY</div>
        </div>

        <!-- 中间图文行 -->
        <div class="p1-middle-row">
          <div class="p1-avatar-box">
            <img class="p1-avatar-img" src="${this.data.avatarUrl}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'><rect fill=\\'%23222\\' width=\\'100\\' height=\\'100\\'/><text fill=\\'%23fff\\' x=\\'50%\\' y=\\'50%\\' font-size=\\'12\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>Archer</text></svg>'" alt="Avatar">
          </div>
          <div class="p1-middle-info">
            <div class="p1-info-top">
              <span class="p1-sub-tag">${this.data.subTag}</span>
              <span class="p1-stars">${this.data.stars}</span>
            </div>
            <div class="p1-character-name">${this.data.characterName}</div>
            <div class="p1-quote-text">${this.data.quote.replace(/\n/g, '<br>')}</div>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="p1-divider"></div>

        <!-- 底部状态行 -->
        <div class="p1-bottom-row">
          <!-- 天气 -->
          <div class="p1-weather-block">
            <div class="p1-weather-icon-wrap">
              <svg class="p1-weather-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/>
              </svg>
              <span class="p1-weather-temp">${this.data.weatherTemp}</span>
            </div>
            <div class="p1-weather-vdivider"></div>
            <div class="p1-weather-desc">
              <span class="p1-weather-line1">${this.data.weatherLine1}</span>
              <span class="p1-weather-line2">${this.data.weatherLine2}</span>
              <span class="p1-weather-hl">${this.data.weatherHL}</span>
            </div>
          </div>

          <!-- 关于卡片 -->
          <div class="p1-about-card">
            <div class="p1-about-left">
              <div class="p1-about-checkbox"></div>
              <div class="p1-about-title-block">${this.data.aboutTitle.replace(/\n/g, '<br>')}</div>
              <div class="p1-about-detail">${this.data.aboutDetail}</div>
            </div>
            <div class="p1-about-date-col">
              <span>${this.data.aboutDate1}</span>
              <span>${this.data.aboutDate2}</span>
            </div>
          </div>
        </div>

        <!-- 最底行便签 -->
        <div class="p1-footer-bar">
          <div class="p1-footer-icon">
            <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          </div>
          <span class="p1-footer-text">${this.data.footerText}</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const card = this.container.querySelector('#p1-card');
    if (card) {
      card.addEventListener('click', (e) => {
        // 打开编辑对话框
        window.editModal.open({
          title: '自定义 P1 顶部小组件',
          fields: [
            { id: 'avatarUrl', label: '更换头像/主图', type: 'image', value: this.data.avatarUrl },
            { id: 'mainTitle', label: '大标题 (如 MEETING YOU)', type: 'text', value: this.data.mainTitle },
            { id: 'characterName', label: '角色名称 (如 Archer)', type: 'text', value: this.data.characterName },
            { id: 'subTag', label: '角色副标签', type: 'text', value: this.data.subTag },
            { id: 'quote', label: '文案/誓言语录', type: 'textarea', value: this.data.quote },
            { id: 'weatherTemp', label: '天气温度 (如 21°)', type: 'text', value: this.data.weatherTemp },
            { id: 'weatherLine1', label: '天气描述第一行', type: 'text', value: this.data.weatherLine1 },
            { id: 'weatherLine2', label: '天气描述第二行', type: 'text', value: this.data.weatherLine2 },
            { id: 'weatherHL', label: '最高/最低温 (如 H:13° L:1°)', type: 'text', value: this.data.weatherHL },
            { id: 'aboutDetail', label: '右侧卡片情话小字', type: 'textarea', value: this.data.aboutDetail },
            { id: 'footerText', label: '底栏日记/状态便签', type: 'text', value: this.data.footerText }
          ],
          onSave: async (newValues) => {
            this.data = { ...this.data, ...newValues };
            await window.storageEngine.setItem('widget_p1_data', this.data);
            this.render();
            this.bindEvents();
            window.showToast('P1 小组件已保存并持久化！');
          },
          onReset: async () => {
            this.data = { ...DEFAULT_P1_DATA };
            await window.storageEngine.setItem('widget_p1_data', this.data);
            this.render();
            this.bindEvents();
            window.showToast('已重置为默认内容');
          }
        });
      });
    }
  }
}
