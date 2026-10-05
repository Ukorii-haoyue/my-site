import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const bakeDiary = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/bake-diary' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		mainImage: z.string(),
		description: z.string(),
		recipeDetails: z.string().optional(),
		tags: z.array(z.string()),
		featured: z.boolean().default(false),
	}),
});

export const collections = { 'bake-diary': bakeDiary };
