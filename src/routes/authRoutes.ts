import { Router } from 'express'

import {register, login} from '../controllers/authController.ts'
import {validate} from '../middleware/validateMiddleware.ts'
import {registerSchema,loginSchema} from '../schemas/authSchemas.ts'

const router = Router()

// URL + middleware + controller
router.post('/register',validate(registerSchema, "body"),register)
router.post('/login',validate(loginSchema, "body"),login)


export default router