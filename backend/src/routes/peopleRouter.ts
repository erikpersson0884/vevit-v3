import Router from 'express';
import fs from 'fs';
import {createRandomSuffix, pathToCredentialsFile } from '../util';
import { User } from '../types';
import { createAdminKey, getUserFromAdminKey, isAdminKeyValid } from './authRouter';


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

peopleRouter.post('/', (req, res) => { // Create new user
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

    const adminKey = createAdminKey(newPerson);
    delete newPerson.password;
    res.status(201).send({adminKey: adminKey, user: newPerson});
});

peopleRouter.put('/', (req, res) => { // Update user
    if (!req.body.adminKey) { res.status(401).send('AdminKey missing'); return; }
    if (!isAdminKeyValid(req.body.adminKey)) { res.status(401).send('Invalid adminkey'); return; }

    const providedUser = getUserFromAdminKey(req.body.adminKey);
    if (!providedUser) { res.status(404).send('User with that adminKey was not found'); return; }

    let people = getPeople();
    const foundPerson = people.find((person: User) => person.id === providedUser.id);
    if (!foundPerson) { res.status(404).send('User not found'); return; }

    foundPerson.name = providedUser.name || foundPerson.name;
    foundPerson.password = providedUser.password || foundPerson.password;

    setPeople(people);

    delete foundPerson.password;

    res.status(200).send(foundPerson);
});

peopleRouter.delete('/', (req, res) => { // Delete user
    if (!req.body.adminKey) { res.status(401).send('AdminKey missing'); return; }
    if (!isAdminKeyValid(req.body.adminKey)) { res.status(401).send('Invalid adminkey'); return; }

    const user = getUserFromAdminKey(req.body.adminKey);
    if (!user) { res.status(404).send('User with that adminKey was not found'); return; }
    if (user.type !== 'admin') { res.status(401).send('Only admins are allowed to delete users'); return; }

    let people = getPeople();
    const foundPerson = people.find((person: User) => person.id === req.body.userId);
    if (!foundPerson) { res.status(404).send('User not found'); return; }

    foundPerson.name = 'Deleted user';
    foundPerson.type = 'deleted';

    setPeople(people);

    res.status(200).send('User marked as deleted successfully');
});



peopleRouter.post('/getAllUsers', (req, res) => {
    if (!req.body.adminKey) { res.status(401).send('AdminKey missing'); return; }
    if (!isAdminKeyValid(req.body.adminKey)) { res.status(401).send('Invalid adminkey'); return; }
    const user = getUserFromUserId(req.body.adminKey);
    if (!user || user.type !== 'admin') { res.status(401).send('Only admins are allowed'); return; }

    let people = getPeople();

    res.send(people);
});

peopleRouter.put('/resetPassword', (req, res) => {
    if (!req.body.adminKey) { res.status(401).send('AdminKey missing'); return; }
    if (!isAdminKeyValid(req.body.adminKey)) { res.status(401).send('Invalid adminkey'); return; }

    const user: User = getUserFromAdminKey(req.body.adminKey);
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
