import { z } from 'zod'

export const addBookSchema = z.object({
    title: z.string(),

    author: z
        .string(),

    status: z
        .enum(['want', 'reading', 'done']),

    rating: z
        .number()
        .int()
        .min(0)
        .max(5)
        .default(0),

    cover_URL: z
        .string()
        .url()
        .optional()
})

export const GetBooksSchema = z.object({
    status: z
        .enum(['want', 'reading', 'done']).optional()
})

// title, author, status, rating, cover_URL