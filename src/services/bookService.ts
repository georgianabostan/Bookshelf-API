import {createBook, findBookByTitleAndAuthor, getBooksByStatus, deleteBooksById, updateBookbyStatusAndRating} from '../repositories/bookRepository.ts'

// add book
export const addBook = async (userId: string, title: string, author: string, status: string, rating: number, cover_url: string) => {


    const existingBook = await findBookByTitleAndAuthor(userId, title, author)

    if (existingBook) {
        throw new Error('Book already existed')
    }

    const book = await createBook(userId, title, author, status, rating, cover_url)

    return book
}

// get books filter
export const getListBooks = async (userId: string, status?: string) => {

    const listBooks = await getBooksByStatus(userId, status)

    if(listBooks === undefined){
        return 'The list is empty'
    }
    
    return listBooks
}

// delete book
export const deleteBook = async (userId: string, id: string) => {

    const book = await deleteBooksById(userId, id)
    
    return book
}

// update book
export const updateBook = async (userId: string, id: string, status?: string, rating?: number) => {

    console.log("Service: " + status + " " + rating)
    const book = await updateBookbyStatusAndRating(userId, id, status, rating)

    console.log("gata service")
    if(book === undefined){
        return 'Book does not exist'
    }
    
    return book
}
 