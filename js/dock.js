/**
 * 底部 Dock 栏逻辑模块
 * 设置 - 美化 - 短信 - 频道
 */
const DEFAULT_DOCK_APPS = [
  {
    id: 'settings',
    name: '设置',
    iconUrl: '',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  },
  {
    id: 'theme',
    name: '美化',
    iconUrl: '',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`
  },
  {
    id: 'messages',
    name: '短信',
    iconUrl: '',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`
  },
  {
    id: 'channel',
    name: '频道',
    iconUrl: '',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>`
  }
];

class DockManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.dockApps = [...DEFAULT_DOCK_APPS];
    this.init();
  }

  async init() {
    const saved = await window.storageEngine.getItem('dock_apps_data');
    if (saved && Array.isArray(saved)) {
      this.dockApps = saved;
    }
    this.render();
    this.bindEvents();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = this.dockApps.map(app => {
      let iconInner = '';
      if (app.iconUrl) {
        iconInner = `<img class="dock-icon-img" src="${app.iconUrl}" alt="${app.name}">`;
      } else {
        iconInner = `<div class="dock-icon-svg">${app.svg}</div>`;
      }

      return `
        <div class="dock-item" data-app-id="${app.id}" title="${app.name} (长按/右键自定义)">
          <div class="dock-icon">
            ${iconInner}
          </div>
          <span class="dock-label">${app.name}</span>
        </div>
      `;
    }).join('');
  }

  bindEvents() {
    const items = this.container.querySelectorAll('.dock-item');
    items.forEach(item => {
      let pressTimer = null;
      const appId = item.getAttribute('data-app-id');
      const app = this.dockApps.find(a => a.id === appId);

      item.addEventListener('click', () => {
        window.showToast(`打开底栏：${app.name}`);
      });

      const openDockEditor = () => {
        window.editModal.open({
          title: `自定义底栏图标 [${app.name}]`,
          fields: [
            { id: 'name', label: '应用名称', type: 'text', value: app.name },
            { id: 'iconUrl', label: '自定义图标图片', type: 'image', value: app.iconUrl }
          ],
          onSave: async (values) => {
            app.name = values.name || app.name;
            app.iconUrl = values.iconUrl || '';
            await window.storageEngine.setItem('dock_apps_data', this.dockApps);
            this.render();
            this.bindEvents();
            window.showToast(`底栏 [${app.name}] 已保存！`);
          },
          onReset: async () => {
            const defaultApp = DEFAULT_DOCK_APPS.find(a => a.id === app.id);
            if (defaultApp) {
              app.name = defaultApp.name;
              app.iconUrl = '';
              await window.storageEngine.setItem('dock_apps_data', this.dockApps);
              this.render();
              this.bindEvents();
              window.showToast('已恢复默认底栏图标');
            }
          }
        });
      };

      item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        openDockEditor();
      });

      item.addEventListener('touchstart', () => {
        pressTimer = setTimeout(() => {
          openDockEditor();
        }, 600);
      });

      item.addEventListener('touchend', () => {
        if (pressTimer) clearTimeout(pressTimer);
      });

      item.addEventListener('touchmove', () => {
        if (pressTimer) clearTimeout(pressTimer);
      });
    });
  }
}
