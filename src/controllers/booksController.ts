import type {Request, Response} from 'express'
import type { createBookService } from '../services/bookService.ts'
import Logger from '../libs/logger.ts'

export const createBooksController = (
    bookService: ReturnType<typeof createBookService>
) => ({
        
    // add Book
    async add (req: Request, res: Response){

        try {
            // citeste req.body, adica citeste datele
            const {title, author, status, rating, cover_URL} = req.body

            // luam id-ul user-ului
            const userId = req.user!.userId

            // trimite datele catre serviciu
            await bookService.addBook(userId, title, author, status, rating, cover_URL)

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
    },

    // filter list books
    async filter (req: Request, res: Response){

        try {
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

        } catch (error) {

            Logger.error(error)

            return res.status(500).json({
                message: 'Internal server error'
            })
        }
        
    },

    // delete book
    async deleteId(req: Request, res: Response) {

        try {
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

        } catch (error) {

            Logger.error(error)

            return res.status(500).json({
                message: 'Internal server error'
            })
        }
        
    },

    // update book
    async update (req: Request, res: Response) {

        try {
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

        } catch (error) {

            Logger.error(error)

            return res.status(500).json({
                message: 'Internal server error'
            })
        }
        
    },

    // update book cover
    async uploadCover (req: Request, res: Response) {
        
        try {
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
            const book = await bookService.updateBookCover(userId, id as string, req.file)

            if (book === 'Book does not exist') {
                return res.status(404).json({
                    message: 'Book does not exist'
                })
            }

            Logger.info(`Book cover successfully uploaded: ${id}`)
            
            // returneaza raspunsul
            return res.status(200).json({
                message: 'Book successfully update cover'
            })

        } catch (error) {

            Logger.error(error)

            return res.status(500).json({
                message: 'Internal server error'
            })
        }
        
    }
})