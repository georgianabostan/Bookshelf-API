import { Router } from 'express'
import { authenticateJWT } from '../middleware/authMiddleware.ts'

import { createBooksController } from '../controllers/booksController.ts'
import {validate} from '../middleware/validateMiddleware.ts'
import {addBookSchema, getBooksSchema, deleteBooksSchema, updateBookParamsSchema, updateBookBodySchema } from '../schemas/booksSchemas.ts'
import {upload} from '../middleware/uploadMiddleware.ts'

export const createBooksRoutes = (booksController: ReturnType<typeof createBooksController>) => {

    const router = Router()

    // URL + middleware + controller

    // POST /books
    router.post('/books', authenticateJWT, validate(addBookSchema, "body"), booksController.add)

    // GET /books (by status?)
    router.get('/books', authenticateJWT, validate(getBooksSchema, "query"), booksController.filter)

    // DELETE /books/:id
    router.delete('/books/:id', authenticateJWT, validate(deleteBooksSchema, "params"), booksController.deleteId)

    // PATCH /books/:id
    router.patch('/books/:id', authenticateJWT, validate(updateBookParamsSchema, "params"), validate(updateBookBodySchema, 'body'), booksController.update)
    // and query

    // POST /books/:id/cover
    router.post('/books/:id/cover', authenticateJWT, upload.single('image'), booksController.uploadCover)

    return router
}