import { Pool } from 'pg'
import type { Book } from '../types/Book.ts'

export const createBookRepository = (pool: Pool) => ({

    // create book
    async createBook(
        userId: string,
        title: string,
        author: string,
        status: string,
        rating: number,
        cover_url?: string
    ): Promise<Book> {

        const result = await pool.query(
            `INSERT INTO books
                (id_user, title, author, status, rating, cover_url)
             VALUES ($1, $2, $3, $4, $5, $6)
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
    },

    // find book by title and author
    async findBookByTitleAndAuthor(
        userId: string,
        title: string,
        author: string
    ): Promise<Book | undefined> {

        const result = await pool.query(
            `SELECT id, id_user, title, author, status, rating, cover_url
             FROM books
             WHERE id_user = $1 AND title = $2 AND author = $3`,
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
    },

    // find book by id
    async findBookById(
        userId: string,
        id: string
    ): Promise<Book | undefined> {

        const result = await pool.query(
            `SELECT id, id_user, title, author, status, rating, cover_url
             FROM books
             WHERE id_user = $1 AND id = $2`,
            [userId, id]
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
    },

    // get books by status
    async getBooksByStatus(
        userId: string,
        status?: string,
        page: number = 1,
        limit: number = 10,
        sort: string = 'title',
        order: string = 'asc'
    ): Promise<Book[] | undefined> {

        const offset = (page - 1) * limit
        
        // pt sortare
        const allowedSortFields: Record<string, string> = {
            title: 'title',
            author: 'author',
            status: 'status',
            rating: 'rating'
        }
        const sortColumn = allowedSortFields[sort] ?? 'title'
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC'

        const query = `
        SELECT id, id_user, title, author, status, rating, cover_url
        FROM books
        WHERE id_user = $1
        ${status ? 'AND status = $2' : ''}
        ORDER BY ${sortColumn} ${sortOrder}
        LIMIT $${status ? 3 : 2}
        OFFSET $${status ? 4 : 3}
        `

        const params = status? [userId, status, limit, offset]: [userId, limit, offset]

        const result = await pool.query(query, params)

        return result.rows.map((row) => ({
            id: row.id,
            id_user: row.id_user,
            title: row.title,
            author: row.author,
            status: row.status,
            rating: row.rating,
            cover_url: row.cover_url
        }))
    },

    // delete book
    async deleteBooksById(
        userId: string,
        id: string
    ): Promise<Book | undefined> {

        const result = await pool.query(
            `DELETE FROM books
             WHERE id_user = $1 AND id = $2
             RETURNING id, id_user, title, author, status, rating, cover_url`,
            [userId, id]
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
    },

    // update book status and/or rating
    async updateBookbyStatusAndRating(
        userId: string,
        id: string,
        status?: string,
        rating?: number
    ): Promise<Book | undefined> {

        if (status !== undefined && rating !== undefined) {
            const result = await pool.query(
                `UPDATE books
                 SET status = $3, rating = $4
                 WHERE id_user = $1 AND id = $2
                 RETURNING id, id_user, title, author, status, rating, cover_url`,
                [userId, id, status, rating]
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

        if (status !== undefined) {
            const result = await pool.query(
                `UPDATE books
                 SET status = $3
                 WHERE id_user = $1 AND id = $2
                 RETURNING id, id_user, title, author, status, rating, cover_url`,
                [userId, id, status]
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

        if (rating !== undefined) {
            const result = await pool.query(
                `UPDATE books
                 SET rating = $3
                 WHERE id_user = $1 AND id = $2
                 RETURNING id, id_user, title, author, status, rating, cover_url`,
                [userId, id, rating]
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

        return undefined
    },

    // update book cover
    async updateBookOnCover(
        userId: string,
        id: string,
        cover_url: string
    ): Promise<Book | undefined> {

        const result = await pool.query(
            `UPDATE books
             SET cover_url = $3
             WHERE id_user = $1 AND id = $2
             RETURNING id, id_user, title, author, status, rating, cover_url`,
            [userId, id, cover_url]
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
})

