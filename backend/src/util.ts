import fs from "fs"

import { User, Vev } from "./types";
import dotenv from 'dotenv';


dotenv.config();


const dataFolderPath:string = "data/";
export const pathToCredentialsFile: string = dataFolderPath + "people.json";
export const pathToAdminkeysFile: string = dataFolderPath + "adminKeys.json";

export const pathToVevsFile: string = dataFolderPath + "vevs.json";


export const adminKeysLifeTime = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds


export function createRandomSuffix() {
	return Date.now() + '-' + Math.round(Math.random() * 1E9)
}



export function initiateDataFiles() {
    const folders = [dataFolderPath];

    folders.forEach((folder: string) => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    });

    const files = [pathToAdminkeysFile, pathToVevsFile];

    files.forEach((file: string) => {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify([]));
        }
    });

    if (!fs.existsSync(pathToCredentialsFile)) {
        writeJsonToFile(pathToCredentialsFile, [
            {
                id: createRandomSuffix(),
                name: process.env.DEFUALT_ADMIN_NAME,
                password: process.env.DEFAULT_ADMIN_PASSWORD,
                type: 'admin'
            }
        ]);
    }
}

export function readFileToJson(path: string) {
    const data = fs.readFileSync(path);
    return JSON.parse(data.toString());
}

export function writeJsonToFile(path: string, data: any) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

export function getVevs(): Vev[] {
    return readFileToJson(pathToVevsFile);
}

export function getPeople(): User {
    return readFileToJson(pathToCredentialsFile);
}

