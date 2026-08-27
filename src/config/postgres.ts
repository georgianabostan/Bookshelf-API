import 'dotenv/config'
import { Pool } from 'pg'

const requiredEnvVars = [
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_DATABASE',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD'
]

const missingEnvVars = requiredEnvVars.filter(
    envVar => !process.env[envVar]
)

if (missingEnvVars.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`
    )
}

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE
})

pool.on('error', (error) => {
    console.error('Unexpected PostgreSQL pool error:', error)
})

export default pool