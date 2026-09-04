/**
 * 祁祁phone · 美化与系统定制管理器 (ThemeCenter)
 * 纯白灰 INS 极简风 · IndexedDB 持久化 · 实时响应
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'custom_phone_theme_config';
  const WP_LIB_KEY = 'wallpaper_library_list';

  // 默认美化配置
  const DEFAULT_THEME_CONFIG = {
    wallpaper: {
      url: '',
      preset: 'clean-white',
      blur: 0,
      frost: 0,
      opacity: 100,
      fit: 'cover', // cover, center, custom
      scale: 100,
      posX: 50,
      posY: 50
    },
    icons: {
      size: 48,
      radius: 12,
      strokeWidth: 1.5,
      showLabel: true,
      labelSize: 11,
      bgAlpha: 100
    },
    screen: {
      temp: 'neutral', // cool, neutral, warm
      dockBlur: 24,
      dockOpacity: 72,
      statusBarDark: true
    },
    widgets: {
      cardAlpha: 85,
      borderStyle: 'solid',
      fontFamily: 'default'
    }
  };

  class ThemeCenter {
    constructor() {
      this.config = JSON.parse(JSON.stringify(DEFAULT_THEME_CONFIG));
      this.tempConfig = JSON.parse(JSON.stringify(DEFAULT_THEME_CONFIG));
      this.wallpaperLibrary = [];
      this.activeSubpage = null;
      this.isOpen = false;
      this.hasInitedDOM = false;
    }

    async init() {
      await this.loadConfig();
      await this.loadWallpaperLibrary();
      this.applyTheme(this.config);
      this.bindDOMEvents();
    }

    // 从 IndexedDB (QiQiPhoneDB) 加载配置
    async loadConfig() {
      try {
        if (window.db) {
          const saved = await window.db.getAppData(STORAGE_KEY);
          if (saved) {
            this.config = this.deepMerge(DEFAULT_THEME_CONFIG, saved);
          }
        }
      } catch (err) {
        console.warn('[ThemeCenter] loadConfig fallback to local', err);
      }
      this.tempConfig = JSON.parse(JSON.stringify(this.config));
    }

    // 加载壁纸库
    async loadWallpaperLibrary() {
      try {
        if (window.db) {
          const savedLib = await window.db.getAppData(WP_LIB_KEY);
          if (Array.isArray(savedLib)) {
            this.wallpaperLibrary = savedLib;
          } else {
            // 预置几张经典高质感白灰极简壁纸
            this.wallpaperLibrary = [
              {
                id: 'preset_1',
                title: '纯白静谧',
                url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800"><rect width="100%" height="100%" fill="%23F4F5F4"/><circle cx="200" cy="300" r="180" fill="%23EBECEB" opacity="0.6"/><circle cx="280" cy="500" r="220" fill="%23E2E5E2" opacity="0.4"/></svg>',
                blur: 0,
                frost: 0,
                opacity: 100,
                fit: 'cover',
                scale: 100,
                posX: 50,
                posY: 50,
                time: Date.now()
              },
              {
                id: 'preset_2',
                title: '冷调雾灰',
                url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800"><rect width="100%" height="100%" fill="%23E6E8E6"/><line x1="0" y1="0" x2="400" y2="800" stroke="%23D8DDD8" stroke-width="2"/><line x1="400" y1="0" x2="0" y2="800" stroke="%23D8DDD8" stroke-width="2"/></svg>',
                blur: 0,
                frost: 0,
                opacity: 100,
                fit: 'cover',
                scale: 100,
                posX: 50,
                posY: 50,
                time: Date.now()
              }
            ];
            await window.db.setAppData(WP_LIB_KEY, this.wallpaperLibrary);
          }
        }
      } catch (err) {
        console.warn('[ThemeCenter] loadWallpaperLibrary error', err);
      }
    }

    // 保存到 IndexedDB
    async saveConfig() {
      try {
        this.config = JSON.parse(JSON.stringify(this.tempConfig));
        if (window.db) {
          await window.db.setAppData(STORAGE_KEY, this.config);
        }
        this.applyTheme(this.config);
      } catch (err) {
        console.error('[ThemeCenter] saveConfig error', err);
      }
    }

    // 保存壁纸库到 IndexedDB
    async saveWallpaperLibrary() {
      try {
        if (window.db) {
          await window.db.setAppData(WP_LIB_KEY, this.wallpaperLibrary);
        }
      } catch (err) {
        console.error('[ThemeCenter] saveWallpaperLibrary error', err);
      }
    }

    // 深度合并
    deepMerge(target, source) {
      const output = Object.assign({}, target);
      if (this.isObject(target) && this.isObject(source)) {
        Object.keys(source).forEach(key => {
          if (this.isObject(source[key])) {
            if (!(key in target)) Object.assign(output, { [key]: source[key] });
            else output[key] = this.deepMerge(target[key], source[key]);
          } else {
            Object.assign(output, { [key]: source[key] });
          }
        });
      }
      return output;
    }

    isObject(item) {
      return (item && typeof item === 'object' && !Array.isArray(item));
    }

    // 全局生效与 CSS 变量驱动
    applyTheme(cfg) {
      const root = document.documentElement;

      // 1. 壁纸渲染
      this.renderWallpaper(cfg.wallpaper);

      // 2. 图标设定
      root.style.setProperty('--app-icon-size', `${cfg.icons.size}px`);
      root.style.setProperty('--app-icon-radius', `${cfg.icons.radius}px`);
      root.style.setProperty('--app-font-size', `${cfg.icons.labelSize}px`);
      root.style.setProperty('--app-icon-bg-alpha', `${cfg.icons.bgAlpha / 100}`);

      // 3. 屏幕与毛玻璃
      root.style.setProperty('--dock-blur', `${cfg.screen.dockBlur}px`);
      root.style.setProperty('--dock-bg-alpha', `${cfg.screen.dockOpacity / 100}`);

      // 4. 小组件
      root.style.setProperty('--widget-card-alpha', `${cfg.widgets.cardAlpha / 100}`);
    }

    // 壁纸层渲染
    renderWallpaper(wp) {
      let wpLayer = document.getElementById('phone-wallpaper-layer');
      if (!wpLayer) {
        const viewport = document.getElementById('phone-viewport');
        if (viewport) {
          wpLayer = document.createElement('div');
          wpLayer.id = 'phone-wallpaper-layer';
          viewport.insertBefore(wpLayer, viewport.firstChild);
        }
      }

      if (!wpLayer) return;

      if (wp.url) {
        wpLayer.style.backgroundImage = `url("${wp.url}")`;
        wpLayer.style.opacity = `${wp.opacity / 100}`;
        wpLayer.style.filter = `blur(${wp.blur}px)`;

        if (wp.fit === 'cover') {
          wpLayer.style.backgroundSize = 'cover';
          wpLayer.style.backgroundPosition = 'center';
        } else if (wp.fit === 'center') {
          wpLayer.style.backgroundSize = 'contain';
          wpLayer.style.backgroundPosition = 'center';
        } else if (wp.fit === 'custom') {
          wpLayer.style.backgroundSize = `${wp.scale}%`;
          wpLayer.style.backgroundPosition = `${wp.posX}% ${wp.posY}%`;
        }
      } else {
        wpLayer.style.backgroundImage = 'none';
        wpLayer.style.backgroundColor = '#F2F4F2';
        wpLayer.style.filter = 'none';
        wpLayer.style.opacity = '1';
      }
    }

    // 绑定 DOM 交互事件
    bindDOMEvents() {
      if (this.hasInitedDOM) return;
      this.hasInitedDOM = true;

      // 1. 顶部返回与重置
      const backBtn = document.getElementById('theme-back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          if (this.activeSubpage) {
            this.closeSubpage();
          } else {
            this.close();
          }
        });
      }

      const resetBtn = document.getElementById('theme-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('确认恢复美化中心的默认出厂设置？')) {
            this.tempConfig = JSON.parse(JSON.stringify(DEFAULT_THEME_CONFIG));
            this.saveConfig();
            this.syncControls();
          }
        });
      }

      // 2. 主页面四大胶囊入口点击
      const capsulePills = document.querySelectorAll('.ins-floating-capsule, .theme-aesthetic-card, .theme-capsule-pill, .theme-capsule-item');
      capsulePills.forEach(pill => {
        pill.addEventListener('click', () => {
          const target = pill.getAttribute('data-target-section');
          if (target) {
            this.openSubpage(target);
          }
        });
      });

      // 3. 壁纸调整子面板事件绑定
      this.bindWallpaperSubpageEvents();
    }

    // 绑定壁纸调整子面板所有控制器
    bindWallpaperSubpageEvents() {
      const fileInput = document.getElementById('wp-file-input');
      const urlTriggerBtn = document.getElementById('wp-url-trigger-btn');
      const urlWrap = document.getElementById('wp-url-input-wrap');
      const urlField = document.getElementById('wp-url-field');
      const urlConfirmBtn = document.getElementById('wp-url-confirm-btn');

      const sliderBlur = document.getElementById('slider-wp-blur');
      const sliderFrost = document.getElementById('slider-wp-frost');
      const sliderOpacity = document.getElementById('slider-wp-opacity');

      const fitButtons = document.querySelectorAll('#wp-fit-mode-ctrl .segment-btn');
      const customGroup = document.getElementById('wp-custom-geometry-group');
      const sliderScale = document.getElementById('slider-wp-scale');
      const sliderPosX = document.getElementById('slider-wp-pos-x');
      const sliderPosY = document.getElementById('slider-wp-pos-y');

      const btnSaveWp = document.getElementById('btn-save-wallpaper');

      // 本地相册/文件上传
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target.result;
            this.tempConfig.wallpaper.url = dataUrl;
            this.updateWallpaperLivePreview();
          };
          reader.readAsDataURL(file);
        });
      }

      // URL 导入切换
      if (urlTriggerBtn && urlWrap) {
        urlTriggerBtn.addEventListener('click', () => {
          urlWrap.style.display = urlWrap.style.display === 'none' ? 'flex' : 'none';
          if (urlWrap.style.display === 'flex' && urlField) {
            urlField.focus();
          }
        });
      }

      // URL 确认载入
      if (urlConfirmBtn && urlField) {
        urlConfirmBtn.addEventListener('click', () => {
          const url = urlField.value.trim();
          if (url) {
            this.tempConfig.wallpaper.url = url;
            this.updateWallpaperLivePreview();
            urlField.value = '';
            if (urlWrap) urlWrap.style.display = 'none';
          }
        });
      }

      // 模糊滑块
      if (sliderBlur) {
        sliderBlur.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          this.tempConfig.wallpaper.blur = val;
          const valTag = document.getElementById('val-wp-blur');
          if (valTag) valTag.textContent = `${val}px`;
          this.updateWallpaperLivePreview();
        });
      }

      // 毛玻璃滑块
      if (sliderFrost) {
        sliderFrost.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          this.tempConfig.wallpaper.frost = val;
          const valTag = document.getElementById('val-wp-frost');
          if (valTag) valTag.textContent = `${val}px`;
          this.updateWallpaperLivePreview();
        });
      }

      // 不透明度滑块
      if (sliderOpacity) {
        sliderOpacity.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          this.tempConfig.wallpaper.opacity = val;
          const valTag = document.getElementById('val-wp-opacity');
          if (valTag) valTag.textContent = `${val}%`;
          this.updateWallpaperLivePreview();
        });
      }

      // 铺满/居中/自定义模式切换
      if (fitButtons) {
        fitButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            fitButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const fit = btn.getAttribute('data-fit');
            this.tempConfig.wallpaper.fit = fit;

            if (customGroup) {
              customGroup.style.display = (fit === 'custom') ? 'flex' : 'none';
            }
            this.updateWallpaperLivePreview();
          });
        });
      }

      // 大小缩放滑块
      if (sliderScale) {
        sliderScale.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          this.tempConfig.wallpaper.scale = val;
          const valTag = document.getElementById('val-wp-scale');
          if (valTag) valTag.textContent = `${val}%`;
          this.updateWallpaperLivePreview();
        });
      }

      // 左右位置
      if (sliderPosX) {
        sliderPosX.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          this.tempConfig.wallpaper.posX = val;
          const valTag = document.getElementById('val-wp-pos-x');
          if (valTag) valTag.textContent = `${val}%`;
          this.updateWallpaperLivePreview();
        });
      }

      // 上下位置
      if (sliderPosY) {
        sliderPosY.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          this.tempConfig.wallpaper.posY = val;
          const valTag = document.getElementById('val-wp-pos-y');
          if (valTag) valTag.textContent = `${val}%`;
          this.updateWallpaperLivePreview();
        });
      }

      // 点击保存并应用
      if (btnSaveWp) {
        btnSaveWp.addEventListener('click', async () => {
          await this.saveCurrentToLibraryAndApply();
        });
      }
    }

    // 更新微缩手机屏幕的实时预览
    updateWallpaperLivePreview() {
      const wp = this.tempConfig.wallpaper;
      const previewWpLayer = document.getElementById('preview-wallpaper-layer');
      const previewFrostLayer = document.getElementById('preview-frost-layer');

      if (previewWpLayer) {
        if (wp.url) {
          previewWpLayer.style.backgroundImage = `url("${wp.url}")`;
          previewWpLayer.style.opacity = `${wp.opacity / 100}`;
          previewWpLayer.style.filter = `blur(${wp.blur / 2}px)`; // 微缩尺寸滤镜等比缩减

          if (wp.fit === 'cover') {
            previewWpLayer.style.backgroundSize = 'cover';
            previewWpLayer.style.backgroundPosition = 'center';
          } else if (wp.fit === 'center') {
            previewWpLayer.style.backgroundSize = 'contain';
            previewWpLayer.style.backgroundPosition = 'center';
          } else if (wp.fit === 'custom') {
            previewWpLayer.style.backgroundSize = `${wp.scale}%`;
            previewWpLayer.style.backgroundPosition = `${wp.posX}% ${wp.posY}%`;
          }
        } else {
          previewWpLayer.style.backgroundImage = 'none';
          previewWpLayer.style.backgroundColor = '#F1F2F1';
          previewWpLayer.style.opacity = '1';
        }
      }

      if (previewFrostLayer) {
        if (wp.frost > 0) {
          previewFrostLayer.style.backdropFilter = `blur(${wp.frost / 2}px)`;
          previewFrostLayer.style.background = 'rgba(255, 255, 255, 0.15)';
        } else {
          previewFrostLayer.style.backdropFilter = 'none';
          previewFrostLayer.style.background = 'transparent';
        }
      }
    }

    // 保存当前壁纸及全部滤镜参数到壁纸库并全局应用
    async saveCurrentToLibraryAndApply() {
      const wp = this.tempConfig.wallpaper;
      if (!wp.url) {
        alert('请先选择或上传一张壁纸图片！');
        return;
      }

      // 检查壁纸库中是否已有相同 url 的项目
      let existingIndex = this.wallpaperLibrary.findIndex(item => item.url === wp.url);
      const entry = {
        id: 'wp_' + Date.now(),
        title: '壁纸存档',
        url: wp.url,
        blur: wp.blur,
        frost: wp.frost,
        opacity: wp.opacity,
        fit: wp.fit,
        scale: wp.scale,
        posX: wp.posX,
        posY: wp.posY,
        time: Date.now()
      };

      if (existingIndex >= 0) {
        // 更新原有记录的参数
        this.wallpaperLibrary[existingIndex] = entry;
      } else {
        // 新增并推到最前
        this.wallpaperLibrary.unshift(entry);
      }

      // 持久化到 IndexedDB
      await this.saveWallpaperLibrary();
      await this.saveConfig();

      // 刷新壁纸库渲染
      this.renderWallpaperLibraryGrid();

      // 提示
      const btn = document.getElementById('btn-save-wallpaper');
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>✓ 已保存至壁纸库并应用</span>';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 1400);
      }
    }

    // 渲染壁纸库网格
    renderWallpaperLibraryGrid() {
      const grid = document.getElementById('wp-library-grid');
      const countTag = document.getElementById('wp-library-count-tag');
      if (!grid) return;

      grid.innerHTML = '';
      if (countTag) {
        countTag.textContent = `${this.wallpaperLibrary.length} ITEMS`;
      }

      if (this.wallpaperLibrary.length === 0) {
        grid.innerHTML = '<div class="wp-library-empty-tip">壁纸库暂无记录，上传或导入后将自动收纳</div>';
        return;
      }

      this.wallpaperLibrary.forEach((item, index) => {
        const isCurrent = (this.tempConfig.wallpaper.url === item.url);
        const card = document.createElement('div');
        card.className = `wp-library-card ${isCurrent ? 'active' : ''}`;
        card.style.backgroundImage = `url("${item.url}")`;

        card.innerHTML = `
          <div class="wp-library-card-tag">${item.fit === 'custom' ? 'CUSTOM' : item.fit.toUpperCase()}</div>
          <button class="wp-library-del-btn" title="删除" type="button">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        `;

        // 点击一键载入所有参数
        card.addEventListener('click', (e) => {
          if (e.target.closest('.wp-library-del-btn')) return;
          this.applyLibraryItemToTemp(item);
        });

        // 删除按钮
        const delBtn = card.querySelector('.wp-library-del-btn');
        if (delBtn) {
          delBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm('确认从壁纸库中移除此壁纸？')) {
              this.wallpaperLibrary.splice(index, 1);
              await this.saveWallpaperLibrary();
              this.renderWallpaperLibraryGrid();
            }
          });
        }

        grid.appendChild(card);
      });
    }

    // 从壁纸库项载入到当前编辑态
    applyLibraryItemToTemp(item) {
      this.tempConfig.wallpaper = {
        url: item.url,
        blur: item.blur || 0,
        frost: item.frost || 0,
        opacity: item.opacity !== undefined ? item.opacity : 100,
        fit: item.fit || 'cover',
        scale: item.scale || 100,
        posX: item.posX !== undefined ? item.posX : 50,
        posY: item.posY !== undefined ? item.posY : 50
      };

      this.syncWallpaperControls();
      this.updateWallpaperLivePreview();
      this.renderWallpaperLibraryGrid();
    }

    // 同步壁纸子面板控制器状态
    syncWallpaperControls() {
      const wp = this.tempConfig.wallpaper;

      const sliderBlur = document.getElementById('slider-wp-blur');
      if (sliderBlur) {
        sliderBlur.value = wp.blur;
        const val = document.getElementById('val-wp-blur');
        if (val) val.textContent = `${wp.blur}px`;
      }

      const sliderFrost = document.getElementById('slider-wp-frost');
      if (sliderFrost) {
        sliderFrost.value = wp.frost;
        const val = document.getElementById('val-wp-frost');
        if (val) val.textContent = `${wp.frost}px`;
      }

      const sliderOpacity = document.getElementById('slider-wp-opacity');
      if (sliderOpacity) {
        sliderOpacity.value = wp.opacity;
        const val = document.getElementById('val-wp-opacity');
        if (val) val.textContent = `${wp.opacity}%`;
      }

      // 模式
      const fitButtons = document.querySelectorAll('#wp-fit-mode-ctrl .segment-btn');
      fitButtons.forEach(btn => {
        if (btn.getAttribute('data-fit') === wp.fit) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const customGroup = document.getElementById('wp-custom-geometry-group');
      if (customGroup) {
        customGroup.style.display = (wp.fit === 'custom') ? 'flex' : 'none';
      }

      const sliderScale = document.getElementById('slider-wp-scale');
      if (sliderScale) {
        sliderScale.value = wp.scale;
        const val = document.getElementById('val-wp-scale');
        if (val) val.textContent = `${wp.scale}%`;
      }

      const sliderPosX = document.getElementById('slider-wp-pos-x');
      if (sliderPosX) {
        sliderPosX.value = wp.posX;
        const val = document.getElementById('val-wp-pos-x');
        if (val) val.textContent = `${wp.posX}%`;
      }

      const sliderPosY = document.getElementById('slider-wp-pos-y');
      if (sliderPosY) {
        sliderPosY.value = wp.posY;
        const val = document.getElementById('val-wp-pos-y');
        if (val) val.textContent = `${wp.posY}%`;
      }
    }

    // 同步所有控制器状态
    syncControls() {
      this.syncWallpaperControls();
      this.updateWallpaperLivePreview();
      this.renderWallpaperLibraryGrid();
    }

    // 打开二级页面
    openSubpage(sectionId) {
      const subpage = document.getElementById(`subpage-${sectionId}`);
      if (!subpage) return;

      this.activeSubpage = sectionId;
      subpage.classList.add('active');

      const titleEl = document.getElementById('theme-header-title');
      const subTitleEl = document.getElementById('theme-header-sub');

      if (sectionId === 'wallpaper') {
        if (titleEl) titleEl.textContent = '壁纸调整';
        if (subTitleEl) subTitleEl.textContent = 'WALLPAPER STUDIO';
        this.syncWallpaperControls();
        this.updateWallpaperLivePreview();
        this.renderWallpaperLibraryGrid();
      } else if (sectionId === 'icons') {
        if (titleEl) titleEl.textContent = '图标调整';
        if (subTitleEl) subTitleEl.textContent = 'ICONS & MORPHOLOGY';
      } else if (sectionId === 'screen') {
        if (titleEl) titleEl.textContent = '屏幕调整';
        if (subTitleEl) subTitleEl.textContent = 'DISPLAY & FROST';
      } else if (sectionId === 'widgets') {
        if (titleEl) titleEl.textContent = '小组件调整';
        if (subTitleEl) subTitleEl.textContent = 'WIDGETS & TYPOGRAPHY';
      }
    }

    // 关闭二级页面返回主菜单
    closeSubpage() {
      if (!this.activeSubpage) return;
      const subpage = document.getElementById(`subpage-${this.activeSubpage}`);
      if (subpage) {
        subpage.classList.remove('active');
      }
      this.activeSubpage = null;

      const titleEl = document.getElementById('theme-header-title');
      const subTitleEl = document.getElementById('theme-header-sub');
      if (titleEl) titleEl.textContent = '美化';
      if (subTitleEl) subTitleEl.textContent = 'FLOATING CAPSULES';
    }

    // 打开美化中心 App 全屏视图
    open() {
      const appView = document.getElementById('theme-app-view');
      if (appView) {
        this.tempConfig = JSON.parse(JSON.stringify(this.config));
        this.syncControls();
        appView.classList.add('active');
        this.isOpen = true;
      }
    }

    // 关闭美化中心 App
    close() {
      const appView = document.getElementById('theme-app-view');
      if (appView) {
        this.closeSubpage();
        appView.classList.remove('active');
        this.isOpen = false;
      }
    }
  }

  // 挂载全局单例
  window.themeCenter = new ThemeCenter();

})();
