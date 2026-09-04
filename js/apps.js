/**
 * 第一页右侧 6 个 APP 逻辑模块
 * chat - 记忆世界 - 相册 - 日记 - 世界书 - 老福特
 */
const DEFAULT_PAGE1_APPS = [
  {
    id: 'chat',
    name: 'chat',
    iconUrl: '',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
  },
  {
    id: 'memory_world',
    name: '记忆世界',
    iconUrl: '',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
  },
  {
    id: 'photos',
    name: '相册',
    iconUrl: '',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
  },
  {
    id: 'diary',
    name: '日记',
    iconUrl: '',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
  },
  {
    id: 'world_book',
    name: '世界书',
    iconUrl: '',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`
  },
  {
    id: 'lofter',
    name: '老福特',
    iconUrl: '',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  }
];

class AppsManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.apps = [...DEFAULT_PAGE1_APPS];
    this.init();
  }

  async init() {
    const saved = await window.storageEngine.getItem('page1_apps_data');
    if (saved && Array.isArray(saved)) {
      this.apps = saved;
    }
    this.render();
    this.bindEvents();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = this.apps.map(app => {
      let iconInner = '';
      if (app.iconUrl) {
        iconInner = `<img class="app-icon-img" src="${app.iconUrl}" alt="${app.name}">`;
      } else {
        iconInner = `<div class="app-icon-svg">${app.svg}</div>`;
      }

      return `
        <div class="app-item" data-app-id="${app.id}" title="点击打开 / 长按自定义">
          <div class="app-icon">
            ${iconInner}
          </div>
          <span class="app-label">${app.name}</span>
        </div>
      `;
    }).join('');
  }

  bindEvents() {
    const items = this.container.querySelectorAll('.app-item');
    items.forEach(item => {
      let pressTimer = null;
      const appId = item.getAttribute('data-app-id');
      const app = this.apps.find(a => a.id === appId);

      // 单击事件：打开 APP 提示
      item.addEventListener('click', (e) => {
        window.showToast(`打开应用：${app.name}`);
      });

      // 桌面端右键 / 移动端长按编辑 APP 图标与名字
      const openAppEditor = () => {
        window.editModal.open({
          title: `自定义应用 [${app.name}]`,
          fields: [
            { id: 'name', label: '应用名称', type: 'text', value: app.name },
            { id: 'iconUrl', label: '自定义图标图片', type: 'image', value: app.iconUrl }
          ],
          onSave: async (values) => {
            app.name = values.name || app.name;
            app.iconUrl = values.iconUrl || '';
            await window.storageEngine.setItem('page1_apps_data', this.apps);
            this.render();
            this.bindEvents();
            window.showToast(`应用 [${app.name}] 已更新！`);
          },
          onReset: async () => {
            const defaultApp = DEFAULT_PAGE1_APPS.find(a => a.id === app.id);
            if (defaultApp) {
              app.name = defaultApp.name;
              app.iconUrl = '';
              await window.storageEngine.setItem('page1_apps_data', this.apps);
              this.render();
              this.bindEvents();
              window.showToast('已重置该应用图标');
            }
          }
        });
      };

      item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        openAppEditor();
      });

      item.addEventListener('touchstart', () => {
        pressTimer = setTimeout(() => {
          openAppEditor();
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
