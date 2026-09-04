/**
 * IndexedDB 大容量无损本地数据库存储引擎
 * 解决 localStorage 5MB 上限和图片压缩失真问题
 * 支持存储大容量高清 Blob/DataURL 及全量配置
 */
const DB_NAME = 'QiqiPhoneDB';
const DB_VERSION = 1;
const STORE_NAME = 'widget_store';

class StorageEngine {
  constructor() {
    this.db = null;
    this.readyPromise = this.init();
  }

  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
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

  async setItem(key, value) {
    await this.readyPromise;
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ key, value, updatedAt: Date.now() });

        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getItem(key, defaultValue = null) {
    await this.readyPromise;
    return new Promise((resolve) => {
      try {
        const transaction = this.db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = (e) => {
          if (e.target.result) {
            resolve(e.target.result.value);
          } else {
            resolve(defaultValue);
          }
        };

        request.onerror = () => resolve(defaultValue);
      } catch (err) {
        console.warn('读取存储失败，返回默认值', err);
        resolve(defaultValue);
      }
    });
  }

  async removeItem(key) {
    await this.readyPromise;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }
}

// 导出全局单例
window.storageEngine = new StorageEngine();
