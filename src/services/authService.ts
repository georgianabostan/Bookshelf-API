import bcrypt from 'bcryptjs'

import {createUser, findUserByEmail} from '../repositories/userRepository.ts'

// register
export const registerUser = async (email: string, password: string, role: string) => {

    const existingUser = await findUserByEmail(email)

    if (existingUser) {
        throw new Error('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await createUser(email, hashedPassword, role)

    return user
}

// login
export const loginUser = async (email: string, password: string) => {

    const user = await findUserByEmail(email)

    if (!user) {
        throw new Error('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new Error('Invalid credentials')
    }

    return user
}