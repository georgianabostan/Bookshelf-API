import 'dotenv/config'

import app from './app.ts'
import pool from './config/postgres.ts'

const port = process.env.PORT || 8000

const startServer = async () => {

    try {

        await pool.query('SELECT NOW()')

        console.log('PostgreSQL connected successfully')

        app.listen(port, () => {
            console.log(`Server is running on port ${port}!`)
        })

    } catch (error) {

        console.error('PostgreSQL connection failed:',  error)
        process.exit(1)
    }
}

startServer()