/**
 * 主入口逻辑：时钟更新、全屏自适应、模块实例化
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. 初始化时钟
  const timeEl = document.getElementById('status-time');
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (timeEl) timeEl.textContent = `${hours}:${minutes}`;
  }
  updateTime();
  setInterval(updateTime, 1000);

  // 2. 实例化各个模块
  window.p1WidgetInstance = new P1Widget('p1-widget-container');
  window.p2WidgetInstance = new P2Widget('p2-widget-container');
  window.appsManagerInstance = new AppsManager('page1-apps-container');
  window.dockManagerInstance = new DockManager('dock-container');
  window.paginationManagerInstance = new PaginationManager();

  // 3. 动态视口高度适配 (修复 Safari 100vh 遮挡问题)
  function adjustViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  adjustViewport();
  window.addEventListener('resize', adjustViewport);
  window.addEventListener('orientationchange', adjustViewport);
});
