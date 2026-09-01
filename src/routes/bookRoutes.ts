import { Router } from 'express'
import { authenticateJWT } from '../middleware/authMiddleware.ts'

import {add, filter, deleteId, update, uploadCover} from '../controllers/booksController.ts'
import {validate} from '../middleware/validateMiddleware.ts'
import {addBookSchema, getBooksSchema, deleteBooksSchema, updateBooksSchema} from '../schemas/booksSchemas.ts'
import {upload} from '../middleware/uploadMiddleware.ts'

const router = Router()

// URL + middleware + controller

// POST /books
router.post('/books', authenticateJWT, validate(addBookSchema, "body"), add)

// GET /books (by status?)
router.get('/books', authenticateJWT, validate(getBooksSchema, "query"), filter)

// DELETE /books/:id
router.delete('/books/:id', authenticateJWT, validate(deleteBooksSchema, "params"), deleteId)

// PATCH /books/:id
router.patch('/books/:id', authenticateJWT, validate(updateBooksSchema, "params"), update)
// and query

// POST /books/:id/cover
router.post('/books/:id/cover', authenticateJWT, upload.single('image'), uploadCover)

export default router
