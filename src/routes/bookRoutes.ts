import { Router } from 'express'
import { authenticateJWT } from '../middleware/authMiddleware.ts'

import {add, filter, deleteId} from '../controllers/booksController.ts'
import {validate} from '../middleware/validateMiddleware.ts'
import {addBookSchema, getBooksSchema, deleteBooksSchema} from '../schemas/booksSchemas.ts'

const router = Router()

// URL + middleware + controller

// POST /books
router.post('/books', authenticateJWT, validate(addBookSchema, "body"), add)

// GET /books (by status?)
router.get('/books', authenticateJWT, validate(getBooksSchema, "query"), filter)

// DELETE /books/:id
router.delete('/books/:id', authenticateJWT, validate(deleteBooksSchema, "params"), deleteId)

export default router

/*

PATCH  /books/:id          # e.g. change status or rating
POST   /books/:id/cover

*/