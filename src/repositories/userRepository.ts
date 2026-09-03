import { Pool } from "pg"
import type { User, UserWithPassword } from '../types/User.ts'

export const createUserRepository = (pool: Pool) => ({ 
    async createUser (email: string, password: string, role: string): Promise<User>{

        const result = await pool.query(
            `INSERT INTO users (email, password, role) VALUES ($1, $2, $3)
            RETURNING id, email, password, role, created_at`,
            [email, password, role]
        )

        const row = result.rows[0]

        return {
            id: row.id,
            email: row.email,
            role: row.role,
            createdAt: row.created_at
        }
    },

    async findUserByEmail (email: string): Promise<UserWithPassword | undefined> {

        const result = await pool.query(
            `SELECT id, email, password, role, created_at
            FROM users
            WHERE email = $1`,
            [email]
        )

        if (result.rows.length === 0) {
            return undefined
        }

        const row = result.rows[0]

        return {
            id: row.id,
            email: row.email,
            password: row.password,
            role: row.role,
            createdAt: row.created_at
        }
    }
})