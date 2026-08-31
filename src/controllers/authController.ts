import type {Request, Response} from 'express'
import {registerUser, loginUser} from '../services/authService.ts'
import {generateToken} from '../utils/jwt.ts'
import Logger from '../libs/logger.ts'


// register
export const register = async (req: Request, res: Response) => {

    try {
        // citeste req.body, adica citeste datele
        const {email, password, role} = req.body

        // trimite datele catre serviciu
        await registerUser(email, password, role)

        Logger.info(`User successfully registered: ${email}`)

        // returneaza raspunsul
        return res.status(201).json({
            message: 'User registered successfully'
        })

    } catch (error) {

        Logger.error(error)

        if (
            error instanceof Error &&
            error.message === 'Email already in use'
        ) {
            return res.status(400).json({
                message: 'Email already in use'
            })
        }

        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

// login
export const login = async (req: Request, res: Response) => {

    try {
        const {email, password} = req.body

        const user = await loginUser(email, password)

        const token = generateToken({userId: user.id, role: user.role})

        return res.json({token})

    } catch (error) {

        Logger.error(error)

        if (error instanceof Error && error.message === 'Invalid credentials') {
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}