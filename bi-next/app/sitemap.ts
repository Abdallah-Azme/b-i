import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/features/projects/services/project-api';

const BASE_URL = 'https://bi-next.vercel.app';
const LOCALES = ['en', 'ar'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/projects',
    '/investors',
    '/pricing',
    '/about',
    '/terms-of-use',
    '/privacy-policy',
  ];

  const categoryRoutes = CATEGORIES.map((cat) => `/projects?cat=${cat.en}`);

  const allRoutes = [...routes, ...categoryRoutes];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  allRoutes.forEach((route) => {
    LOCALES.forEach((locale) => {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
