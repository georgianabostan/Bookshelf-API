import { Router } from 'express'

import {register, login} from '../controllers/authController.ts'
import {validate} from '../middleware/validateMiddleware.ts'
import {registerSchema,loginSchema} from '../schemas/authSchemas.ts'

const router = Router()

// URL + middleware + controller
router.post('/register',validate(registerSchema),register)
router.post('/login',validate(loginSchema),login)


export default router