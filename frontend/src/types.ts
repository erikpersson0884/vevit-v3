
export interface Vev {
    id: string;
    challenger: User;
    challenged: User;
    time: Date;
    reason: string;
    winner: User | null;
}

export interface User {
    id: string;
    name: string;
}

export interface userStats {
    user: User;
    
    numberOfVevs: number;
    numberOfVevsWon: number;
    numberOfVevsLost: number;
    winPercentage?: number;
}
