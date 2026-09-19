import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    author: z.string().default('Your Name'),
    authorInitials: z.string().default('YN'),
    authorRole: z.string().default('developer · writer'),
    accent: z.enum(['cyan', 'indigo', 'purple']).default('cyan'),
  }),
});

export const collections = { blog };
