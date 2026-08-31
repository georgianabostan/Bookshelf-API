import { z } from 'zod'

export const registerSchema = z.object({
    email: z
        .string()
        .email('Invalid email address'),

    password: z
        .string()
        .min(6, 'Password must contain at least 6 characters'),

    role: z
        .string()
        .min(1, 'Role is required')
})

export const loginSchema = z.object({
    email: z
        .string()
        .email('Invalid email address'),

    password: z
        .string()
        .min(1, 'Password is required')
})