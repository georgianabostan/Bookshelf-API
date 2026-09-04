import {type Request, type Response, type NextFunction} from 'express'
import { verifyToken } from '../utils/jwt.ts'
import Logger from '../libs/logger.ts'

// verificam JWT

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {

    // Bearer eyJhbGciOiJIUzI1...
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        })
    }

    try {

        req.user = verifyToken(token)
        next()

    } catch (error) {

        Logger.error(error)
        return res.status(401).json({
            message: 'Invalid or expired token'
        })
    }
}