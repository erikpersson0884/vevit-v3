export interface AdminKey {
    key: string;
    userId: string;
    date: string;
}

export interface User {
    id: string;
    type?: "user" | "admin" | "deleted";
    name: string;
    password?: string;
    createdAt: Date;
}

export interface Vev {
    id: string;
    challengerId: string;
    challengedId: string;
    time: Date;
    reason: string;
    winnerId?: string | null;
    createdAt: Date;
}

export interface VevDTO {
    id: string;
    challenger: UserDTO | string;
    challenged: UserDTO | string;
    time: Date;
    reason: string;
    winner?: UserDTO | null;
}

export interface UserDTO {
    id: string;
    name: string;
}

export interface JwtPayload extends User {
    id: string;
}

declare module 'express' {
    export interface Request {
        user?: User;
    }
}

