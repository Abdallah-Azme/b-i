import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import {notFound} from 'next/navigation';

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as 'en' | 'ar')) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
