import type {Request, Response} from 'express'
import type { createBookService } from '../services/bookService.ts'
import Logger from '../libs/logger.ts'

export const createBooksController = (
    bookService: ReturnType<typeof createBookService>
) => ({
        
    // add Book
    async add (req: Request, res: Response){

        // citeste req.body, adica citeste datele
        const {title, author, status, rating, cover_url} = req.body

        // luam id-ul user-ului
        const userId = req.user!.userId

        // trimite datele catre serviciu
        await bookService.addBook(userId, title, author, status, rating, cover_url)

        Logger.info(`Book successfully added: ${title}`)

        // returneaza raspunsul
        return res.status(201).json({
            message: 'Book successfully added'
        })
    },

    // filter list books
    async filter (req: Request, res: Response){

        // citeste req.query, adica citeste datele din url
        const {status} = req.query

        // luam id-ul user-ului
        const userId = req.user!.userId

        // trimite datele catre serviciu
        const listBooks = await bookService.getListBooks(userId, status as string | undefined)

        Logger.info(`Books successfully taken: ${status}`)

        // returneaza raspunsul
        return res.status(200).json({
            message: 'Book successfully taken',
            listBooks
        })
        
    },

    // delete book
    async deleteId(req: Request, res: Response) {

        // citeste req.params, adica citeste datele din url (e dat direct ca cale)
        const { id } = req.params

        // luam id-ul user-ului
        const userId = req.user!.userId

        // trimite datele catre serviciu
        const listBooks = await bookService.deleteBook(userId, id as string)

        Logger.info(`Book successfully delete: ${listBooks}`)

        // returneaza raspunsul
        return res.status(200).json({
            message: 'Book successfully delete'
        })
        
    },

    // update book
    async update (req: Request, res: Response) {

        // citeste req.params, adica citeste datele din url (e dat direct ca cale)
        const { id } = req.params

        const {status, rating} = req.body
            
        // luam id-ul user-ului
        const userId = req.user!.userId

        // trimite datele catre serviciu
        const listBooks = await bookService.updateBook(userId, id as string, status as string, rating as number)

        Logger.info(`Book successfully update: ${listBooks}`)

        // returneaza raspunsul
        return res.status(200).json({
            message: 'Book successfully update'
        })
        
    },

    // update book cover
    async uploadCover (req: Request, res: Response) {
        
        // citeste req.params, adica citeste datele din url (e dat direct ca cale)
        const { id } = req.params
            
        // luam id-ul user-ului
        const userId = req.user!.userId

        if (!req.file) {
            return res.status(400).json({
                message: 'Cover image is required'
            })
        }

        // trimite datele catre serviciu
        await bookService.updateBookCover(userId, id as string, req.file)

        Logger.info(`Book cover successfully uploaded: ${id}`)
            
        // returneaza raspunsul
        return res.status(200).json({
            message: 'Book successfully update cover'
        })      
    }
})