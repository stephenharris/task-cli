import { promises as fs } from 'fs';
import path from "path"
import {homedir} from "os"
import { LocalStore, State } from './state';
import { Task } from './tasks';

const directory =  path.join(homedir(), '.todo');

export class Disk implements LocalStore {

    private static instance: Disk;

    static getStore(): Disk{

        if (!Disk.instance) {
            Disk.instance = new Disk()
        }

        return Disk.instance;   
    }


    public getCachedState() {
        return this.get("cachedstate")
    }

    public setCachedState(data: State) {
        return this.set("cachedstate", data).then(() => data);
    }

    public setTodo(id: string, task: Task) {
      return this.setObject("todo", id, task)
    } 

    public getTasks(){
        return this.get("todo").then((tasks) => tasks ? tasks : [])
    };

    set(key: string, val: any) {
        const location =  path.join(directory, key + '.json');
        return fs.mkdir(path.dirname(location), {recursive: true})
            .then(x => fs.writeFile(location, JSON.stringify(val )))
    }

    get(key: string) {
        const location =  path.join(directory, key + '.json');
        return fs.access(location)
            .then(() => fs.readFile(location, "utf8").then((data) => JSON.parse(data)))
            .catch((err) => {
                if (err.code !== "ENOENT") {
                    throw err;
                }
                return this.set(key, null).then(() => fs.readFile(location, "utf8").then((data) => JSON.parse(data)));
            })
    }

    async setObject(key: string, id: string, val: any) {
    
        if (val.num) {
            delete val.num;
        }
        
        let all = await this.get(key);
        all = all ? all : [];
        const objIndex = await all.findIndex((a: any) => a.id === id);
    
        if (objIndex === -1) {
            all.push(val)
        } else {
            all[objIndex] = val;
        }
        await this.set(key, all);
        return val;
    }
    
    async removeObject(key: string, id: string) {
 
        let all = await this.get(key);
        all = all ? all : [];
        const objIndex = await all.findIndex((a: any) => a.id === id);
    
        all.splice(objIndex, 1);
        this.set(key, all);
    }
    
    async getObject(key: string, id: string) {
    
        let all = await this.get(key);
        all = all ? all : [];
    
        const obj = await all.filter((a: any) => a.id === id)[0];
        return obj;
    }
}
