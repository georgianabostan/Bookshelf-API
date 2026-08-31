import type {Request, Response, NextFunction} from 'express'

import Logger from '../libs/logger.ts'

export const errorHandler = (error: unknown,req: Request,res: Response,next: NextFunction) => {

    Logger.error(error)

    if (res.headersSent) {
        return next(error)
    }

    return res.status(500).json({
        message: 'Internal server error'
    })
}