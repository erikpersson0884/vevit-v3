
import { User, Vev, userStats } from '../types';


export function getUserStats(user: User, allVevs: Vev[]): userStats {

    const finishedVevs = allVevs.filter((vev: Vev) => vev.winner);

    const numberOfVevs = finishedVevs.filter((vev: Vev) =>
        vev.challenger.id === user.id ||
        vev.challenged.id === user.id)
        .length;

    const numberOfVevsWon = finishedVevs.filter((vev: Vev) => vev.winner && (vev.winner.id === user.id)).length;
    const numberOfVevsLost = finishedVevs.filter((vev: Vev) => vev.winner && (vev.winner.id !== user.id) && (vev.challenger.id === user.id || vev.challenged.id === user.id)).length;

    let winPercentage: number;
    if (numberOfVevsWon + numberOfVevsLost == 0) winPercentage = 0;
    else winPercentage = (numberOfVevsWon / (numberOfVevsWon + numberOfVevsLost)) * 100;

    winPercentage = Math.round(winPercentage);

    console.log(user.name, numberOfVevs, numberOfVevsWon, numberOfVevsLost, winPercentage);

    const stats: userStats = {
        user,
        numberOfVevs,
        numberOfVevsWon,
        numberOfVevsLost,
        winPercentage
    };

    return stats;
}