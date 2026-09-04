/**
 * 屏幕左右滑动与 3 页指示器模块
 * 支持移动端手势滑动、惯性对齐、点击分页圆点切换
 */
class PaginationManager {
  constructor() {
    this.wrapper = document.getElementById('pages-wrapper');
    this.dotsContainer = document.getElementById('pagination-dots');
    this.dots = this.dotsContainer.querySelectorAll('.dot');
    this.currentPage = 0;
    this.totalPages = 3;

    this.startX = 0;
    this.currentX = 0;
    this.isDragging = false;

    this.init();
  }

  init() {
    this.bindTouchEvents();
    this.bindDotEvents();
  }

  goToPage(index) {
    if (index < 0) index = 0;
    if (index >= this.totalPages) index = this.totalPages - 1;
    this.currentPage = index;

    const translatePercent = -(index * (100 / this.totalPages));
    this.wrapper.style.transform = `translateX(${translatePercent}%)`;

    // 更新圆点
    this.dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  bindDotEvents() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToPage(index);
      });
    });
  }

  bindTouchEvents() {
    const el = this.wrapper;

    el.addEventListener('touchstart', (e) => {
      this.startX = e.touches[0].clientX;
      this.isDragging = true;
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      this.currentX = e.touches[0].clientX;
    }, { passive: true });

    el.addEventListener('touchend', () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      const diffX = this.currentX - this.startX;

      // 滑动阈值 45px
      if (diffX < -45 && this.currentPage < this.totalPages - 1) {
        this.goToPage(this.currentPage + 1);
      } else if (diffX > 45 && this.currentPage > 0) {
        this.goToPage(this.currentPage - 1);
      }
      this.startX = 0;
      this.currentX = 0;
    });

    // 针对桌面端鼠标拖拽预览
    let isMouseDown = false;
    el.addEventListener('mousedown', (e) => {
      if (e.target.closest('#p1-card, #p2-card, .app-item, button, input')) return;
      isMouseDown = true;
      this.startX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      this.currentX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const diffX = this.currentX - this.startX;
      if (diffX < -50 && this.currentPage < this.totalPages - 1) {
        this.goToPage(this.currentPage + 1);
      } else if (diffX > 50 && this.currentPage > 0) {
        this.goToPage(this.currentPage - 1);
      }
      this.startX = 0;
      this.currentX = 0;
    });
  }
}
