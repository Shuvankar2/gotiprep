import React from 'react';

interface AdSlotProps {
  type: 'banner' | 'sidebar' | 'leaderboard' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
  slotId?: string;
}

const dimensions = {
  banner: { width: '100%', height: 90 },
  sidebar: { width: 300, height: 250 },
  leaderboard: { width: '100%', height: 90 },
  rectangle: { width: 336, height: 280 },
};

/**
 * AdSlot component — placeholder for Google AdSense units.
 * Replace the inner div with actual AdSense <ins> tags when going live.
 * All ad slots are data-attribute tagged for easy identification.
 */
const AdSlot: React.FC<AdSlotProps> = ({ type, className = '', style = {}, slotId }) => {
  const dim = dimensions[type];

  return (
    <div
      className={`ad-slot ${className}`}
      data-ad-slot={slotId || type}
      data-ad-type={type}
      style={{
        width: dim.width,
        height: dim.height,
        ...style,
      }}
    >
      {/* 
        === ADSENSE INTEGRATION POINT ===
        Replace this div content with actual AdSense code:
        
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        
        And add to index.html <head>:
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
      */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: 2 }}>Advertisement</div>
        <div style={{ fontSize: '0.65rem', opacity: 0.35 }}>{dim.width}×{dim.height}</div>
      </div>
      <span className="ad-slot-label">Ad</span>
    </div>
  );
};

export default AdSlot;
