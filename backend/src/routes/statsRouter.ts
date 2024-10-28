import { Router } from 'express';

import { Vev } from '../types';

import { getVevs } from '../util';


function getStats(userId: string) {
    const vevs: Vev[] = getVevs();
    const userVevs: Vev[] = vevs.filter(vev => vev.challengerId === userId || vev.challengedId === userId);

    const totalVevs: number = userVevs.length;

    const amountOfVevs: number = vevs.filter(vev => vev.winnerId === userId).length;

    const amountOfLosses: number = vevs.filter(vev => vev.winnerId && vev.winnerId !== userId).length;


    return {
        totalVevs,
        totalAmount,
    };
}





const statsRouter = Router();

statsRouter.get('/', (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
        res.status(401).json({ error: 'userId is missing' }); return;
    }

    const vevs = getVevs();




});


export default statsRouter;
