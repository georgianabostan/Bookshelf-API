import type { Request, Response, NextFunction } from 'express'
import Logger from '../libs/logger.ts'

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Logger.error(error)

    if (res.headersSent) {
        return next(error)
    }

    if (error instanceof Error) {
        switch (error.message) {
            case 'Email already in use':
                return res.status(400).json({
                    message: error.message
                })

            case 'Invalid credentials':
                return res.status(401).json({
                    message: error.message
                })

            case 'Book already existed':
                return res.status(400).json({
                    message: error.message
                })

            case 'Book does not exist':
                return res.status(404).json({
                    message: error.message
                })

            default:
                return res.status(500).json({
                    message: 'Internal server error'
                })
        }
    }

    return res.status(500).json({
        message: 'Internal server error'
    })
}