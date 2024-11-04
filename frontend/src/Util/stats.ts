
import { User, Vev, userStats } from '../types';


export function getUserStats(user: User, allVevs: Vev[]): userStats {
    const numberOfVevs = allVevs.filter((vev: Vev) => vev.challenger.id === user.id ||vev.challenged.id === user.id).length;
    const numberOfVevsWon = allVevs.filter((vev: Vev) => vev.winner && (vev.winner.id === user.id)).length;
    const numberOfVevsLost = numberOfVevs - numberOfVevsWon;

    let winPercentage: number = (numberOfVevsWon / (numberOfVevsWon + numberOfVevsLost)) * 100;
    winPercentage = Math.round(winPercentage);

    const stats: userStats = {
        user,
        numberOfVevs,
        numberOfVevsWon,
        numberOfVevsLost,
        winPercentage
    };

    return stats;
}