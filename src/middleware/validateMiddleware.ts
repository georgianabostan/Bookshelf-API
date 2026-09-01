import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

export const validate = (
    schema: ZodSchema,
    source: 'body' | 'query' | 'params' = 'body'
) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const data =
            source === 'body'
                ? req.body
                : source === 'query'
                    ? req.query
                    : req.params

        const result = schema.safeParse(data)

        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: result.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            })
        }

        if (source === 'body') {
            req.body = result.data
        }

        next()
    }
}