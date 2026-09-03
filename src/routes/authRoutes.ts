import { Router } from 'express'
import {validate} from '../middleware/validateMiddleware.ts'
import type { createAuthController } from '../controllers/authController.ts'
import {registerSchema,loginSchema} from '../schemas/authSchemas.ts'
import { authRateLimiter } from '../middleware/rateLimitMiddleware.ts'

export const createAuthRoutes = (authController: ReturnType<typeof createAuthController>) => {

    const router = Router()

    // URL + middleware + controller
    router.post('/register',authRateLimiter,validate(registerSchema, "body"),authController.register)
    router.post('/login',authRateLimiter,validate(loginSchema, "body"),authController.login)


    return router
}