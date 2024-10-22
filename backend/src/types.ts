

export interface AdminKey {
    key: string;
    userId: string;
    date: string;
}

export interface User {
    id: string;
    type?: "user" | "admin";
    name: string;
    password?: string;
}

export interface Vev {
    id: string;
    challengerId: string;
    challengedId: string;
    time: string;
    reason: string;
    winnerId: string | null;
}

export interface VevDTO {
    id: string;
    challenger: UserDTO;
    challenged: UserDTO;
    time: string;
    reason: string;
    winner: UserDTO | null;
}

export interface UserDTO {
    id: string;
    name: string;
}