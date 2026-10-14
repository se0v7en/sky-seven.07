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
    // 新增边界拦截：当前页重复点击直接返回，避免无效执行
    if (index < 0 || index >= total || index === current) return;
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

  // 新增DOM非空判断，避免元素缺失时报错中断
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  /* ============================================
     键盘方向键翻页
     ============================================ */
  document.addEventListener('keydown', e => {
    // 新增输入框场景判断，避免输入文字时误触翻页
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
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
  // 新增每分钟自动刷新时间，避免长时间打开页面时间显示滞后
  setInterval(updateDate, 60 * 1000);

  /* ============================================
     音乐：播放 / 暂停
     ============================================ */
  if (musicBtn) musicBtn.addEventListener('click', () => {
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
  // 新增音乐循环播放
  bgm.loop = true;

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
