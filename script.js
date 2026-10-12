/* ============================================
   六页翻页 · 自动缩放画布 · 内容编辑 · 音乐
   ============================================ */
(function () {
  const DESIGN_W = 800;
  const DESIGN_H = 600;

  const viewport = document.getElementById('viewport');
  const slides   = document.querySelectorAll('.slide');
  let cur = 0;

  /* ============================================
     ★ 核心：把 800×600 画布等比缩放进屏幕
     - 保持 4:3，短边贴边，长边留白
     - 四周留 16px 呼吸空间
     ============================================ */
  function fitViewport() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = 16;                                   // 四周留白
    const scale = Math.min(
      (vw - padding * 2) / DESIGN_W,
      (vh - padding * 2) / DESIGN_H
    );
    viewport.style.transform = `scale(${scale})`;
  }

  window.addEventListener('resize', fitViewport);
  window.addEventListener('orientationchange', fitViewport);
  fitViewport();

  /* ============================================
     翻页
     ============================================ */
  window.goTo = function (i) {
    if (i < 0 || i >= slides.length) return;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    cur = i;
  };

  document.addEventListener('keydown', e => {
    if (document.activeElement && document.activeElement.isContentEditable) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(cur + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); goTo(cur - 1); }
  });

  // 触屏滑动
  let tX = 0;
  document.addEventListener('touchstart', e => tX = e.touches[0].clientX, { passive: true });
  document.addEventListener('touchend', e => {
    const d = e.changedTouches[0].clientX - tX;
    if (Math.abs(d) > 60) goTo(cur + (d < 0 ? 1 : -1));
  }, { passive: true });

  /* ============================================
     文字自动保存 / 恢复
     ============================================ */
  document.addEventListener('input', e => {
    const el = e.target.closest('[data-key]');
    if (el) localStorage.setItem('edit_' + el.dataset.key, el.textContent);
    if (e.target.classList.contains('link-label')) {
      localStorage.setItem('linkLabel' + e.target.dataset.linkLabel, e.target.value);
    }
  });
  document.querySelectorAll('[data-key]').forEach(el => {
    const v = localStorage.getItem('edit_' + el.dataset.key);
    if (v !== null) el.textContent = v;
  });
  document.querySelectorAll('.link-label').forEach(inp => {
    const v = localStorage.getItem('linkLabel' + inp.dataset.linkLabel);
    if (v !== null) inp.value = v;
  });

  /* ============================================
     头像上传
     ============================================ */
  const avUp = document.getElementById('avatarUploader');
  let curAv = null;
  window.uploadAvatar = n => { curAv = 'avatar' + n; avUp.click(); };
  avUp.addEventListener('change', function () {
    const f = this.files[0]; if (!f || !curAv) return;
    const r = new FileReader();
    r.onload = e => {
      const img = document.getElementById(curAv);
      if (img) { img.src = e.target.result; img.classList.add('visible'); }
      localStorage.setItem('img_' + curAv, e.target.result);
    };
    r.readAsDataURL(f); this.value = '';
  });

  /* ============================================
     图片上传
     ============================================ */
  const imUp = document.getElementById('imageUploader');
  let curIm = null;
  window.uploadImage = (p, s) => { curIm = 'img_p' + p + '_' + s; imUp.click(); };
  imUp.addEventListener('change', function () {
    const f = this.files[0]; if (!f || !curIm) return;
    const r = new FileReader();
    r.onload = e => {
      const img = document.getElementById(curIm);
      if (img) { img.src = e.target.result; img.classList.add('visible'); }
      localStorage.setItem('img_' + curIm, e.target.result);
    };
    r.readAsDataURL(f); this.value = '';
  });

  // 恢复所有图片 / 头像
  ['avatar1','avatar2',
   'img_p2_big','img_p2_side',
   'img_p3_back','img_p3_front',
   'img_p4_mini1','img_p4_mini2','img_p4_mini3','img_p4_tall','img_p4_side',
   'img_p5_i1','img_p5_i2','img_p5_i3','img_p5_i4',
   'img_p6_i1','img_p6_i2','img_p6_i3'
  ].forEach(id => {
    const v = localStorage.getItem('img_' + id);
    if (!v) return;
    const img = document.getElementById(id);
    if (img) { img.src = v; img.classList.add('visible'); }
  });

  /* ============================================
     链接地址（右键/长按编辑）
     ============================================ */
  document.querySelectorAll('.link-card').forEach(c => {
    c.addEventListener('contextmenu', e => {
      e.preventDefault();
      const n = c.dataset.link;
      const curUrl = (c.href === '#' || c.href.endsWith('#')) ? '' : c.href;
      const url = prompt('输入链接地址（完整 URL）：', curUrl);
      if (url !== null) {
        c.href = url || '#';
        localStorage.setItem('linkUrl' + n, url || '#');
      }
    });
    const saved = localStorage.getItem('linkUrl' + c.dataset.link);
    if (saved) c.href = saved;
  });

  /* ============================================
     音乐
     ============================================ */
  const bgm = document.getElementById('bgm');
  const mBtn = document.getElementById('musicBtn');
  mBtn.addEventListener('click', () => {
    if (bgm.paused) { bgm.play().catch(()=>{}); mBtn.textContent = '❚❚'; }
    else { bgm.pause(); mBtn.textContent = '▶'; }
  });
  bgm.addEventListener('play', () => mBtn.textContent = '❚❚');
  bgm.addEventListener('pause', () => mBtn.textContent = '▶');

  goTo(0);
})();
