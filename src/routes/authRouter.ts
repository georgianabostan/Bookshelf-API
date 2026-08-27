// routes/authRouter
import { Router, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt.ts'
import { createUser, findUserByEmail } from '../repositories/userRepositories.ts'
import Logger from '../libs/logger.ts'

const router :Router = Router()


// User registration route
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body

        if (!email || !password || !role) {
            return res.status(400).json({
                message: 'Missing required fields'
            })
        }

        const existingUser = await findUserByEmail(email)

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already in use'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await createUser(
            email,
            hashedPassword,
            role
        )

        Logger.info(`User successfully registered: ${user.email}`)

        return res.status(201).json({
            message: 'User registered successfully'
        })

    } catch (error) {
        Logger.error(error)

        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

// User login route
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: 'Missing email or password'
            })
        }

        const user = await findUserByEmail(email)

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        )

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        const token = generateToken({
            userId: user.id,
            role: user.role
        })

        return res.json({ token })

    } catch (error) {
        Logger.error(error)

        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

export default router