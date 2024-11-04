import { Request, Response, NextFunction } from 'express';
import { JwtPayload, User } from '../types';
import jwt from 'jsonwebtoken';
import { getUserFromUserId } from './peopleRouter';

import { SECRET_KEY } from '../util';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access token missing or invalid' });
        return
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;    
        const user: User = getUserFromUserId(decoded.id);    
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error); // Log the error
        res.status(403).json({ message: 'Token is invalid or expired' });
        return
    }
};
