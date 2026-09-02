import { Router } from 'express'
import {validate} from '../middleware/validateMiddleware.ts'
import type { createAuthController } from '../controllers/authController.ts'
import {registerSchema,loginSchema} from '../schemas/authSchemas.ts'

export const createAuthRoutes = (authController: ReturnType<typeof createAuthController>) => {

    const router = Router()

    // URL + middleware + controller
    router.post('/register',validate(registerSchema, "body"),authController.register)
    router.post('/login',validate(loginSchema, "body"),authController.login)


    return router
}