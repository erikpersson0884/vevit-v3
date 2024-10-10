import Router from 'express';
import fs from 'fs';
import {createRandomSuffix, pathToCredentialsFile } from '../util';
import { User } from '../types';
import { create } from 'domain';


const peopleRouter = Router();

const getPeople = () => {
    let people = fs.readFileSync(pathToCredentialsFile, 'utf8');
    return JSON.parse(people);
}

const setPeople = (people: User[]) => {
    fs.writeFileSync(pathToCredentialsFile, JSON.stringify(people, null, 2));
}

export const getUserFromUserId = (userId: string): User | null => {
    let people: User[] = getPeople();
    const foundPerson: User | undefined = people.find((person: User) => person.id === userId);
    if (foundPerson) {
        return foundPerson;
    } else {
        return null;
    }
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

peopleRouter.post('/', (req, res) => {
    let people = getPeople();

    if (!req.body.newUser.name || !req.body.newUser.password) { res.status(400).send('Missing name or password'); return;}
    for (const person of people) { if (person.name === req.body.newUser.name) { res.status(409).send(`User with username ${person.username} already exists`); return;}}

    const newPerson = {
        id: createRandomSuffix(),
        name: req.body.newUser.name,
        password: req.body.newUser.password,
    };
    people.push(newPerson);
    setPeople(people);
    res.status(201).send(newPerson);
});


export default peopleRouter;
