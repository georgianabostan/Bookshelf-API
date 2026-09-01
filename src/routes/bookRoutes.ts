import { Router } from 'express'
import { authenticateJWT } from '../middleware/authMiddleware.ts'

import {add, filter} from '../controllers/booksController.ts'
import {validate} from '../middleware/validateMiddleware.ts'
import {addBookSchema, GetBooksSchema} from '../schemas/booksSchemas.ts'

const router = Router()

// URL + middleware + controller

// POST /books
router.post('/books', authenticateJWT, validate(addBookSchema, "body"), add)

// GET /books
router.get('/books', authenticateJWT, validate(GetBooksSchema, "query"), filter)


export default router