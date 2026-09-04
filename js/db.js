/**
 * db.js - 基于 IndexedDB 的持久化高性能存储引擎
 * 突破 LocalStorage 的 5MB 限制，完美支持大体积原图、Base64/Blob、富文本等数据
 * 不压缩画质，持久保存小组件的图片、文字和状态
 */

const DB_NAME = 'QiQiPhoneDB';
const DB_VERSION = 1;
const STORE_WIDGETS = 'widgets';
const STORE_APP_DATA = 'app_data';

class StorageManager {
  constructor() {
    this.db = null;
    this.initPromise = this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_WIDGETS)) {
          db.createObjectStore(STORE_WIDGETS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_APP_DATA)) {
          db.createObjectStore(STORE_APP_DATA, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB 打开失败:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async getWidgetData(widgetId) {
    await this.initPromise;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([STORE_WIDGETS], 'readonly');
        const store = tx.objectStore(STORE_WIDGETS);
        const req = store.get(widgetId);
        req.onsuccess = () => resolve(req.result ? req.result.data : null);
        req.onerror = () => resolve(null);
      } catch (e) {
        console.error('获取小组件数据失败:', e);
        resolve(null);
      }
    });
  }

  async saveWidgetData(widgetId, data) {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([STORE_WIDGETS], 'readwrite');
        const store = tx.objectStore(STORE_WIDGETS);
        const req = store.put({ id: widgetId, data, updatedAt: Date.now() });
        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e);
      } catch (e) {
        reject(e);
      }
    });
  }

  async getAppData(key) {
    await this.initPromise;
    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([STORE_APP_DATA], 'readonly');
        const store = tx.objectStore(STORE_APP_DATA);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ? req.result.val : null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async saveAppData(key, val) {
    await this.initPromise;
    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([STORE_APP_DATA], 'readwrite');
        const store = tx.objectStore(STORE_APP_DATA);
        const req = store.put({ key, val, updatedAt: Date.now() });
        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e);
      } catch (e) {
        reject(e);
      }
    });
  }
}

// 导出单例
window.storageDB = new StorageManager();
