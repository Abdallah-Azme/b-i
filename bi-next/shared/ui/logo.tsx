'use client';

import React from 'react';

const FALLBACK_IMAGE = "https://b3businessbrokers.com/wp-content/uploads/2024/05/AdobeStock_157565392-min.jpeg";

export const Logo: React.FC<{ className?: string, light?: boolean }> = ({ className = "w-12 h-12" }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src="https://raiyansoft.com/wp-content/uploads/2025/12/bni-icon.png" 
      onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = FALLBACK_IMAGE; }}
      alt="B&I Logo" 
      className={`${className} object-contain`}
      loading="eager"
    />
  );
};
