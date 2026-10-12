/* ============================================
   六页翻页个人主页
   功能：翻页 / 内容编辑 / 图片上传 / 音乐播放
   ============================================ */

(function () {
  'use strict';

  // ===== DOM 引用 =====
  const pages         = document.querySelectorAll('.page');
  const total         = pages.length;       // 6
  let   current       = 0;

  // ===== 初始化 =====
  function init() {
    restoreEditableText();
    restoreImages();
    restoreAvatars();
    restoreInkCardBg();
    restoreLinkLabels();
    restoreLinkUrls();
    bindEvents();
    showPage(0);
  }

  // ===== 翻页 =====
  function showPage(index) {
    if (index < 0 || index >= total) return;
    pages.forEach((p, i) => {
      p.classList.toggle('active', i === index);
    });
    current = index;
    // 每页滚动到顶部
    pages[index].scrollTop = 0;
  }

  window.goTo = function (index) {
    showPage(index);
  };

  // ===== 文字编辑：自动保存 =====
  function bindEvents() {
    // 文字输入保存
    document.addEventListener('input', function (e) {
      const el = e.target.closest('[data-key]');
      if (el) {
        localStorage.setItem('edit_' + el.dataset.key, el.textContent);
      }
      // 链接标题 input
      if (e.target.classList.contains('link-label-input')) {
        const key = 'linkLabel' + e.target.dataset.linkLabel;
        localStorage.setItem(key, e.target.value);
      }
    });

    // 键盘方向键翻页
    document.addEventListener('keydown', function (e) {
      if (document.activeElement && document.activeElement.isContentEditable) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault(); showPage(current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); showPage(current - 1);
      }
    });

    // 触摸滑动
    let touchStartX = 0;
    document.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 60) {
        if (dx < 0) showPage(current + 1);
        else        showPage(current - 1);
      }
    }, { passive: true });

    // 音乐按钮
    const bgm    = document.getElementById('bgm');
    const btn    = document.getElementById('musicBtn');
    btn.addEventListener('click', function () {
      if (bgm.paused) {
        bgm.play().catch(() => {});
        btn.textContent = '❚❚';
      } else {
        bgm.pause();
        btn.textContent = '▶';
      }
    });
    bgm.addEventListener('play',  () => { btn.textContent = '❚❚'; });
    bgm.addEventListener('pause', () => { btn.textContent = '▶'; });

    // 链接右键编辑 URL
    document.querySelectorAll('.link-card').forEach((card) => {
      card.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        const n = this.dataset.link;
        const cur = (this.href === '#' || this.href.endsWith('#')) ? '' : this.href;
        const url = prompt('输入链接地址（完整 URL）：', cur);
        if (url !== null) {
          this.href = url || '#';
          localStorage.setItem('linkUrl' + n, url || '#');
        }
      });
    });
  }

  // ===== 文字恢复 =====
  function restoreEditableText() {
    document.querySelectorAll('[data-key]').forEach(el => {
      const saved = localStorage.getItem('edit_' + el.dataset.key);
      if (saved !== null) el.textContent = saved;
    });
  }

  // ===== 头像上传 =====
  const avatarUploader = document.getElementById('avatarUploader');
  let   activeAvatarKey = null;

  window.uploadAvatar = function (n) {
    activeAvatarKey = 'avatar' + n;
    avatarUploader.click();
  };

  avatarUploader.addEventListener('change', function () {
    const file = this.files[0];
    if (!file || !activeAvatarKey) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.getElementById(activeAvatarKey);
      if (img) { img.src = e.target.result; img.classList.add('visible'); }
      localStorage.setItem('img_' + activeAvatarKey, e.target.result);
    };
    reader.readAsDataURL(file);
    this.value = '';
  });

  // ===== 图片上传 =====
  const imageUploader = document.getElementById('imageUploader');
  let   activeImageId  = null;

  window.uploadImage = function (pageNum, slotName) {
    activeImageId = 'img_p' + pageNum + '_' + slotName;
    imageUploader.click();
  };

  imageUploader.addEventListener('change', function () {
    const file = this.files[0];
    if (!file || !activeImageId) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.getElementById(activeImageId);
      if (img) { img.src = e.target.result; img.classList.add('visible'); }
      localStorage.setItem('img_' + activeImageId, e.target.result);
    };
    reader.readAsDataURL(file);
    this.value = '';
  });

  // ===== 恢复头像 =====
  function restoreAvatars() {
    [1].forEach(n => {
      const data = localStorage.getItem('img_avatar' + n);
      if (data) {
        const img = document.getElementById('avatar' + n);
        if (img) { img.src = data; img.classList.add('visible'); }
      }
    });
  }

  // ===== 恢复图片 =====
  function restoreImages() {
    const allIds = [
      'img_p2_img1', 'img_p2_img2',
      'img_p3_back', 'img_p3_front',
      'img_p4_main',
      'img_p5_a', 'img_p5_b', 'img_p5_c', 'img_p5_d'
    ];
    allIds.forEach(id => {
      const data = localStorage.getItem('img_' + id);
      if (data) {
        const img = document.getElementById(id);
        if (img) { img.src = data; img.classList.add('visible'); }
      }
    });
  }

  // ===== 恢复水墨卡片背景图 =====
  function restoreInkCardBg() {
    const bg1 = localStorage.getItem('inkCardBg1');
    if (bg1) {
      const el = document.getElementById('inkCardBg1');
      if (el) {
        el.style.backgroundImage = `url(${bg1})`;
        el.classList.add('has-image');
      }
    }
  }

  // ===== 恢复链接标签 & URL =====
  function restoreLinkLabels() {
    document.querySelectorAll('.link-label-input').forEach(input => {
      const saved = localStorage.getItem('linkLabel' + input.dataset.linkLabel);
      if (saved !== null) input.value = saved;
    });
  }

  function restoreLinkUrls() {
    document.querySelectorAll('.link-card').forEach(card => {
      const saved = localStorage.getItem('linkUrl' + card.dataset.link);
      if (saved) card.href = saved;
    });
  }

  // ===== 启动 =====
  init();

})();
