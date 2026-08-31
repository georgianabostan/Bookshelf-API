import type {Request, Response} from 'express'
import {addBook} from '../services/bookService.ts'
import Logger from '../libs/logger.ts'


// add Book
export const add = async (req: Request, res: Response) => {

    try {
        // citeste req.body, adica citeste datele
        const {title, author, status, rating, cover_URL} = req.body

        // luam id-ul user-ului
        const userId = req.user!.userId

        // trimite datele catre serviciu
        await addBook(userId, title, author, status, rating, cover_URL)

        Logger.info(`Book successfully added: ${title}`)

        // returneaza raspunsul
        return res.status(201).json({
            message: 'Book successfully added'
        })

    } catch (error) {

        Logger.error(error)

        if (
            error instanceof Error &&
            error.message === 'Book already existed'
        ) {
            return res.status(400).json({
                message: 'Book already existed'
            })
        }

        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}