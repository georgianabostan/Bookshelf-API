import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/app.ts'

describe('Books API - Integration Tests', () => {
    
    let user1Token: string // proprietar de carti
    let user2Token: string // verifica ca nu poate modifica cartea altui utilizator

    let bookId: string

    const user1Email = `books-test-user-1-${Date.now()}@example.com`
    const user2Email = `books-test-user-2-${Date.now()}@example.com`

    const password = 'Test123456'

    const mainBookTitle = `Integration Test Book ${Date.now()}`
    const mainBookAuthor = 'Test Author'

    beforeAll(async () => {
        
        // cream primul user
        const registerUser1 = await request(app)
            .post('/auth/register')
            .send({
                email: user1Email,
                password,
                role: 'user'
            })

        expect(registerUser1.status).toBe(201)


        // login prim user -> token
        const loginUser1 = await request(app)
            .post('/auth/login')
            .send({
                email: user1Email,
                password
            })

        expect(loginUser1.status).toBe(200)
        expect(loginUser1.body.token).toBeDefined()

        user1Token = loginUser1.body.token


        // cream al doilea user
        const registerUser2 = await request(app)
            .post('/auth/register')
            .send({
                email: user2Email,
                password,
                role: 'user'
            })

        expect(registerUser2.status).toBe(201)


        // login al doilea user -> token
        const loginUser2 = await request(app)
            .post('/auth/login')
            .send({
                email: user2Email,
                password
            })

        expect(loginUser2.status).toBe(200)
        expect(loginUser2.body.token).toBeDefined()

        user2Token = loginUser2.body.token
    })

// (/POST/books)
    // cream o carte pt user1 (/POST/books)
    it('creates a book for the authenticated user', async () => {
        
        const response = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                title: mainBookTitle,
                author: mainBookAuthor,
                status: 'want',
                rating: 4
            })

        expect(response.status).toBe(201)

        expect(response.body).toEqual({
            message: 'Book successfully added'
        })

        const listResponse = await request(app)
            .get('/books')
            .set('Authorization', `Bearer ${user1Token}`)

        expect(listResponse.status).toBe(200)

        const createdBook = listResponse.body.listBooks.find(
            (book: {
                title: string
                author: string
                id: string
            }) =>
                book.title === mainBookTitle &&
                book.author === mainBookAuthor
        )

        // verificam ca nu exista deja
        expect(createdBook).toBeDefined()

        // salvam id pt testele urmatoare
        bookId = createdBook.id

        expect(createdBook.title).toBe(mainBookTitle)
        expect(createdBook.author).toBe(mainBookAuthor)
        expect(createdBook.status).toBe('want')
        expect(createdBook.rating).toBe(4)
    })

    // cream o carte deja existenta
    it('does not allow the same card to be created twice for the same user', async () => {
       
        const response = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                title: mainBookTitle,
                author: mainBookAuthor,
                status: 'reading',
                rating: 5
            })

        expect(response.status).toBe(400)

        expect(response.body).toEqual({
            message: 'Book already existed'
        })
    })

    // validarea zod din addBookSchema
    it('reject a book with invalid data', async () => {
        
        const response = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                title: 'Invalid Book',
                author: 'Invalid Author',
                status: 'invalid-status',
                rating: 4
            })

        expect(response.status).toBe(400)

        expect(response.body.message).toBe('Validation failed')

        expect(response.body.errors).toBeInstanceOf(Array)
        expect(response.body.errors.length).toBeGreaterThan(0)
    })

    // rating > 5 - gresit
    it('reject a rating higher than 5', async () => {
        const response = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                title: 'Invalid Rating Book',
                author: 'Test Author',
                status: 'want',
                rating: 6
            })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Validation failed')
    })



// GET /books
    it('lists the books of the authenticated user', async () => {
        const response = await request(app)
            .get('/books')
            .set('Authorization', `Bearer ${user1Token}`)

        expect(response.status).toBe(200)

        expect(response.body.message).toBe('Book successfully taken')

        expect(response.body.listBooks).toBeInstanceOf(Array)

        // verificam ca exista cartea creata anterior
        const book = response.body.listBooks.find(
            (item: { id: string }) => item.id === bookId
        )

        expect(book).toBeDefined()
    })

    // GET /books?status=want
    it('filter cards by status', async () => {
        const response = await request(app)
            .get('/books')
            .query({
                status: 'want'
            })
            .set('Authorization', `Bearer ${user1Token}`)

        expect(response.status).toBe(200)
        expect(response.body.listBooks).toBeInstanceOf(Array)

        for (const book of response.body.listBooks) {
            expect(book.status).toBe('want')
        }

        const book = response.body.listBooks.find(
            (item: { id: string }) => item.id === bookId
        )

        expect(book).toBeDefined()
    })

// PATCH /books/:id
    // ambele campuri (status, rating)
    it('update the status and rating of a book', async () => {
      
        const response = await request(app)
            .patch(`/books/${bookId}`)
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                status: 'reading',
                rating: 5
            })

        expect(response.status).toBe(200)

        expect(response.body).toEqual({
            message: 'Book successfully update'
        })

        const listResponse = await request(app)
            .get('/books')
            .set('Authorization', `Bearer ${user1Token}`)

        expect(listResponse.status).toBe(200)

        const updatedBook = listResponse.body.listBooks.find(
            (book: { id: string }) => book.id === bookId
        )

        expect(updatedBook).toBeDefined()
        expect(updatedBook.status).toBe('reading')
        expect(updatedBook.rating).toBe(5)
    })

    // doar status
    it('only updates the status of a book', async () => {
        const response = await request(app)
            .patch(`/books/${bookId}`)
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                status: 'done'
            })

        expect(response.status).toBe(200)

        // verificam prin GET modificarea
        const listResponse = await request(app)
            .get('/books')
            .set('Authorization', `Bearer ${user1Token}`)

        const updatedBook = listResponse.body.listBooks.find(
            (book: { id: string }) => book.id === bookId
        )

        expect(updatedBook).toBeDefined()

        expect(updatedBook.status).toBe('done')

        expect(updatedBook.rating).toBe(5)
    })

    // doar rating
    it('only updates a book s rating', async () => {
        const response = await request(app)
            .patch(`/books/${bookId}`)
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                rating: 3
            })

        expect(response.status).toBe(200)

        const listResponse = await request(app)
            .get('/books')
            .set('Authorization', `Bearer ${user1Token}`)

        const updatedBook = listResponse.body.listBooks.find(
            (book: { id: string }) => book.id === bookId
        )

        expect(updatedBook).toBeDefined()
        expect(updatedBook.rating).toBe(3)

        expect(updatedBook.status).toBe('done')
    })

    // niciun camp
    it('reject a PATCH with no fields to update', async () => {
        
        const response = await request(app)
            .patch(`/books/${bookId}`)
            .set('Authorization', `Bearer ${user1Token}`)
            .send({})

        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Validation failed')
    })

    // id -> UUID
    it('reject a PATCH with an invalid ID', async () => {
        
        const response = await request(app)
            .patch('/books/not-a-valid-uuid')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                status: 'reading'
            })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Validation failed')
    })

    // user2 incearca sa modifice cartea de la user1
    it('does not allow a user to modify another user s book', async () => {
        
        const ownershipBookTitle = `Ownership Test Book ${Date.now()}`

        const createResponse = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                title: ownershipBookTitle,
                author: 'Ownership Author',
                status: 'want',
                rating: 2
            })

        expect(createResponse.status).toBe(201)

        // gasim id-ul cartii creat de user1
        const listResponse = await request(app)
            .get('/books')
            .set('Authorization', `Bearer ${user1Token}`)

        const ownershipBook = listResponse.body.listBooks.find(
            (book: {
                title: string
                author: string
                id: string
            }) =>
                book.title === ownershipBookTitle &&
                book.author === 'Ownership Author'
        )

        expect(ownershipBook).toBeDefined()

        // user2 incearca sa modifice
        const updateResponse = await request(app)
            .patch(`/books/${ownershipBook.id}`)
            .set('Authorization', `Bearer ${user2Token}`)
            .send({
                status: 'done',
                rating: 5
            })

        // eroarea
        expect(updateResponse.status).toBe(404)

        expect(updateResponse.body).toEqual({
            message: 'Book does not exist'
        })
    })

// DELETE
    // user2 incearca sa stearga cartea de la user1
    it('does not allow a user to delete another users book', async () => {
        
        // cream carte
        const ownershipBookTitle = `Delete Ownership Book ${Date.now()}`

        const createResponse = await request(app)
            .post('/books')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                title: ownershipBookTitle,
                author: 'Delete Author',
                status: 'want',
                rating: 1
            })

        expect(createResponse.status).toBe(201)

        // id carte
        const listResponse = await request(app)
            .get('/books')
            .set('Authorization', `Bearer ${user1Token}`)

        const ownershipBook = listResponse.body.listBooks.find(
            (book: {
                title: string
                author: string
                id: string
            }) =>
                book.title === ownershipBookTitle &&
                book.author === 'Delete Author'
        )

        expect(ownershipBook).toBeDefined()

        // user2 incearca sa stearga carte user1
        const deleteResponse = await request(app)
            .delete(`/books/${ownershipBook.id}`)
            .set('Authorization', `Bearer ${user2Token}`)

        // eroare
        expect(deleteResponse.status).toBe(404)

        expect(deleteResponse.body).toEqual({
            message: 'Book does not exist'
        })

        // user1 inca are cartea (verificare)
        const verifyResponse = await request(app)
            .get('/books')
            .set('Authorization', `Bearer ${user1Token}`)

        const stillExists = verifyResponse.body.listBooks.find(
            (book: { id: string }) => book.id === ownershipBook.id
        )

        expect(stillExists).toBeDefined()
    })

    // stergerea unei carti neexistente
    it('returns 404 when trying to delete a non-existent book', async () => {
        
        const fakeBookId = '00000000-0000-0000-0000-000000000000'

        const response = await request(app)
            .delete(`/books/${fakeBookId}`)
            .set('Authorization', `Bearer ${user1Token}`)

        expect(response.status).toBe(404)

        expect(response.body).toEqual({
            message: 'Book does not exist'
        })
    })

    // sterge carte
    it('delete an existing book', async () => {
        
        const response = await request(app)
            .delete(`/books/${bookId}`)
            .set('Authorization', `Bearer ${user1Token}`)

        expect(response.status).toBe(200)

        expect(response.body).toEqual({
            message: 'Book successfully delete'
        })

        // verific ca carte nu mai exista (get)
        const listResponse = await request(app)
            .get('/books')
            .set('Authorization', `Bearer ${user1Token}`)

        expect(listResponse.status).toBe(200)

        const deletedBook = listResponse.body.listBooks.find(
            (book: { id: string }) => book.id === bookId
        )

        expect(deletedBook).toBeUndefined()
    })
})