import type { SupabaseClient } from '@supabase/supabase-js'
import { createBookRepository } from '../repositories/bookRepository.ts'

export const createBookService = (bookRepository: ReturnType<typeof createBookRepository>, supabase: SupabaseClient) => ({

// add book
    async addBook (userId: string, title: string, author: string, status: string, rating: number, cover_url?: string) {


        const existingBook = await bookRepository.findBookByTitleAndAuthor(userId, title, author)

        if (existingBook) {
            throw new Error('Book already existed')
        }

        const book = await bookRepository.createBook(userId, title, author, status, rating, cover_url)

        return book
    },

    // get books filter
    async getListBooks(
        userId: string,
        status?: string,
        page: number = 1,
        limit: number = 10,
        sort: string = 'title',
        order: string = 'asc'
    ) {

        const listBooks = await bookRepository.getBooksByStatus(
            userId,
            status,
            page,
            limit,
            sort,
            order
        )

        if (listBooks === undefined) {
            return []
        }

        return listBooks
    },

    // delete book
    async deleteBook (userId: string, id: string){

        const book = await bookRepository.deleteBooksById(userId, id)
        
        if (book === undefined) {
            throw new Error('Book does not exist')
        }

        return book
    },

    // update book
    async updateBook (userId: string, id: string, status?: string, rating?: number) {

        const book = await bookRepository.updateBookbyStatusAndRating(userId, id, status, rating)

        if(book === undefined){
            throw new Error('Book does not exist')
        }
        
        return book
    },

    // update book cover
    async updateBookCover (userId: string, id: string, file: Express.Multer.File) {

        const book = await bookRepository.findBookById(userId, id);

        if (!book) {
            throw new Error('Book does not exist')
        }
        
        const fileExtension = file.originalname.split('.').pop()
        
        const fileName = `${id}-${Date.now()}.${fileExtension}`
        
        const { error } = await supabase.storage
            .from('book-covers')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype
            }) // pune imagina in bucket
        
        if (error) {
            throw error
        }

        const { data } = supabase.storage
            .from('book-covers')
            .getPublicUrl(fileName) //obtine url-ul imaginii
        

        return bookRepository.updateBookOnCover(userId, id, data.publicUrl)
    }
})