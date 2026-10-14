/* ============================================
   四页翻页 · 动态时间 · 音乐（含自动播放兼容）
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
     翻页核心逻辑
     ============================================ */
  function goTo(index) {
    // 边界拦截：重复点击当前页直接返回，避免无效执行
    if (index < 0 || index >= total || index === current) return;
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    current = index;

    // 更新顶部页名
    pageName.textContent = slides[index].dataset.name || '';

    // 更新按钮禁用状态
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    // 切换后自动滚动到页面顶部
    slides[index].scrollTop = 0;
  }

  // DOM非空判断，避免元素缺失时报错中断
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  /* ============================================
     键盘方向键翻页
     ============================================ */
  document.addEventListener('keydown', e => {
    // 输入框/文本域内不触发翻页，避免输入时误触
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
  });

  /* ============================================
     动态时间自动更新
     ============================================ */
  function updateDate() {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const el = document.getElementById('dynamicDate');
    if (el) el.textContent = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  }
  updateDate();
  // 每分钟自动刷新时间，避免长时间打开页面时间滞后
  setInterval(updateDate, 60 * 1000);

  /* ============================================
     音乐播放/暂停控制
     ============================================ */
  if (musicBtn) musicBtn.addEventListener('click', () => {
    if (bgm.paused) {
      bgm.play().then(() => {
        musicBtn.textContent = '❚❚';
      }).catch(() => {
        // 浏览器拦截时静默处理
      });
    } else {
      bgm.pause();
      musicBtn.textContent = '▶';
    }
  });

  bgm.addEventListener('play',  () => { musicBtn.textContent = '❚❚'; });
  bgm.addEventListener('pause', () => { musicBtn.textContent = '▶'; });
  // 开启音乐循环播放
  bgm.loop = true;

  /* ============================================
     音乐自动播放兼容逻辑
     ============================================ */
  window.addEventListener('load', () => {
    bgm.play().then(() => {
      musicBtn.textContent = '❚❚';
    }).catch(() => {
      // 被浏览器拦截后，用户首次点击页面自动唤醒播放
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

  // 页面切后台自动暂停，切回页面自动恢复播放
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !bgm.paused) bgm.pause();
    else if (!document.hidden && musicBtn.textContent === '❚❚') bgm.play().catch(()=>{});
  });

  /* ============================================
     初始化
     ============================================ */
  goTo(0);

})();
