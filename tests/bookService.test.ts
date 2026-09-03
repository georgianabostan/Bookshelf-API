import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { createBookRepository } from '../src/repositories/bookRepository.ts'
type TestFile = { originalname: string, mimetype: string, buffer: Buffer }
import { createBookService } from '../src/services/bookService.ts'

describe('BookService - Unit Tests', () => {
    
    // simulam un repository (ca sa nu folosim PostgreSQL)
    let bookRepository: ReturnType<typeof createBookRepository>

    // simulam Supabase (ca testele sa nu faca upload-uri reale)
    let supabase: SupabaseClient

    let bookService: ReturnType<typeof createBookService> // bookService

    beforeEach(() => {
        // resetam mock-urile inaintea fiecarui test
        vi.clearAllMocks()

        // repository fals -> fiecare metoda e un mock 
        bookRepository = {
            createBook: vi.fn(),
            findBookByTitleAndAuthor: vi.fn(),
            findBookById: vi.fn(),
            getBooksByStatus: vi.fn(),
            deleteBooksById: vi.fn(),
            updateBookbyStatusAndRating: vi.fn(),
            updateBookOnCover: vi.fn()
        } as unknown as ReturnType<typeof createBookRepository>

        supabase = {} as SupabaseClient

        // service (cel real) pe dependente simulate
        bookService = createBookService(bookRepository, supabase)
    })

    // adaugam o carte
    it('should add a book when the book does not already exist', async () => {

        vi.mocked(bookRepository.findBookByTitleAndAuthor).mockResolvedValue(undefined)

        const createdBook = {
            id: '11111111-1111-1111-1111-111111111111',
            id_user: '22222222-2222-2222-2222-222222222222',
            title: 'Clean Code',
            author: 'Robert C. Martin',
            status: 'want',
            rating: 5,
            cover_url: ''
        }

        // simulam raspunsul primit dupa insert
        vi.mocked(bookRepository.createBook).mockResolvedValue(createdBook)

        const result = await bookService.addBook(
            createdBook.id_user,
            createdBook.title,
            createdBook.author,
            createdBook.status,
            createdBook.rating,
            createdBook.cover_url
        )

        // service returneaza o carte
        expect(result).toEqual(createdBook)

        // verificam ca service a verificat inainte ca nu exista cartea
        expect(bookRepository.findBookByTitleAndAuthor
            ).toHaveBeenCalledWith(
                createdBook.id_user,
                createdBook.title,
                createdBook.author
            )

        // verificam ca repository-ul a fost folosit pentru creare
        expect(bookRepository.createBook)
            .toHaveBeenCalledWith(
                createdBook.id_user,
                createdBook.title,
                createdBook.author,
                createdBook.status,
                createdBook.rating,
                createdBook.cover_url
            )
    })

    // adaugam carte deja existenta
    it('should reject adding a duplicate book', async () => {
        const existingBook = {
            id: '11111111-1111-1111-1111-111111111111',
            id_user: '22222222-2222-2222-2222-222222222222',
            title: 'Clean Code',
            author: 'Robert C. Martin',
            status: 'want',
            rating: 5,
            cover_url: ''
        }

        // simulam ca repository gaseste cartea
        vi.mocked(bookRepository.findBookByTitleAndAuthor).mockResolvedValue(existingBook)

        // => service trebuie sa opreasca arunce eroarea
        await expect(
            bookService.addBook(
                existingBook.id_user,
                existingBook.title,
                existingBook.author,
                'reading',
                4
            )
        ).rejects.toThrow('Book already existed')

        // verifica, ca nu s-a folosit creatBook
        expect(bookRepository.createBook).not.toHaveBeenCalled()
    })

    // lista de carti
    it('should return the user book list', async () => {
        const books = [
            {
                id: '11111111-1111-1111-1111-111111111111',
                id_user: '22222222-2222-2222-2222-222222222222',
                title: 'Clean Code',
                author: 'Robert C. Martin',
                status: 'reading',
                rating: 5,
                cover_url: ''
            },
            {
                id: '33333333-3333-3333-3333-333333333333',
                id_user: '22222222-2222-2222-2222-222222222222',
                title: 'The Pragmatic Programmer',
                author: 'Andrew Hunt',
                status: 'done',
                rating: 4,
                cover_url: ''
            }
        ]

        // simulam lista returnata de repository
        vi.mocked(bookRepository.getBooksByStatus).mockResolvedValue(books)
        const result = await bookService.getListBooks(
            '22222222-2222-2222-2222-222222222222'
        )

        expect(result).toEqual(books) // lista primita

        expect(bookRepository.getBooksByStatus).toHaveBeenCalledWith('22222222-2222-2222-2222-222222222222',undefined)
    })

    // lista carti (nu sunt carti) (repository returneaza undefined)
    it('should return an empty array when no books are found', async () => {
        
        vi.mocked(bookRepository.getBooksByStatus).mockResolvedValue(undefined)

        const result = await bookService.getListBooks('22222222-2222-2222-2222-222222222222')

        expect(result).toEqual([])
    })

    // sterge o carte
    it('should delete an existing book', async () => {
        const deletedBook = {
            id: '11111111-1111-1111-1111-111111111111',
            id_user: '22222222-2222-2222-2222-222222222222',
            title: 'Clean Code',
            author: 'Robert C. Martin',
            status: 'done',
            rating: 5,
            cover_url: ''
        }

        // simulam ca repository a gasit cartea
        vi.mocked(bookRepository.deleteBooksById).mockResolvedValue(deletedBook)

        const result = await bookService.deleteBook(deletedBook.id_user,deletedBook.id)

        // service -> return cartea stearsa
        expect(result).toEqual(deletedBook)

        expect(bookRepository.deleteBooksById)
            .toHaveBeenCalledWith(
                deletedBook.id_user,
                deletedBook.id
            )
    })

    // sterge o carte care nu exista
    it('should reject deleting a non-existing book', async () => {
        // simulam -> nu s-a gasit cartea
        vi.mocked(bookRepository.deleteBooksById).mockResolvedValue(undefined)

        await expect(
            bookService.deleteBook(
                '22222222-2222-2222-2222-222222222222',
                '11111111-1111-1111-1111-111111111111'
            )
        ).rejects.toThrow('Book does not exist')
    })

    // update status + raiting
    it('should update a book status and rating', async () => {
        const updatedBook = {
            id: '11111111-1111-1111-1111-111111111111',
            id_user: '22222222-2222-2222-2222-222222222222',
            title: 'Clean Code',
            author: 'Robert C. Martin',
            status: 'done',
            rating: 5,
            cover_url: ''
        }

        // simulam rezultatul operatiei update
        vi.mocked(bookRepository.updateBookbyStatusAndRating).mockResolvedValue(updatedBook)

        const result = await bookService.updateBook(
            updatedBook.id_user,
            updatedBook.id,
            'done',
            5
        )

        // return cartea
        expect(result).toEqual(updatedBook)

        expect(bookRepository.updateBookbyStatusAndRating
        ).toHaveBeenCalledWith(
            updatedBook.id_user,
            updatedBook.id,
            'done',
            5
        )
    })

    // update o carte care nu exista
    it('should reject updating a non-existing book', async () => {
        // return undefined
        vi.mocked(bookRepository.updateBookbyStatusAndRating).mockResolvedValue(undefined)

        await expect(
            bookService.updateBook(
                '22222222-2222-2222-2222-222222222222',
                '11111111-1111-1111-1111-111111111111',
                'reading',
                4
            )
        ).rejects.toThrow('Book does not exist')
    })

    // upload cover - carte nu exista
    it('should not upload a cover when the book does not exist', async () => {
        // verif daca cartea exista
        vi.mocked(bookRepository.findBookById)
            .mockResolvedValue(undefined)

        const fromMock = vi.fn()

        supabase = {
            storage: {
                from: fromMock
            }
        } as unknown as SupabaseClient

        bookService = createBookService(
            bookRepository,
            supabase
        )

        const file = {
            originalname: 'cover.jpg',
            mimetype: 'image/jpeg',
            buffer: Buffer.from('fake-image')
        } as TestFile

        // service trebuie sa opreasca executia inainte de supabase
        await expect(
            bookService.updateBookCover(
                '22222222-2222-2222-2222-222222222222',
                '11111111-1111-1111-1111-111111111111',
                file
            )
        ).rejects.toThrow('Book does not exist')

        // supabase nu trebuie apelat daca utilizatorul nu are cartea
        expect(fromMock).not.toHaveBeenCalled()
    })

    // upload cover + update book URL
    it('should upload a cover and update the book URL', async () => {
        const book = {
            id: '11111111-1111-1111-1111-111111111111',
            id_user: '22222222-2222-2222-2222-222222222222',
            title: 'Clean Code',
            author: 'Robert C. Martin',
            status: 'reading',
            rating: 5,
            cover_url: ''
        }

        // simulam existenta cartii
        vi.mocked(bookRepository.findBookById).mockResolvedValue(book)

        // simulam upload-ul in Supabase
        const uploadMock = vi.fn().mockResolvedValue({error: null})

        // simulam URL public generat de Supabase
        const getPublicUrlMock = vi.fn().mockReturnValue({data: {publicUrl: 'https://example.com/cover.jpg'}})

        // simulam storage.from().
        const fromMock = vi.fn().mockReturnValue({upload: uploadMock,getPublicUrl: getPublicUrlMock})

        supabase = {storage: {from: fromMock}} as unknown as SupabaseClient

        bookService = createBookService(bookRepository,supabase)

        const updatedBook = {...book, cover_url: 'https://example.com/cover.jpg'}

        // simulam actualizarea URL
        vi.mocked(bookRepository.updateBookOnCover).mockResolvedValue(updatedBook)

        const file = {originalname: 'cover.jpg',mimetype: 'image/jpeg',buffer: Buffer.from('fake-image')} as TestFile

        const result = await bookService.updateBookCover(book.id_user,book.id,file)

        // verificam ca a fost folosit bucket-ul corect
        expect(fromMock).toHaveBeenCalledWith('book-covers')

        // nume fisier: contine idBook, timestam, extensia
        expect(uploadMock).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`^${book.id}-\\d+\\.jpg$`)),file.buffer,{contentType: file.mimetype})

        // verificam ca service-ul a cerut URL-ul public.
        expect(getPublicUrlMock).toHaveBeenCalled()

        // verificam ca URL-ul e trimis catre repository
        expect(bookRepository.updateBookOnCover).toHaveBeenCalledWith(book.id_user, book.id, 'https://example.com/cover.jpg')

        expect(result).toEqual(updatedBook)
    })
 })