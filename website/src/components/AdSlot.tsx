import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  type: 'banner' | 'sidebar' | 'leaderboard' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
  slotId?: string;
  adSlotCode?: string; // Optional custom AdSense slot unit ID
}

const PUBLISHER_ID = 'ca-pub-3063786907196879';

const dimensions = {
  banner: { width: '100%', height: 90 },
  sidebar: { width: 300, height: 250 },
  leaderboard: { width: '100%', height: 90 },
  rectangle: { width: 336, height: 280 },
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

  return (
    <div
      className={`ad-slot ${className}`}
      data-ad-slot={slotId || type}
      data-ad-type={type}
      style={{
        width: dim.width,
        minHeight: dim.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: dim.height }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={adSlotCode || '4087835658'}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <span className="ad-slot-label" style={{ position: 'absolute', top: 4, right: 8, fontSize: '0.6rem', opacity: 0.4 }}>Ad</span>
    </div>
  );
};

export default AdSlot;
