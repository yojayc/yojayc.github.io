document.addEventListener('DOMContentLoaded', function () {
  if (!window.location.pathname.match(/^\/(index.html)?$/)) return;

  // ==============================================
  // 1. 插入背景视频
  // ==============================================
  const banner = document.getElementById('banner');
  if (!banner) return;

  const videoWrap = document.createElement('div');
  videoWrap.id = 'banner-video-wrap';

  const video = document.createElement('video');
  video.id = 'banner-video';
  video.src = '/video/hahahahaha.webm'; // 你的视频路径
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';

  videoWrap.appendChild(video);
  banner.prepend(videoWrap);

  // ==============================================
  // 2. 打印机打字效果
  // ==============================================
  function typeText(el, text, speed = 120) {
    let i = 0;
    el.innerHTML = '';
    const cursor = '<span class="typing-cursor">|</span>';

    function typing() {
      if (i < text.length) {
        el.innerHTML = text.substring(0, i + 1) + cursor;
        i++;
        setTimeout(typing, speed);
      } else {
        el.innerHTML = text + cursor;
      }
    }
    typing();
  }

  // 找到 Fluid 默认标题
  const title = document.querySelector('.page-header .display-4');
  const subtitle = document.querySelector('.page-header .text-muted');

  if (title) {
    const titleText = title.innerText;
    typeText(title, titleText, 100);
  }

  setTimeout(() => {
    if (subtitle) {
      const subText = subtitle.innerText;
      typeText(subtitle, subText, 80);
    }
  }, 1500);
});