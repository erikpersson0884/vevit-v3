
export interface Vev {
    id: string;
    challenger: User;
    challenged: User;
    time: string;
    reason: string;
    winner: User | null;
}


export interface User {
    id: string;
    name: string;
}