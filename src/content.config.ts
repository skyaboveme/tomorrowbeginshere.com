import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const updatesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/updates" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }).optional(),
    tags: z.array(z.string()),
    externalUrl: z.string().optional()
  })
});

export const collections = {
  'updates': updatesCollection,
};
