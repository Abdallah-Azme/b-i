import React from 'react';
import { TermsOfUseContent } from '@/features/legal/ui/terms-of-use-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const isAr = (await params).locale === 'ar';
  return {
    title: isAr ? 'شروط الاستخدام' : 'Terms of Use',
    description: isAr ? 'شروط وأحكام استخدام منصة B&I للاستثمار.' : 'Terms and conditions for using the B&I investment platform.'
  };
}

export default function TermsOfUsePage() {
  return (
    <main>
      <TermsOfUseContent />
    </main>
  );
}

