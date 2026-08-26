import { Router, type Request, type Response } from 'express'
import pool from '../config/postgres.ts'

const router = Router()

// INSERT
router.post('/users', async (req: Request, res: Response) => {
    await pool.query(
        `INSERT INTO users (email, password)
        VALUES ($1, $2)`,
        ['ana@gmail.com', '1234']
    )

    res.status(203).json( {succes: true} )
})

// SELECT
router.get('/users', async (req: Request, res: Response) => {
    const result = await pool.query(
        `SELECT id, email, password, created_at FROM users`
    )

    res.status(200).json({
        success: true,
        data: result.rows
    })
})

export default router