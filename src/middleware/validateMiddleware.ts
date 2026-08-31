import type {Request,Response, NextFunction} from 'express'
import type { ZodSchema } from 'zod'

// legatura dintre request si Zod
export const validate = (schema: ZodSchema) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.body)

        if (!result.success) {

            return res.status(400).json({
                message: 'Validation failed',
                errors: result.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            })
        }

        req.body = result.data

        next()
    }
}