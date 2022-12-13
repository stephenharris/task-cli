import { Disk } from "../lib/disk";
import { v4 as uuid } from 'uuid';
import * as chrono from 'chrono-node';


export const addCommand = (description: string, options: any, command: any) => {

    const id = uuid();
    const task = {
        id: id,
        description: description,
        tags: options.tag ? options.tag.split(',') : null,
        date: options.due ? chrono.parseDate(options.due).toISOString() : null,
        status: "todo"
    }

    const localStore = Disk.getStore();
    //setTodo
    return localStore.setTodo(id, task)
        .then(() => console.log("Created task"));
}