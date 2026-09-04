/**
 * apps.js - 主屏幕应用管理
 * 第一页 8 个应用 (4 列 x 2 行标准网格):
 *   第一行: chat, 记忆世界, 相册, 你懂得
 *   第二行: 日记, 世界书, 老福特, 查手机
 * 第二页 4 个应用 (左侧 2x2 网格，无背后框，对应右侧 Memory 小组件):
 *   视频, 恋人之家, 闲鱼, 美团
 * 底部 Dock 栏 4 个应用:
 *   设置, 美化, 短信, 频道
 * 严格遵从白灰 INS 极简线条矢量风格（无任何 Emoji）
 */

// 第一页主屏 8 个 APP
const PAGE_ONE_APPS = [
  {
    id: 'chat',
    name: 'chat',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>`
  },
  {
    id: 'memory',
    name: '记忆世界',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>`
  },
  {
    id: 'photos',
    name: '相册',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" ry="3"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>`
  },
  {
    id: 'you-know',
    name: '你懂得',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>`
  },
  {
    id: 'diary',
    name: '日记',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <line x1="9" y1="7" x2="15" y2="7"/>
            <line x1="9" y1="11" x2="13" y2="11"/>
          </svg>`
  },
  {
    id: 'worldbook',
    name: '世界书',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>`
  },
  {
    id: 'lofter',
    name: '老福特',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 4v13a3 3 0 0 0 3 3h7"/>
            <line x1="12" y1="7" x2="16" y2="7"/>
            <line x1="14" y1="5" x2="14" y2="9"/>
          </svg>`
  },
  {
    id: 'phone-check',
    name: '查手机',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="3" ry="3"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
            <circle cx="12" cy="9" r="2.5"/>
            <path d="M9 13.5a4 4 0 0 1 6 0"/>
          </svg>`
  }
];

// 第二页中部左侧 4 个 APP (横排俩竖排俩 2x2): 视频、恋人之家、闲鱼、美团
const PAGE_TWO_MID_LEFT_APPS = [
  {
    id: 'video',
    name: '视频',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="4" ry="4"/>
            <polygon points="10 8 16 12 10 16 10 8"/>
          </svg>`
  },
  {
    id: 'lovers-home',
    name: '恋人之家',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <path d="M12 11c-1.5-1.5-3.5 0-3.5 1.5 0 2 3.5 4 3.5 4s3.5-2 3.5-4c0-1.5-2-1.5-3.5-1.5z"/>
          </svg>`
  },
  {
    id: 'xianyu',
    name: '闲鱼',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 12c4-8 12-4 15-2-3 2-4 8-10 8-3 0-5-2-5-6z"/>
            <path d="M6 12L2 9v6l4-3z"/>
            <circle cx="15" cy="11" r="1"/>
          </svg>`
  },
  {
    id: 'meituan',
    name: '美团',
    svg: `<svg class="app-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/>
            <line x1="10" y1="1" x2="10" y2="4"/>
            <line x1="14" y1="1" x2="14" y2="4"/>
          </svg>`
  }
];

// 底部 Dock 栏 4 个应用
const DOCK_APPS = [
  {
    id: 'settings',
    name: '设置',
    svg: `<svg class="dock-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>`
  },
  {
    id: 'theme',
    name: '美化',
    svg: `<svg class="dock-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            <circle cx="12" cy="14" r="3"/>
          </svg>`
  },
  {
    id: 'messages',
    name: '短信',
    svg: `<svg class="dock-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>`
  },
  {
    id: 'channels',
    name: '频道',
    svg: `<svg class="dock-icon-svg" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="2"/>
            <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
          </svg>`
  }
];

class AppManager {
  init() {
    this.renderPageOneApps();
    this.renderPageTwoApps();
    this.renderDockApps();
  }

  renderPageOneApps() {
    const grid = document.getElementById('main-apps-grid');
    if (!grid) return;

    grid.innerHTML = PAGE_ONE_APPS.map(app => `
      <div class="app-item" onclick="appManager.launchApp('${app.id}', '${app.name}')">
        <div class="app-icon">
          <div class="app-icon-inner">
            ${app.svg}
          </div>
        </div>
        <div class="app-label">${app.name}</div>
      </div>
    `).join('');
  }

  renderPageTwoApps() {
    // 渲染第二页中部左侧 4 个 APP (2x2)
    const midLeftGrid = document.getElementById('page2-mid-left-apps');
    if (midLeftGrid) {
      midLeftGrid.innerHTML = PAGE_TWO_MID_LEFT_APPS.map(app => `
        <div class="app-item" onclick="appManager.launchApp('${app.id}', '${app.name}')">
          <div class="app-icon">
            <div class="app-icon-inner">
              ${app.svg}
            </div>
          </div>
          <div class="app-label">${app.name}</div>
        </div>
      `).join('');
    }
  }

  renderDockApps() {
    const dock = document.getElementById('dock-mount');
    if (!dock) return;

    dock.innerHTML = DOCK_APPS.map(app => `
      <div class="dock-item" onclick="appManager.launchApp('${app.id}', '${app.name}')" title="${app.name}">
        <div class="dock-icon">
          ${app.svg}
        </div>
        <div class="dock-label">${app.name}</div>
      </div>
    `).join('');
  }

  launchApp(appId, appName) {
    if (appId === 'theme') {
      if (window.themeCenter) {
        window.themeCenter.open();
      }
      return;
    }
    if (window.widgetManager) {
      window.widgetManager.showToast(`打开 ${appName}`);
    }
  }
}

window.appManager = new AppManager();
