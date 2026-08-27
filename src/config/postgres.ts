import 'dotenv/config' //pt folosirea anvariment in aceasta fila
import { Pool } from 'pg' 

// un arrray cu variabilele folosite
const requiredEnvVars = [
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_DATABASE',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD'
]

// cauta si salveaza toate variabilele din array  care nu exista in .env file
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

// verifica daca exista variabile daca nu exista si da eroare
if(missingEnvVars.length > 0){
    throw new Error(`missing required enviromment variables: ${missingEnvVars}`)
}

// creaza obiectul pool
const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE
})

export default pool