import chalk from "chalk"
import { getTasks, Task } from "../data/tasks";
import Table from "cli-table3";
import { setObject } from "../data/storage";
import { v4 as uuid } from 'uuid';
import * as chrono from 'chrono-node';


export const addCommand = (description: string, options: any, command: any) => {

    const id = uuid();
    const task = {
        id: id,
        description: description,
        category: options.tag ? options.tag : null,
        date: options.due ? chrono.parseDate(options.due) : null,
    }
    console.log(options.due);
    console.log(chrono.parseDate(options.due).toISOString());
    return setObject("todo", id, task)
        .then(() => console.log("Created task"));
}