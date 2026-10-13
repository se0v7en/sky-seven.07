/* ============================================
   四页翻页 · 动态时间 · 音乐
   （所有文字/图片都只能在 HTML 中修改）
   ============================================ */
(function () {
  'use strict';

  const slides   = document.querySelectorAll('.slide');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const pageName = document.getElementById('pageName');
  const bgm      = document.getElementById('bgm');
  const musicBtn = document.getElementById('musicBtn');

  let current = 0;
  const total = slides.length;

  /* ---------- 翻页 ---------- */
  function goTo(index) {
    if (index < 0 || index >= total) return;
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    current = index;

    // 更新顶部右侧页名
    pageName.textContent = slides[index].dataset.name || '';

    // 更新按钮禁用状态
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    // 切换后滚动到顶部
    slides[index].scrollTop = 0;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  /* ---------- 键盘方向键 ---------- */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
  });

  /* ---------- 动态时间（Aug 2020 自动变化） ---------- */
  function updateDate() {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const el = document.getElementById('dynamicDate');
    if (el) el.textContent = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  }
  updateDate();

  /* ---------- 音乐播放 / 暂停 ---------- */
  musicBtn.addEventListener('click', () => {
    if (bgm.paused) {
      bgm.play().then(() => {
        musicBtn.textContent = '❚❚';
      }).catch(() => {
        // 浏览器阻止自动播放时，不做处理
      });
    } else {
      bgm.pause();
      musicBtn.textContent = '▶';
    }
  });
  bgm.addEventListener('play',  () => { musicBtn.textContent = '❚❚'; });
  bgm.addEventListener('pause', () => { musicBtn.textContent = '▶'; });

  /* ---------- 初始化 ---------- */
  goTo(0);
})();
