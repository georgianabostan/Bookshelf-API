import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import protectedRoutes from './routes/protectedRoutes.ts'
import {errorHandler} from './middleware/errorMiddleware.ts'

// instanta express
const app = express()

app.use(express.json())

// rutele
app.use('/auth',authRoutes)

app.use('/protected',protectedRoutes)

// middleware
app.use(errorHandler)



export default app