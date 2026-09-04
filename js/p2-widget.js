/**
 * P2 左侧黑胶唱片闪粉播放器小组件逻辑模块
 */
const DEFAULT_P2_DATA = {
  songTitle: '★♡°candyfloss.ɞ°',
  artist: 'Be around with you',
  albumCover: '图片/IMG_6066.png', // 唱片封面
  currentTime: '2:46',
  totalTime: '4:50',
  progressPercent: 58,
  isPlaying: true
};

class P2Widget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.data = { ...DEFAULT_P2_DATA };
    this.init();
  }

  async init() {
    const saved = await window.storageEngine.getItem('widget_p2_data');
    if (saved) {
      this.data = { ...this.data, ...saved };
    }
    this.render();
    this.bindEvents();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="p2-widget" id="p2-card" title="点击自定义播放器">
        <div class="p2-glitter-bg"></div>
        <div class="p2-glitter-layer"></div>

        <div class="p2-content-layer">
          <!-- 顶部黑胶唱片 -->
          <div class="p2-vinyl-wrap">
            <div class="p2-vinyl-disc ${this.data.isPlaying ? 'playing' : ''}" id="p2-vinyl">
              <div class="p2-vinyl-center">
                <img class="p2-vinyl-cover-img" src="${this.data.albumCover}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\' viewBox=\\'0 0 80 80\\'><rect fill=\\'%23fff\\' width=\\'80\\' height=\\'80\\'/><circle cx=\\'40\\' cy=\\'40\\' r=\\'20\\' fill=\\'%23eee\\'/><text fill=\\'%23333\\' x=\\'50%\\' y=\\'50%\\' font-size=\\'10\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>Music</text></svg>'" alt="Vinyl Cover">
                <div class="p2-vinyl-hole"></div>
              </div>
            </div>
          </div>

          <!-- 歌曲信息 -->
          <div class="p2-info-area">
            <div class="p2-song-title-row">
              <span class="p2-song-title">${this.data.songTitle}</span>
              <span class="p2-milk-icon">🥛</span>
            </div>
            <div class="p2-artist-title">${this.data.artist}</div>
          </div>

          <!-- 播放进度条 -->
          <div class="p2-progress-section">
            <div class="p2-progress-bar-bg">
              <div class="p2-progress-bar-fill" style="width: ${this.data.progressPercent}%;">
                <div class="p2-progress-thumb"></div>
              </div>
            </div>
            <div class="p2-time-row">
              <span class="p2-time-current">${this.data.currentTime}</span>
              <span class="p2-time-total">${this.data.totalTime}</span>
            </div>
          </div>

          <!-- 播放控制按键 -->
          <div class="p2-controls-row">
            <button class="p2-ctrl-btn p2-prev-btn" id="p2-prev-btn" title="上一首">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
              </svg>
            </button>
            <button class="p2-ctrl-btn p2-play-btn" id="p2-play-toggle-btn" title="播放/暂停">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                ${this.data.isPlaying 
                  ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' 
                  : '<path d="M8 5v14l11-7z"/>'}
              </svg>
            </button>
            <button class="p2-ctrl-btn p2-next-btn" id="p2-next-btn" title="下一首">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const playBtn = this.container.querySelector('#p2-play-toggle-btn');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.data.isPlaying = !this.data.isPlaying;
        window.storageEngine.setItem('widget_p2_data', this.data);
        this.render();
        this.bindEvents();
      });
    }

    const card = this.container.querySelector('#p2-card');
    if (card) {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.p2-ctrl-btn')) return;

        window.editModal.open({
          title: '自定义 P2 黑胶播放器小组件',
          fields: [
            { id: 'albumCover', label: '更换黑胶唱片封面', type: 'image', value: this.data.albumCover },
            { id: 'songTitle', label: '歌曲标题 (如 ★♡°candyfloss.ɞ°)', type: 'text', value: this.data.songTitle },
            { id: 'artist', label: '歌手/副标题 (如 Be around with you)', type: 'text', value: this.data.artist },
            { id: 'currentTime', label: '当前播放时间 (如 2:46)', type: 'text', value: this.data.currentTime },
            { id: 'totalTime', label: '歌曲总时长 (如 4:50)', type: 'text', value: this.data.totalTime },
            { id: 'progressPercent', label: '进度百分比 (0-100)', type: 'number', value: this.data.progressPercent }
          ],
          onSave: async (newValues) => {
            this.data = { ...this.data, ...newValues };
            await window.storageEngine.setItem('widget_p2_data', this.data);
            this.render();
            this.bindEvents();
            window.showToast('P2 播放器已保存并更新！');
          },
          onReset: async () => {
            this.data = { ...DEFAULT_P2_DATA };
            await window.storageEngine.setItem('widget_p2_data', this.data);
            this.render();
            this.bindEvents();
            window.showToast('已重置播放器默认内容');
          }
        });
      });
    }
  }
}
