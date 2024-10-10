import Router, { Request, Response } from 'express';
import fs, { chownSync } from 'fs';
import { pathToVevsFile, createRandomSuffix } from '../util';
import { Vev, User, VevDTO, UserDTO } from '../types';
import { getUserIdFromAdminKey, isAdminKeyValid } from './authRouter';
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
        const challenger = getUserFromUserId(vev.challengerId) as User;
        const challenged = getUserFromUserId(vev.challengedId) as User;
        const winner = vev.winnerId ? (getUserFromUserId(vev.winnerId) as User) : null;

        // Remove password from UserDTO
        delete challenger.password;
        delete challenged.password;
        if (winner) {
            delete winner.password;
        }

        return {
            id: vev.id,
            challenger,
            challenged,
            time: vev.time,
            reason: vev.reason,
            winner,
        };
    });

    res.send(returnVevs);
});

vevRouter.post('/', (req: Request, res: any) => {
    if (!isAdminKeyValid(req.body.adminKey)) {
        return res.status(401).json({ error: 'Invalid adminKey' });
    }

    const providedVev = req.body.newVev;
    if (Date.parse(providedVev.time) <= Date.now()) return res.status(400).send('Vev time must be in the future');
    if (providedVev.challenger.id !== getUserIdFromAdminKey(req.body.adminKey)) return res.status(401).send('Unauthorized');

    const newVev: Vev = {
        id: createRandomSuffix(),
        challengerId: providedVev.challenger.id,
        challengedId: providedVev.challenged.id,
        time: providedVev.time,
        reason: providedVev.reason,
        winnerId: null,
    };

    let vevs = getVevs();
    vevs.push(newVev);
    setVevs(vevs);
    return res.send(newVev);
});

vevRouter.put('/', (req: Request, res: any) => {
    if (!isAdminKeyValid(req.body.adminKey)) return res.status(401).send('Unauthorized');

    const providedVev = req.body.vev;
    const providedWinnerId = req.body.winnerId;

    let vevs = getVevs();
    const vevIndex = vevs.findIndex((vev: Vev) => vev.id === providedVev.id);
    if (vevIndex === -1) return res.status(404).send('Vev not found');

    if (vevs[vevIndex].challengerId !== getUserIdFromAdminKey(req.body.adminKey)) return res.status(401).send('Unauthorized');

    if (providedVev == null && providedWinnerId !== vevs[vevIndex].challengerId && providedWinnerId !== vevs[vevIndex].challengedId) return res.status(400).send('Winner must be either challenger, challenged or null');

    vevs[vevIndex].winnerId = providedWinnerId;
    setVevs(vevs);
    return res.send(vevs[vevIndex]);
});

vevRouter.delete('/', (req: Request, res: any) => {
    if (!isAdminKeyValid(req.body.adminKey)) return res.status(401).send('Unauthorized');

    const providedVev = req.body.vev;

    let vevs = getVevs();
    const vevIndex = vevs.findIndex((vev: Vev) => vev.id === providedVev.id);
    if (vevIndex === -1) return res.status(404).send('Vev not found');

    if (vevs[vevIndex].challenger.id !== getUserIdFromAdminKey(req.body.adminKey) || vevs[vevIndex].challenged.id !== getUserIdFromAdminKey(req.body.adminKey)) {
        return res.status(401).send('Unauthorized');
    }

    vevs.splice(vevIndex, 1);
    setVevs(vevs);
    res.send(`Vev with id ${providedVev.id} deleted`);
});


export default vevRouter;