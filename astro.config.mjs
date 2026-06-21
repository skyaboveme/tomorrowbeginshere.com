// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://tomorrowbeginshere.com',

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare({
    platformProxy: { enabled: true }
  }),

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/join'),
      changefreq: 'weekly',
      priority: 0.7,
      customPages: [
        'https://tomorrowbeginshere.com/',
        'https://tomorrowbeginshere.com/myth-vs-reality',
        'https://tomorrowbeginshere.com/what-is-a-data-center',
        'https://tomorrowbeginshere.com/water-usage',
        'https://tomorrowbeginshere.com/closed-loop-cooling',
        'https://tomorrowbeginshere.com/energy-prices',
        'https://tomorrowbeginshere.com/economic-impact',
        'https://tomorrowbeginshere.com/data-center-backlash',
        'https://tomorrowbeginshere.com/bastrop-county-story',
        'https://tomorrowbeginshere.com/faq',
        'https://tomorrowbeginshere.com/updates',
      ]
    })
  ]
});