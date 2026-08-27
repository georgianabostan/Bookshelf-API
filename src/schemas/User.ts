export interface User {
    id: string,
    email: string,
    password: string,
    role: string
    createdAt: Date
}

export const users: User[] = []