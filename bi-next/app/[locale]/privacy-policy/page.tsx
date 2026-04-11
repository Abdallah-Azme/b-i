import React from 'react';
import { PrivacyPolicyContent } from '@/features/legal/ui/privacy-policy-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const isAr = (await params).locale === 'ar';
  return {
    title: isAr ? 'سياسة الخصوصية' : 'Privacy Policy',
    description: isAr ? 'سياسة الخصوصية وحماية البيانات في منصة B&I.' : 'Privacy policy and data protection at B&I investment platform.'
  };
}

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PrivacyPolicyContent />
    </main>
  );
}

