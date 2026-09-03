import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.ts'

describe('Auth API', () => {

    // email unic
    const email = `test-${Date.now()}@example.com`

    const password = 'Test123456'

    // token pt teste viitoare
    let token: string


// register
    // register - succes
    it('should register a new user', async () => {

        // trimit o cerere POST catre endpoint-ul de register.
        const response = await request(app)
            .post('/auth/register')
            .send({
                email,
                password,
                role: 'user'
            })

        // user-ul ar trebui sa fie creat cu status 201.
        expect(response.status).toBe(201)

        // verificam mesajul trimis de controller
        expect(response.body).toEqual({
            message: 'User registered successfully'
        })
    })


    // register - email invalid
    it('should reject register with an invalid email', async () => {

        // email - nu respecta schema Zod
        const response = await request(app)
            .post('/auth/register')
            .send({
                email: 'invalid-email',
                password,
                role: 'user'
            })

        // middleware de validare -> returneaza 400
        expect(response.status).toBe(400)

        // verific mesaj general de validare
        expect(response.body.message).toBe('Validation failed')

        // verific -> exista erori de validare
        expect(response.body.errors).toBeInstanceOf(Array)

        // verific eroarea -> pt campul email
        expect(response.body.errors[0].field).toBe('email')
    })


    // register - parola prea scurta
    it('should reject register with a short password', async () => {

        // password - 6 caractere.
        const response = await request(app)
            .post('/auth/register')
            .send({
                email: `short-${Date.now()}@example.com`,
                password: '123',
                role: 'user'
            })

        expect(response.status).toBe(400)

        expect(response.body.message).toBe('Validation failed')

        // verificam eroare -> campului password
        expect(
            response.body.errors.some(
                (error: { field: string }) => error.field === 'password'
            )
        ).toBe(true)
    })


    // register - email lipsa
    it('should reject register without an email', async () => {

        // fara email
        const response = await request(app)
            .post('/auth/register')
            .send({
                password,
                role: 'user'
            })

        expect(response.status).toBe(400)

        expect(response.body.message).toBe('Validation failed')

        // verificam eroare -> email
        expect(
            response.body.errors.some(
                (error: { field: string }) => error.field === 'email'
            )
        ).toBe(true)
    })




// login
    // login - succes
    it('should login the registered user and return a JWT', async () => {

        // user-ul de la primul test
        const response = await request(app)
            .post('/auth/login')
            .send({
                email,
                password
            })

        expect(response.status).toBe(200)

        // verificam ca exista token
        expect(response.body).toHaveProperty('token')

        expect(typeof response.body.token).toBe('string')

        // salvamm token pt testele urmatoare
        token = response.body.token
    })


    // login - parola gresita

    it('should reject login with an incorrect password', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({
                email,
                password: 'WrongPassword123'
            })

        expect(response.status).toBe(401)

        expect(response.body).toHaveProperty(
            'message',
            'Invalid credentials'
        )
    })


    // login - user inexistent
    it('should reject login for a non-existing user', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: `does-not-exist-${Date.now()}@example.com`,
                password
            })

        expect(response.status).toBe(401)

        expect(response.body).toHaveProperty(
            'message',
            'Invalid credentials'
        )
    })


    // login - email invalid
    it('should reject login with an invalid email', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'not-an-email',
                password
            })

        expect(response.status).toBe(400)

        expect(response.body.message).toBe('Validation failed')
    })

// protected profile
    // protected profile - fara token

    it('should reject access to profile without a token', async () => {

        const response = await request(app)
            .get('/protected/profile')

        expect(response.status).toBe(401)

        expect(response.body).toEqual({
            message: 'Access denied. No token provided.'
        })
    })


    // protected profile - token invalid

    it('should reject access to profile with an invalid token', async () => {

        const response = await request(app)
            .get('/protected/profile')
            .set('Authorization', 'Bearer invalid-token')

        expect(response.status).toBe(401)

        expect(response.body).toEqual({
            message: 'Invalid or expired token'
        })
    })


    // protected profile - token valid

    it('should access the protected profile with a valid JWT', async () => {

        // token de la login
        const response = await request(app)
            .get('/protected/profile')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)

        expect(response.body).toHaveProperty(
            'message',
            'This is a protected user profile route'
        )

        // datele user -> req.user
        expect(response.body.user).toMatchObject({
            role: 'user'
        })

        expect(response.body.user).toHaveProperty('userId')
    })


    // ADMIN ROUTE - user normal

    it('should reject a normal user from accessing the admin route', async () => {

        // token -> user: role = user
        const response = await request(app)
            .get('/protected/admin')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(403)

        expect(response.body).toEqual({
            message:
                'Access denied. You do not have the right permissions.'
        })
    })

})