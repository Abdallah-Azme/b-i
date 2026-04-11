import React from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { AboutContent } from '@/features/marketing/ui/about-content';
import { Language } from '@/shared/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations('aboutPage');
  const isAr = (await params).locale === 'ar';
  return {
    title: isAr ? 'عن المنصة' : 'About B&I',
    description: t('intro')
  };
}

export default async function AboutPage() {
  const locale = await getLocale() as Language;
  
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const sections = messages.aboutPage.sections;

  return (
    <AboutContent sections={sections} />
  );
}
