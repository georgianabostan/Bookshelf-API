import {createBook, findBookByTitleAndAuthor} from '../repositories/bookRepository.ts'

// add book
export const addBook = async (userId: string, title: string, author: string, status: string, rating: number, cover_url: string) => {


    const existingBook = await findBookByTitleAndAuthor(userId, title, author)

    if (existingBook) {
        throw new Error('Book already existed')
    }

    const book = await createBook(userId, title, author, status, rating, cover_url)

    return book
}

