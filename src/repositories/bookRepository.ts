import pool from '../config/postgres.ts'
import type { Book } from '../types/Book.ts'

// create book
export const createBook = async (userId: string, title: string, author: string, status: string, rating: number, cover_url: string): Promise<Book> => {

    const result = await pool.query(
        `INSERT INTO books (id_user, title, author, status, rating, cover_url) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, id_user, title, author, status, rating, cover_url`,
        [userId, title, author, status, rating, cover_url]
    )

    const row = result.rows[0]

    return {
        id: row.id,
        id_user: row.id_user,
        title: row.title,
        author: row.author,
        status: row.status,
        rating: row.rating,
        cover_url: row.cover_url
    }
}

// find book
export const findBookByTitleAndAuthor = async (userId: string, title: string, author: string): Promise<Book | undefined> => {

    const result = await pool.query(
        `SELECT id, id_user, title, author, status, rating, cover_url FROM books WHERE  id_user = $1 AND title = $2 AND author = $3`,
        [userId, title, author]
    )

    if (result.rows.length === 0) {
        return undefined
    }

    const row = result.rows[0]

    return {
        id: row.id,
        id_user: row.id_user,
        title: row.title,
        author: row.author,
        status: row.status,
        rating: row.rating,
        cover_url: row.cover_url
    }
}

// get books by status
export const getBooksByStatus = async (userId: string, status?: string): Promise<Book[] | undefined> => {

    if(status){
        const result = await pool.query(
        `SELECT id, id_user, title, author, status, rating, cover_url FROM books WHERE  id_user = $1 AND status = $2`,
        [userId, status]
        )

        if (result.rows.length === 0) {
            return undefined
        }

        const books: Book[] = result.rows.map((row) => ({
            id: row.id,
            id_user: row.id_user,
            title: row.title,
            author: row.author,
            status: row.status,
            rating: row.rating,
            cover_url: row.cover_url
        }))

        return books
    }

    const result = await pool.query(
        `SELECT id, id_user, title, author, status, rating, cover_url FROM books WHERE  id_user = $1`,
        [userId]
    )

    if (result.rows.length === 0) {
        return undefined
    }

    const books: Book[] = result.rows.map((row) => ({
        id: row.id,
        id_user: row.id_user,
        title: row.title,
        author: row.author,
        status: row.status,
        rating: row.rating,
        cover_url: row.cover_url
    }))

   return books
}