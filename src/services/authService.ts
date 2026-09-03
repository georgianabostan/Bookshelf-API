import bcrypt from 'bcryptjs'

import { createUserRepository } from '../repositories/userRepository.ts'

export const createUserService = (userRepository: ReturnType<typeof createUserRepository>) => ({

    // register
    async registerUser (email: string, password: string, role: string) {

        const existingUser = await userRepository.findUserByEmail(email)

        if (existingUser) {
            throw new Error('Email already in use')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userRepository.createUser(email, hashedPassword, role)

        return user
    },

    // login
    async loginUser (email: string, password: string) {

        const user = await userRepository.findUserByEmail(email)

        if (!user) {
            throw new Error('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new Error('Invalid credentials')
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            };
    }
})