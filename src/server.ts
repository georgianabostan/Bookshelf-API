//server

/*
import 'dotenv/config'
import express, {type Request, type Response} from 'express';
import authRouter from './routes/authRouter.ts'
import protectedRouter from './routes/protectedRouter.ts'

const port = process.env.PORT || 8000;
const app = express(); 

// setup static folder
// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use('/auth', authRouter)
app.use('/protected', protectedRouter)



app.listen(port, () => console.log(`Server is running on port ${port}!`));

*/



import 'dotenv/config'
import express from 'express'
import pool from './config/postgres.ts'

import authRouter from './routes/authRouter.ts'
import protectedRouter from './routes/protectedRouter.ts'

const port = process.env.PORT || 8000

const app = express()

app.use(express.json())

app.use('/auth', authRouter)
app.use('/protected', protectedRouter)

const startServer = async () => {
    try {
        await pool.query('SELECT NOW()')

        console.log('PostgreSQL connected successfully')

        app.listen(port, () => {
            console.log(`Server is running on port ${port}!`)
        })

    } catch (error) {
        console.error('PostgreSQL connection failed:', error)
        process.exit(1)
    }
}

startServer()