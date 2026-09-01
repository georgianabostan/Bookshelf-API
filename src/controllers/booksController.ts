import type {Request, Response} from 'express'
import {addBook, getListBooks, deleteBook} from '../services/bookService.ts'
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

// filter list books
export const filter = async (req: Request, res: Response) => {

    try {
        // citeste req.query, adica citeste datele din url
        const {status} = req.query

        // luam id-ul user-ului
        const userId = req.user!.userId

        // trimite datele catre serviciu
        const listBooks = await getListBooks(userId, status as string | undefined)

        Logger.info(`Books successfully taken: ${status}`)

        // returneaza raspunsul
        return res.status(200).json({
            message: 'Book successfully taken',
            listBooks
        })

    } catch (error) {

        Logger.error(error)

        return res.status(500).json({
            message: 'Internal server error'
        })
    }
    
}

// delete book
export const deleteId = async (req: Request, res: Response) => {

    try {
        // citeste req.params, adica citeste datele din url (e dat direct ca cale)
        const { id } = req.params

        // luam id-ul user-ului
        const userId = req.user!.userId

        // trimite datele catre serviciu
        const listBooks = await deleteBook(userId, id as string)

        Logger.info(`Book successfully delete: ${id}`)

        // returneaza raspunsul
        return res.status(200).json({
            message: 'Book successfully delete'
        })

    } catch (error) {

        Logger.error(error)

        return res.status(500).json({
            message: 'Internal server error'
        })
    }
    
}
