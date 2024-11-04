import Router, { Request, Response } from 'express';
import fs, { chownSync } from 'fs';
import { pathToVevsFile, createRandomSuffix } from '../util';
import { verifyToken } from './authMiddleware';
import { Vev, User, VevDTO, UserDTO } from '../types';
import { getUserFromUserId } from './peopleRouter';

const vevRouter = Router();

function getVevs () {
    let vevs = fs.readFileSync(pathToVevsFile, 'utf8');
    return JSON.parse(vevs);
}

function setVevs (vevs: Vev[]) {
    fs.writeFileSync(pathToVevsFile, JSON.stringify(vevs, null, 2));
}

function getVevFromId(id: string) {
    let vevs = getVevs();
    return vevs.find((vev: Vev) => vev.id === id);
}


// API endpoints

vevRouter.get('/', (req, res) => {
    let vevs = getVevs();

    let returnVevs: VevDTO[] = vevs.map((vev: Vev) => {
        const challenger = getUserFromUserId(vev.challengerId);
        const challenged = getUserFromUserId(vev.challengedId);
        const winner = vev.winnerId ? getUserFromUserId(vev.winnerId) : null;

        // Remove password from UserDTO
        [challenger, challenged, winner].forEach((user: User | null) => {
            if (user) delete user.password;
        });


        return {
            id: vev.id,
            challenger: challenger,
            challenged: challenged,
            time: vev.time,
            reason: vev.reason,
            winner: winner,
        };
    });

    res.send(returnVevs);
});

vevRouter.post('/', verifyToken, (req: Request, res: any) => {
    const providedVev = req.body.newVev;
    const user: User = req.user as User;

    if (Date.parse(providedVev.time) <= Date.now()) return res.status(400).send('Vev time must be in the future');

    if (providedVev.challenger.id !== user.id) return res.status(401).send('User was trying to create a vev for another user');

    const newVev: Vev = {
        id: createRandomSuffix(),
        challengerId: providedVev.challenger.id,
        challengedId: providedVev.challenged.id,
        time: providedVev.time,
        reason: providedVev.reason,
    };

    let vevs = getVevs();
    vevs.push(newVev);
    setVevs(vevs);
    return res.send(newVev);
});

vevRouter.put('/', verifyToken, (req: Request, res: any) => {
    const user: User = req.user as User;

    const providedVev = req.body.vev;
    const providedWinnerId = req.body.winnerId;

    let vevs = getVevs();
    const vevIndex = vevs.findIndex((vev: Vev) => vev.id === providedVev.id);
    if (vevIndex === -1) return res.status(404).send('Vev not found');

    if (vevs[vevIndex].challengerId !== user.id) return res.status(401).send('Unauthorized');

    if (providedVev == null && providedWinnerId !== vevs[vevIndex].challengerId && providedWinnerId !== vevs[vevIndex].challengedId) return res.status(400).send('Winner must be either challenger, challenged or null');

    vevs[vevIndex].winnerId = providedWinnerId;
    setVevs(vevs);
    return res.send(vevs[vevIndex]);
});

vevRouter.delete('/', verifyToken, (req: Request, res: any) => {
    const user: User = req.user as User;

    const providedVev = req.body.vev;

    let vevs = getVevs();
    const vevIndex = vevs.findIndex((vev: Vev) => vev.id === providedVev.id);
    if (vevIndex === -1) return res.status(404).send('Vev not found');

    if (vevs[vevIndex].challenger.id !== user.id || vevs[vevIndex].challenged.id !== user.id) {
        return res.status(401).send('Unauthorized');
    }

    vevs.splice(vevIndex, 1);
    setVevs(vevs);
    res.send(`Vev with id ${providedVev.id} deleted`);
});


export default vevRouter;