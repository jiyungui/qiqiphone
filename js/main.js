/**
 * main.js - 主入口启动器
 * 负责时间更新、全屏视口适配 (参考 Safari / Chrome PWA standalone 规范)、三页滑屏指示器同步
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. 动态视口高度适配 (消除 iOS Safari 工具栏和安卓导航栏 100vh 溢出裁切)
  function adjustViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  adjustViewport();
  window.addEventListener('resize', adjustViewport);
  window.addEventListener('orientationchange', adjustViewport);

  // 2. 状态栏时钟与实时秒针
  const timeEl = document.getElementById('status-time');
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (timeEl) timeEl.textContent = `${hours}:${minutes}`;
  }
  updateTime();
  setInterval(updateTime, 1000);

  // 3. 滑动分页指示器联动 (三页联动)
  const slider = document.getElementById('screens-slider');
  const dots = document.querySelectorAll('.page-dot');

  if (slider && dots.length > 0) {
    slider.addEventListener('scroll', () => {
      const scrollLeft = slider.scrollLeft;
      const width = slider.clientWidth || 1;
      const pageIndex = Math.round(scrollLeft / width);
      dots.forEach((dot, idx) => {
        if (idx === pageIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }, { passive: true });
  }

  // 4. 初始化应用与小组件
  if (window.appManager) {
    window.appManager.init();
  }
  if (window.widgetManager) {
    await window.widgetManager.init();
  }
});
