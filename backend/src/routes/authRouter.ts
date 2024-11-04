import Router from 'express';
import fs from 'fs';
import { pathToCredentialsFile } from '../util';
import {verifyToken} from './authMiddleware';
import { User } from '../types';
import { getUserFromCredentials } from './peopleRouter';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../util';

const authRouter = Router();

function getCredentials() {
    let credentials = fs.readFileSync(pathToCredentialsFile, 'utf8');
    return JSON.parse(credentials);
}

function credentialsIsValid(username: string, password: string) {
    const userCredentials = getCredentials();

    for (const user of userCredentials) {
        if (user.name === username && user.password === password) {
            return true;
        }
    }
    return false;
}

authRouter.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (credentialsIsValid(username, password)) {
        let user: User = getUserFromCredentials(username, password);
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

        delete user.password;
        res.status(200).json({ token, user });
        return;
    } else {
        res.status(401).json({ error: 'Username or password is incorrect' });
    }
});

authRouter.post('/validate', verifyToken, (req: Request, res: Response) => {
    if (req.user) {
        delete req.user.password;
        
        res.status(200).json({
            user: req.user
        });
    } else {
        res.status(401).json({
            valid: false,
            message: 'Token is invalid or expired',
        });
    }
});


export default authRouter;
