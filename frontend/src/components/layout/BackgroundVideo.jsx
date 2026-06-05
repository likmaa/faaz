import React, { useEffect, useRef, useState } from 'react';

/**
 * Fullscreen background video with lazy loading and accessibility fallbacks.
 * - Autoplay, muted, loop, playsInline (required for iOS)
 * - Optional poster image until video is ready
 * - Respects prefers-reduced-motion (shows poster only)
 * - Lazy loads when entering viewport
 */
export default function BackgroundVideo({
  mp4Src = '/video/kk1_1280.mp4',
  webmSrc = '/video/kk1_1280.webm',
  poster = '/img/caroussel.jpg',
  overlay = 'bg-black/20'
}) {
  const videoRef = useRef(null);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const el = videoRef.current;
    if (!el) return;

    // Lazy-load when visible
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            try {
              el.preload = 'auto';
              el.load();
              setShouldPlay(true);
              const playPromise = el.play();
              if (playPromise && typeof playPromise.then === 'function') {
                playPromise.catch(() => {
                  // On échec autoplay, on laisse shouldPlay mais on ne crash pas
                  console.warn('[BackgroundVideo] Autoplay bloqué, interaction requise.');
                });
              }
            } catch (e) {
              console.warn('[BackgroundVideo] play error', e);
            }
            io.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mime = (src) => {
    if (!src) return undefined;
    const s = src.toLowerCase();
    if (s.endsWith('.webm')) return 'video/webm';
    if (s.endsWith('.mp4')) return 'video/mp4';
    if (s.endsWith('.mov')) return 'video/quicktime';
    return undefined;
  };

  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      {!failed && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(1.4) contrast(1.05) brightness(0.95)' }}
          autoPlay
          muted
          loop
          playsInline
          poster={poster || undefined}
          preload="none"
          onLoadedData={() => { setLoaded(true); }}
          onError={(e) => { console.error('[BackgroundVideo] erreur de chargement', e); setFailed(true); }}
        >
          {webmSrc ? <source src={webmSrc} type={mime(webmSrc)} /> : null}
          {mp4Src ? <source src={mp4Src} type={mime(mp4Src)} /> : null}
          Votre navigateur ne supporte pas la vidéo HTML5.
        </video>
      )}
      {failed && (
        <div className="w-full h-full object-cover bg-gray-900 flex items-center justify-center text-white text-sm">
          <span>Vidéo indisponible – veuillez réencoder (H.264 MP4 + faststart) / fournir WebM.</span>
        </div>
      )}
      {overlay ? <div className={`absolute inset-0 pointer-events-none ${overlay}`} /> : null}
    </div>
  );
}
