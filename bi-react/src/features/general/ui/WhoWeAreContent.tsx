import React from 'react';
import { useStore } from '../../../context/Store';
import { useWhoWeAre } from '../hooks/useWhoWeAre';

export const WhoWeAreContent: React.FC = () => {
  const { lang } = useStore();
  const { data: response, isLoading, isError } = useWhoWeAre();

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-red-500">
            {lang === 'en' ? 'Failed to load content. Please try again later.' : 'فشل تحميل المحتوى. يرجى المحاولة مرة أخرى لاحقاً.'}
          </p>
        </div>
      ) : (
        <div className="bg-brand-gray/20 border border-white/5 p-10 rounded-3xl backdrop-blur-sm shadow-2xl">
          <div 
            className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6 text-lg"
            dangerouslySetInnerHTML={{ __html: response?.data || '' }}
          />
        </div>
      )}
    </div>
  );
};
