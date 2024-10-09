import Router from 'express';
import fs from 'fs';
import {pathToCredentialsFile } from '../util';
import { User } from '../types';


const peopleRouter = Router();

const getPeople = () => {
    let people = fs.readFileSync(pathToCredentialsFile, 'utf8');
    return JSON.parse(people);
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

export default peopleRouter;
