import { Router } from 'express'
import { authenticateJWT } from '../middleware/authMiddleware.ts'

import {add} from '../controllers/booksController.ts'
import {validate} from '../middleware/validateMiddleware.ts'
import {booksSchema} from '../schemas/booksSchemas.ts'

const router = Router()

// URL + middleware + controller

// POST /books
router.post('/books', authenticateJWT, validate(booksSchema), add)



export default router