import Router from 'express';
import fs from 'fs';
import {pathToCredentialsFile, pathToAdminkeysFile, adminKeysLifeTime} from '../util';
import { AdminKey, User } from '../types';
import { getUserFromUserId, getUserFromCredentials } from './peopleRouter';


const authRouter = Router();


function getCredentials() {
    let credentials = fs.readFileSync(pathToCredentialsFile, 'utf8');
    return JSON.parse(credentials);
}

function getAdminKeys() {
    if (fs.existsSync(pathToAdminkeysFile)) {
        const adminKeys = fs.readFileSync(pathToAdminkeysFile, 'utf8');
        return JSON.parse(adminKeys);
    }
    else {
        throw new Error('Adminkeys file not found');
    }
}

export function createAdminKey(user: User): string {
    let adminKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    saveAdminKey(adminKey, user.id);
    return adminKey;
}




function credentialsIsValid(username: string, password:string) {
    const userCredentials = getCredentials();

    for (const user of userCredentials) {
        if (user.name === username && user.password === password) {
        return true;
        }
    }
    return false;
}

export function getUserFromAdminKey(providedAdminKey: string): User | null {
    let adminKeys = getAdminKeys();

    for (const keyToTest of adminKeys) {
        if (keyToTest.key === providedAdminKey) {
            return getUserFromUserId(keyToTest.userId);
        }
    }

    return null;
}

export function getUserIdFromAdminKey(providedAdminKey: string): string | null {
    let user = getUserFromAdminKey(providedAdminKey);
    if (!user) {
        return null;
    }
    return user.id;
}

export function getUsernameFromAdminKey(providedAdminKey: string) {
    let user = getUserFromAdminKey(providedAdminKey);
    if (!user) {
        return null;
    }
    return user.name;
}

function saveAdminKey(adminKey:string, userId:string) {
    const currentDate = new Date().toISOString();
    const newAdminKey: AdminKey = { 
        key: adminKey, 
        userId: userId, 
        date: currentDate,
    };

    let adminKeys = getAdminKeys();

    adminKeys.push(newAdminKey);

    fs.writeFileSync(pathToAdminkeysFile, JSON.stringify(adminKeys, null, 2));
}

export function isAdminKeyValid(adminKeyData: string) {
    const currentDate = new Date();
    const tenDaysAgo = new Date(currentDate.getTime() - (adminKeysLifeTime));
    const adminKeys = getAdminKeys();

    const foundAdminKey = adminKeys.find((keyData: AdminKey) => keyData.key === adminKeyData);
    if (!foundAdminKey) {
        return false; // Admin key not found
    }

    const savedDate = new Date(foundAdminKey.date); 
    return savedDate >= tenDaysAgo;
}


function removeUnvalidAdminKeys() {
    const currentDate = new Date();
    const tenDaysAgo = new Date(currentDate.getTime() - (adminKeysLifeTime));
    let adminKeys = getAdminKeys();

    adminKeys = adminKeys.filter((keyData: AdminKey) => {
        const savedDate = new Date(keyData.date);
        return savedDate >= tenDaysAgo;
    });

    fs.writeFileSync(pathToAdminkeysFile, JSON.stringify(adminKeys, null, 2));
}

authRouter.post('/login', (req, res) => {
    removeUnvalidAdminKeys();
    if (!req.body.name || !req.body.password) { res.status(400).json({ error: 'Missing name or password' }); return; }

    const username = req.body.name; 
    const password = req.body.password;
  
    if (credentialsIsValid(username, password)) {
        let user: User = getUserFromCredentials(username, password);
        let adminKey = createAdminKey(user);
        delete user.password;
        res.status(200).json({ adminKey: adminKey, user: user }); 
        return;
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
});

authRouter.post('/testAdminKey', (req, res) => {
    const adminKey = req.body.adminKey;

    if (isAdminKeyValid(adminKey)) {
        let user = getUserFromAdminKey(adminKey);
        if (user) {
            delete user.password;
        }
        res.status(200).json({ user: user });
    } else {
        res.status(401).json("Adminkey is not valid");
    }
});

export default authRouter