import type { UserPayload } from '../utils/jwt.ts'

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload
        }
    }
}

export {}