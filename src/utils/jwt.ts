// utils/jwt
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import Logger from '../libs/logger.ts'

const SECRET_KEY = process.env.JWT_SECRET

if (!SECRET_KEY) {
    throw new Error('JWT_SECRET is not defined')
}

export interface UserPayload {
    userId: string
    role: string
}

// Generate a JWT
export const generateToken = (userPayload: UserPayload) => {
    return jwt.sign(
        userPayload,
        SECRET_KEY,
        { expiresIn: '1h' }
    )
}

// Verify a JWT
export const verifyToken = (token: string): UserPayload => {
    try {
        return jwt.verify(
            token,
            SECRET_KEY
        ) as UserPayload

    } catch (error) {
        Logger.error(error)

        throw new Error('Invalid token')
    }
}