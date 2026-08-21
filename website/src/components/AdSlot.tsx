import React, { useEffect, useRef, useState } from 'react';

export type AdSlotType =
  | 'banner'
  | 'sidebar'
  | 'leaderboard'
  | 'rectangle'
  | 'vertical-left'
  | 'vertical-right'
  | 'mobile-sticky'
  | 'native';

interface AdSlotProps {
  type: AdSlotType;
  className?: string;
  style?: React.CSSProperties;
  slotId?: string;
  adSlotCode?: string;
}

interface AdsterraConfig {
  key?: string;
  width: number | string;
  height: number;
  isNative?: boolean;
}

const adsterraConfigs: Record<AdSlotType, AdsterraConfig> = {
  banner: { key: 'cbf0e7c7049bb443ec8a7de58ca6e2a0', width: 728, height: 90 },
  leaderboard: { key: 'cbf0e7c7049bb443ec8a7de58ca6e2a0', width: 728, height: 90 },
  'vertical-left': { key: '2bc424d050b9b9a279e71a20906c06d6', width: 160, height: 600 },
  'vertical-right': { key: '2bc424d050b9b9a279e71a20906c06d6', width: 160, height: 600 },
  'mobile-sticky': { key: '3b7d67b4de34f3b831874d19d46fb9dd', width: 320, height: 50 },
  rectangle: { key: '2f6aba3584aa57558be858426be86969', width: 300, height: 250 },
  sidebar: { key: '2f6aba3584aa57558be858426be86969', width: 300, height: 250 },
  native: { isNative: true, width: '100%', height: 250 },
};

const AdSlot: React.FC<AdSlotProps> = ({ type, className = '', style = {}, slotId }) => {
  const config = adsterraConfigs[type] || adsterraConfigs.banner;
  const containerRef = useRef<HTMLDivElement>(null);
  const [closedMobile, setClosedMobile] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    const w = typeof config.width === 'number' ? `${config.width}px` : config.width;
    iframe.style.width = w;
    iframe.style.height = `${config.height}px`;
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';

    container.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      if (config.isNative) {
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>body { margin: 0; padding: 0; background: transparent; }</style>
            </head>
            <body>
              <script async="async" data-cfasync="false" src="https://pl30949881.effectivecpmnetwork.com/2286c8f07427e27f0d634530b0e4453d/invoke.js"></script>
              <div id="container-2286c8f07427e27f0d634530b0e4453d"></div>
            </body>
          </html>
        `);
      } else {
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key': '${config.key}',
                  'format': 'iframe',
                  'height': ${config.height},
                  'width': ${config.width},
                  'params': {}
                };
              </script>
              <script type="text/javascript" src="https://www.highperformanceformat.com/${config.key}/invoke.js"></script>
            </body>
          </html>
        `);
      }
      doc.close();
    }
  }, [type, config]);

  if (type === 'mobile-sticky' && closedMobile) return null;

  if (type === 'vertical-left' || type === 'vertical-right') {
    return (
      <div
        className={`ad-slot-vertical ${className} hidden-gutter-mobile`}
        style={{
          position: 'relative',
          width: '160px',
          minHeight: '600px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          flexShrink: 0,
          marginTop: '3rem',
          ...style,
        }}
      >
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          ADVERTISEMENT
        </div>
        <div ref={containerRef} style={{ width: '160px', height: '600px' }} />
      </div>
    );
  }

  if (type === 'mobile-sticky') {
    return (
      <div
        className={`ad-slot-mobile-sticky ${className} visible-mobile-only`}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          zIndex: 9999,
          background: 'rgba(11, 9, 20, 0.95)',
          borderTop: '1px solid rgba(0, 84, 250, 0.3)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 12px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
          ...style,
        }}
      >
        <button
          onClick={() => setClosedMobile(true)}
          style={{
            position: 'absolute',
            top: '-24px',
            right: '12px',
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px 12px 0 0',
            padding: '2px 10px',
            fontSize: '0.65rem',
            cursor: 'pointer',
          }}
        >
          ✕ Close Ad
        </button>
        <div ref={containerRef} style={{ width: '320px', height: '50px' }} />
      </div>
    );
  }

  return (
    <div
      className={`ad-slot ${className}`}
      data-ad-slot={slotId || type}
      data-ad-type={type}
      style={{
        width: typeof config.width === 'number' ? `${config.width}px` : config.width,
        minHeight: `${config.height}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '8px',
        margin: '1rem auto',
        maxWidth: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
        ADVERTISEMENT
      </div>
      <div ref={containerRef} style={{ width: typeof config.width === 'number' ? `${config.width}px` : '100%', height: `${config.height}px`, display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
    </div>
  );
};

export default AdSlot;
