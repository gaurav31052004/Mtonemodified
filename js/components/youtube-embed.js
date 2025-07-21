import { partnerService } from '/js/services/partner-service.js';

export async function setupYoutubeEmbed() {
  const container = document.getElementById('yt-video-container');
  const thumbWrapper = document.getElementById('yt-thumbnail-wrapper');
  const thumbImg = document.getElementById('yt-thumbnail');
  const playBtn = document.getElementById('yt-play-btn');
  if (!container || !thumbWrapper || !thumbImg || !playBtn) return;

  try {
    const ytRes = await partnerService.getYoutubeLinkFromAPI();
    const ytUrl = ytRes?.data?.value;
    if (!ytUrl) return;
    // Extract video ID
    const match = ytUrl.match(/[?&]v=([^&#]+)/) || ytUrl.match(/youtu\.be\/([^?&#]+)/);
    const videoId = match ? match[1] : null;
    if (!videoId) return;
    // Set thumbnail
    thumbImg.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    thumbImg.style.display = 'block';
    playBtn.style.display = 'flex';

    // On click, replace with iframe
    thumbWrapper.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.className = 'w-full h-full rounded-3xl';
      iframe.style.minHeight = '320px';
      iframe.style.minWidth = '320px';
      thumbWrapper.replaceWith(iframe);
    }, { once: true });
  } catch (e) {
    // fallback: show nothing
  }
}
