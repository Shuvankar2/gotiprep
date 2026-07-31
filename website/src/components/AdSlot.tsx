import React, { useEffect, useRef, useState } from 'react';

export type AdSlotType =
  | 'banner'
  | 'sidebar'
  | 'leaderboard'
  | 'rectangle'
  | 'vertical-left'
  | 'vertical-right'
  | 'mobile-sticky';

interface AdSlotProps {
  type: AdSlotType;
  className?: string;
  style?: React.CSSProperties;
  slotId?: string;
  adSlotCode?: string;
}

const PUBLISHER_ID = 'ca-pub-3063786907196879';

const dimensions: Record<AdSlotType, { width: string | number; height: number }> = {
  banner: { width: '100%', height: 90 },
  sidebar: { width: '100%', height: 250 },
  leaderboard: { width: '100%', height: 90 },
  rectangle: { width: 336, height: 280 },
  'vertical-left': { width: 160, height: 600 },
  'vertical-right': { width: 160, height: 600 },
  'mobile-sticky': { width: '100%', height: 60 },
};

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

const AdSlot: React.FC<AdSlotProps> = ({ type, className = '', style = {}, slotId, adSlotCode }) => {
  const dim = dimensions[type];
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);
  const [closedMobile, setClosedMobile] = useState(false);

  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current && !pushedRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch {
      /* ignore adblocker errors gracefully */
    }
  }, []);

  if (type === 'mobile-sticky' && closedMobile) return null;

  // Non-Overlapping Desktop Vertical Skyscraper Gutter Ads
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
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '160px', minHeight: '600px' }}
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={adSlotCode || '4087835658'}
          data-ad-format="vertical"
        />
      </div>
    );
  }

  // Mobile Sticky Bottom Banner
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
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '50px' }}
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={adSlotCode || '4087835658'}
          data-ad-format="horizontal"
        />
      </div>
    );
  }

  // Standard Banner / Sidebar / Leaderboard / Rectangle In-Feed Ads
  return (
    <div
      className={`ad-slot ${className}`}
      data-ad-slot={slotId || type}
      data-ad-type={type}
      style={{
        width: dim.width,
        minHeight: dim.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '8px',
        margin: '1rem 0',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
        ADVERTISEMENT
      </div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: dim.height }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={adSlotCode || '4087835658'}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSlot;
