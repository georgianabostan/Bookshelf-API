import { Router, type Request, type Response } from 'express'

import {authenticateJWT} from '../middleware/authMiddleware.ts'
import {authorizeRole} from '../middleware/roleMiddleware.ts'

const router = Router()

// URL + middleware + controller
router.get('/profile',authenticateJWT,(req: Request,res: Response) => {
    res.json({
        message:'This is a protected user profile route',
        user: req.user
    })
})

router.get('/admin',authenticateJWT,authorizeRole('admin'),(req: Request,res: Response) => {
    res.json({
        message:'Welcome, admin. This is a protected admin route',
        user: req.user
    })
})

export default router

