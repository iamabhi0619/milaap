export interface APIUser {
    _id: string,
    role: string | null,
    name: string,
    userId: string,
    gender: string | null,
    avatar: string | null,
    email: string,
    lastLogin: string
}