/**
 * 自定义编辑弹窗与大容量图片无损转存核心逻辑
 */
class EditModal {
  constructor() {
    this.backdrop = document.getElementById('edit-modal-backdrop');
    this.card = document.getElementById('edit-modal-card');
    this.titleEl = document.getElementById('modal-title');
    this.bodyEl = document.getElementById('modal-body');
    this.closeBtn = document.getElementById('modal-close-btn');
    this.saveBtn = document.getElementById('modal-save-btn');
    this.resetBtn = document.getElementById('modal-reset-btn');

    this.currentConfig = null;
    this.formData = {};

    this.init();
  }

  init() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) this.close();
    });

    this.saveBtn.addEventListener('click', () => {
      if (this.currentConfig && this.currentConfig.onSave) {
        this.currentConfig.onSave(this.formData);
      }
      this.close();
    });

    this.resetBtn.addEventListener('click', () => {
      if (this.currentConfig && this.currentConfig.onReset) {
        this.currentConfig.onReset();
      }
      this.close();
    });
  }

  open(config) {
    this.currentConfig = config;
    this.titleEl.textContent = config.title || '自定义编辑';
    this.formData = {};
    this.bodyEl.innerHTML = '';

    config.fields.forEach((field) => {
      this.formData[field.id] = field.value || '';

      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';

      const label = document.createElement('label');
      label.className = 'form-label';
      label.textContent = field.label;
      formGroup.appendChild(label);

      if (field.type === 'image') {
        // 无损大图上传器
        const wrapper = document.createElement('div');
        wrapper.className = 'image-upload-wrapper';

        const previewBox = document.createElement('div');
        previewBox.className = 'image-preview-box';
        const img = document.createElement('img');
        img.src = field.value || '';
        previewBox.appendChild(img);

        const btnGroup = document.createElement('div');
        btnGroup.className = 'image-upload-btn-group';

        const uploadLabel = document.createElement('label');
        uploadLabel.className = 'custom-file-upload';
        uploadLabel.innerHTML = `选择图片文件 <input type="file" accept="image/*">`;

        const fileInput = uploadLabel.querySelector('input');
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            // 使用 FileReader 读取完整无损 Base64 / Blob
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64Data = event.target.result;
              this.formData[field.id] = base64Data;
              img.src = base64Data;
            };
            reader.readAsDataURL(file);
          }
        });

        const hint = document.createElement('span');
        hint.className = 'upload-hint';
        hint.textContent = 'IndexedDB 大容量无损存储，支持高清原图';

        btnGroup.appendChild(uploadLabel);
        btnGroup.appendChild(hint);

        wrapper.appendChild(previewBox);
        wrapper.appendChild(btnGroup);
        formGroup.appendChild(wrapper);

      } else if (field.type === 'textarea') {
        const textarea = document.createElement('textarea');
        textarea.className = 'form-textarea';
        textarea.value = field.value || '';
        textarea.addEventListener('input', (e) => {
          this.formData[field.id] = e.target.value;
        });
        formGroup.appendChild(textarea);

      } else {
        const input = document.createElement('input');
        input.type = field.type || 'text';
        input.className = 'form-input';
        input.value = field.value || '';
        input.addEventListener('input', (e) => {
          this.formData[field.id] = e.target.value;
        });
        formGroup.appendChild(input);
      }

      this.bodyEl.appendChild(formGroup);
    });

    this.backdrop.classList.remove('hidden');
  }

  close() {
    this.backdrop.classList.add('hidden');
    this.currentConfig = null;
  }
}

window.editModal = new EditModal();

// 全局 Toast
window.showToast = function(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2200);
};
