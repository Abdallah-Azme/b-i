import React from 'react';
import { Shield } from 'lucide-react';
import { useStore } from '../../../context/Store';
import { useTermsAndConditions } from '../hooks/useTermsAndConditions';

export const TermsAndConditionsContent: React.FC = () => {
  const { lang } = useStore();
  const { data: response, isLoading, isError } = useTermsAndConditions();

  return (
    <div className="bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <Shield className="text-brand-gold w-10 h-10" />
        <h1 className="text-3xl font-bold text-white">
          {lang === 'en' ? 'Terms & Conditions' : 'الشروط والأحكام'}
        </h1>
      </div>

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
        <div 
          className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: response?.data || '' }}
        />
      )}
    </div>
  );
};
