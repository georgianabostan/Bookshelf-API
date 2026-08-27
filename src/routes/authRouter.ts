import { Router, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt.ts'
import { users, type User } from '../schemas/User.ts'
import Logger from '../libs/logger.ts'

const router :Router = Router()

// Check if username or email is already in use
const isUniqueUser = (email: string) =>{
    return !users.some(
        (user: User) => user.email === email
    )
}

// User registration route
router.post('/register', async (req: Request, res: Response)=>{
    const { email, password, role } = req.body

    // Validate input
    if (!email || !password || !role){
        return res.status(400).json({message: 'Missing required fields'})
    }

    // Check if email is already taken
    if(!isUniqueUser(email)){
        return res.status(400).json({message: 'Email already in use'})
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser: User = {
        id: Date.now().toString(),
        email, 
        password: hashedPassword,
        role,
        createdAt: new Date()
    }

    // Save the new user to the array
    users.push(newUser)

    res.status(201).json({message: 'User registered successfully'})

    Logger.info(
        `User succeddfully registered: ${JSON.stringify(newUser, null, 2)}`
    )
})

// User login route
router.post('/login', async (req: Request, res: Response) => {
    const { email, password} = req.body
    const user:User | undefined = users.find((u: User) :boolean => u.email === email)

    if(!user){
        Logger.error(`400: Invalid credentials`)
        return res.status(400).json({message: 'Invalid credentials'})
    }

    const isPasswordValid: boolean = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        Logger.error(`400: Invalid credentials`)
        return res.status(400).json({message: 'Invalid credentials'})
    }
    
    const token:string = generateToken({
        userId: user.id,
        role: user.role,
    })
    res.json({token})
})

export default router