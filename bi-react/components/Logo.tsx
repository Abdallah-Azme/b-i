
import React from 'react';
import { FALLBACK_IMAGE } from '../constants';

export const Logo: React.FC<{ className?: string, light?: boolean }> = ({ className = "w-12 h-12" }) => {
  return (
    <img 
      src="https://raiyansoft.com/wp-content/uploads/2025/12/bni-icon.png" 
      onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = FALLBACK_IMAGE; }}
      alt="B&I Logo" 
      className={`${className} object-contain`}
      loading="eager"
    />
  );
};
