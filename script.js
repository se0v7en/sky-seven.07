/* ============================================
   四页翻页 · 动态时间 · 音乐（含自动播放）
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

  /* ============================================
     翻页
     ============================================ */
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

  /* ============================================
     键盘方向键翻页
     ============================================ */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
  });

  /* ============================================
     动态时间（第二页 Aug 2020 自动变化）
     ============================================ */
  function updateDate() {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const el = document.getElementById('dynamicDate');
    if (el) el.textContent = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  }
  updateDate();

  /* ============================================
     音乐：播放 / 暂停
     ============================================ */
  musicBtn.addEventListener('click', () => {
    if (bgm.paused) {
      bgm.play().then(() => {
        musicBtn.textContent = '❚❚';
      }).catch(() => {
        // 浏览器阻止播放时不处理
      });
    } else {
      bgm.pause();
      musicBtn.textContent = '▶';
    }
  });

  bgm.addEventListener('play',  () => { musicBtn.textContent = '❚❚'; });
  bgm.addEventListener('pause', () => { musicBtn.textContent = '▶'; });

  /* ============================================
     音乐：自动播放尝试
     1) 页面加载时先尝试自动播放
     2) 若被浏览器拦截，用户第一次点击任意位置时再播放
     ============================================ */
  window.addEventListener('load', () => {
    bgm.play().then(() => {
      musicBtn.textContent = '❚❚';
    }).catch(() => {
      // 被拦截 → 等用户第一次点击页面时播放
      document.addEventListener('click', function autoPlayOnce() {
        if (bgm.paused) {
          bgm.play().then(() => {
            musicBtn.textContent = '❚❚';
          }).catch(() => {});
        }
        document.removeEventListener('click', autoPlayOnce);
      }, { once: true });
    });
  });

  /* ============================================
     初始化
     ============================================ */
  goTo(0);

})();
