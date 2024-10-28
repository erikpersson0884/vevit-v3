
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

export interface userStats {
    numberOfVevs: number;
    numberOfWins: number;
    numberOfLosses: number;

    timesChallangedOthers: number;
    timesChallenged: number;
}
