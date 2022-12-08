import { promises as fs } from 'fs';
import path from "path"
import {homedir} from "os"

const directory =  path.join(homedir(), '.todo');

export const set = (key: string, val: any) => {
    const location =  path.join(directory, key + '.json');
    return fs.mkdir(path.dirname(location), {recursive: true})
        .then(x => fs.writeFile(location, JSON.stringify(val )))
}

export const get = async (key: string) => {
    const location =  path.join(directory, key + '.json');
    return fs.access(location)
        .then(() => fs.readFile(location, "utf8").then((data) => JSON.parse(data)))
        .catch((err) => {
            if (err.code !== "ENOENT") {
                throw err;
            }
            return set(key, null).then(() => fs.readFile(location, "utf8").then((data) => JSON.parse(data)));
        })
}

export const setObject = async (key: string, id: string, val: any) => {
    
    if (val.num) {
        delete val.num;
    }
    
    let all = await get(key);
    all = all ? all : [];
    const objIndex = await all.findIndex((a: any) => a.id === id);

    if (objIndex === -1) {
        all.push(val)
    } else {
        all[objIndex] = val;
    }
    await set(key, all);
    return val;
}

export const removeObject = async (key: string, id: string) => {

    let all = await get(key);
    all = all ? all : [];
    const objIndex = await all.findIndex((a: any) => a.id === id);

    all.splice(objIndex, 1);
    set(key, all);
}

export const getObject = async (key: string, id: string) => {

    let all = await get(key);
    all = all ? all : [];

    const obj = await all.filter((a: any) => a.id === id)[0];
    return obj;
}