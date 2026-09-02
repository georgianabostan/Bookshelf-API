import express from 'express'

import pool from './config/postgres.ts'
import supabase from './config/supabase.ts'

import { createUserRepository } from './repositories/userRepository.ts'
import { createBookRepository } from './repositories/bookRepository.ts'

import { createUserService } from './services/authService.ts'
import { createBookService } from './services/bookService.ts'

import { createAuthController } from './controllers/authController.ts'
import { createBooksController } from './controllers/booksController.ts'

import { createAuthRoutes } from './routes/authRoutes.ts'
import { createBooksRoutes } from './routes/bookRoutes.ts'

import protectedRoutes from './routes/protectedRoutes.ts'
import { errorHandler } from './middleware/errorMiddleware.ts'
// instanta express
const app = express()

app.use(express.json())

// repositories
const userRepository = createUserRepository(pool)
const bookRepository = createBookRepository(pool)

// services
const authService = createUserService(userRepository)
const bookService = createBookService(bookRepository, supabase)

// controllers
const authController = createAuthController(authService)
const booksController = createBooksController(bookService)

// rutele
app.use('/auth', createAuthRoutes(authController))

app.use('/protected',protectedRoutes)

app.use(createBooksRoutes(booksController))

// middleware
app.use(errorHandler)



export default app