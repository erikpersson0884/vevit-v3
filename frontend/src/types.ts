
export interface Vev {
    id: string;
    challenger: string;
    challenged: string;
    time: string;
    reason: string;
    winner: string | null;
}


export interface User {
    id: string;
    name: string;
}