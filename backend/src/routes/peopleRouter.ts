import Router, { Request, Response } from 'express';
import fs from 'fs';
import {createRandomSuffix, pathToCredentialsFile } from '../util';
import { User } from '../types';
import {verifyToken} from './authMiddleware';


const peopleRouter = Router();

const getPeople = () => {
    let people = fs.readFileSync(pathToCredentialsFile, 'utf8');
    return JSON.parse(people);
}

const setPeople = (people: User[]) => {
    fs.writeFileSync(pathToCredentialsFile, JSON.stringify(people, null, 2));
}

export const getUserFromUserId = (userId: string): User => {
    const people: User[] = getPeople();
    const foundPerson: User | undefined = people.find((person: User) => person.id === userId);
    if (!foundPerson) { throw new Error(`User with id ${userId} was not found`); }
    return foundPerson;
}

export function getUserFromCredentials(username: string, password: string): User {
    let people: User[] = getPeople();
    const foundPerson: User | undefined = people.find((person: any) => person.name === username && person.password === password);

    if (foundPerson) {
        return foundPerson;
    } else {
        throw new Error('User not found');
    }
}


peopleRouter.get('/', (req, res) => {
    let people = getPeople();

    people.forEach((person: any) => {
        delete person.password;
    });

    res.send(people);
});


peopleRouter.post('/', verifyToken, (req: Request, res: Response) => { // Create new user
    let people = getPeople();

    if (!req.body.newUser.name || !req.body.newUser.password) { res.status(400).send('Missing name or password'); return; }
    for (const person of people) { if (person.name === req.body.newUser.name) { res.status(409).send(`User with username ${person.username} already exists`); return;}}

    const newPerson: User = {
        id: createRandomSuffix(),
        name: req.body.newUser.name,
        password: req.body.newUser.password,
        type: 'user'
    };

    people.push(newPerson);
    setPeople(people);

    res.status(201).send({user: newPerson});
});

peopleRouter.put('/', verifyToken, (req: Request, res: Response) => { // Update user
    const user: User = req.user as User; // Ensure req.user is populated by verifyToken
    const newUserInfo = req.body.user;
    if (!newUserInfo) { res.status(400).send('No user information was provided'); return; }


    if (user.id !== newUserInfo.id && user.type !== 'admin') { res.status(401).send('You can only update your own user information'); return; }

    let people = getPeople();
    const foundPerson = people.find((person: User) => person.id === newUserInfo.id); // Find the user by ID

    if (!foundPerson) { 
        res.status(404).send('User not found'); 
        return;
    }

    foundPerson.name = newUserInfo.name || foundPerson.name;
    foundPerson.password = newUserInfo.password || foundPerson.password;

    setPeople(people);

    delete foundPerson.password;
    res.status(200).send({user: foundPerson});
});


peopleRouter.delete('/', verifyToken, (req: Request, res: Response) => { // Delete user
    const user: User = req.user as User;
    if (user.type !== 'admin') { res.status(401).send('Only admins are allowed to delete users'); return; }

    let people = getPeople();
    const foundPerson = people.find((person: User) => person.id === req.body.userId);
    if (!foundPerson) { res.status(404).send('User not found'); return; }

    foundPerson.name = 'Deleted user';
    foundPerson.type = 'deleted';

    setPeople(people);

    res.status(200).send('User marked as deleted successfully');
});


peopleRouter.post('/getAllUsers', verifyToken, (req: Request, res) => {
    const user: User = req.user as User;
    if (!user || user.type !== 'admin') { res.status(401).send('Only admins are allowed'); return; }

    let people = getPeople();

    res.send(people);
});

peopleRouter.put('/resetPassword', verifyToken, (req: Request, res) => {
    const user: User = req.user as User;

    if (!(user.type === 'admin')) { res.status(401).send('Only admins are allowed to reset passwords'); return; }

    const userId = req.body.userId;
    if (!userId) { res.status(400).send('Missing userId'); return; }

    let people = getPeople();
    const foundPerson = people.find((person: User) => person.id === userId);
    if (!foundPerson) { res.status(404).send('User not found'); return; }

    foundPerson.password = '1234';

    setPeople(people);

    res.status(200).send(`Password for user ${foundPerson.name} updated successfully`);
});

export default peopleRouter;
