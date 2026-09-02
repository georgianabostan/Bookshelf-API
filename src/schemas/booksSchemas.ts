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

export const getBooksSchema = z.object({
    status: z
        .enum(['want', 'reading', 'done']).optional()
})

export const deleteBooksSchema = z.object({
    id: z
        .string().uuid()
})

export const updateBookParamsSchema = z.object({
    id: z.string().uuid()
})

export const updateBookBodySchema = z.object({
    status: z
        .enum(['want', 'reading', 'done'])
        .optional(),

    rating: z
        .number()
        .int()
        .min(0)
        .max(5)
        .optional()
})
// title, author, status, rating, cover_URL