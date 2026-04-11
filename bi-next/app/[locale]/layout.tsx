import {NextIntlClientProvider, AbstractIntlMessages} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {ReactNode} from 'react';
import {Alexandria} from 'next/font/google';
import '../globals.css';
import Providers from '@/shared/ui/providers';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import {TopNavbar} from '@/shared/ui/top-navbar';
import {Footer} from '@/shared/ui/footer';
import {MobileNavbar} from '@/shared/ui/mobile-navbar';
import {Language} from '@/shared/types';

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-alexandria',
});

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const isEn = locale === 'en';
  
  const title = isEn ? 'B&I | The Exclusive Investment Ecosystem' : 'الأعمال والاستثمارات | منصة الاستثمار الحصرية';
  const description = isEn 
    ? 'The exclusive ecosystem for secure business investments in Kuwait and beyond. Buy and sell businesses, or find your next strategic partner.' 
    : 'النظام البيئي الحصري للاستثمارات التجارية الآمنة في الكويت وخارجها. بيع وسحب الأعمال، أو ابحث عن شريكك الاستراتيجي القادم.';

  return {
    title: {
      default: title,
      template: `%s | ${isEn ? 'B&I' : 'الأعمال والاستثمارات'}`
    },
    description,
    keywords: ['investment', 'business for sale', 'kuwait', 'startups', 'capital', 'استثمار', 'مشاريع للبيع', 'الكويت', 'ريادة أعمال'],
    authors: [{ name: 'B&I Team' }],
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
    openGraph: {
      title,
      description,
      url: 'https://bi-next.vercel.app',
      siteName: 'Business & Investments',
      locale: locale === 'ar' ? 'ar_KW' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as Language)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={alexandria.variable}>
      <body className="bg-brand-black text-white selection:bg-brand-gold selection:text-black antialiased">
        <NextIntlClientProvider messages={messages as AbstractIntlMessages} locale={locale}>
          <Providers>
            <div className="min-h-screen bg-brand-black flex flex-col text-white transition-all duration-300 font-alexandria">
              <TopNavbar />
              <main className="grow pt-20 pb-24 md:pb-0">
                {children}
              </main>
              <Footer />
              <MobileNavbar />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
