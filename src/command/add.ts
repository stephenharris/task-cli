import { Disk } from "../lib/disk";
import { v4 as uuid } from 'uuid';
import * as chrono from 'chrono-node';
import { TaskService } from "../lib/tasks";

export const addCommand = (description: string, options: any, command: any) => {

    const id = uuid();
    const task = {
        id: id,
        description: description,
        tags: options.tag ? options.tag.split(',') : null,
        date: options.due ? chrono.parseDate(options.due).toISOString() : null,
        status: "todo"
    }

    const taskService = new TaskService(Disk.getStore())
    
    return taskService.updateTask(task)
        .then(() => console.log(`Created task ${id.slice(0,6)}`));
}