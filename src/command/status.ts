import chalk from "chalk"
import { findTask, Task } from "../lib/tasks";
import { Disk } from "../lib/disk";

const localStore = Disk.getStore()

export const startCommand = (taskNumber: number, options: any, command: any) => {

    return findTask(taskNumber, localStore)
        .then((task: Task | undefined) =>{
            if (!task) {
                chalk.red(`Task ${taskNumber} not found.`)
                return;
            }

            task.status = 'in-progress';
            return localStore.setObject('todo', task.id, task);
        })
        .then((task: Task) =>{
            console.log(`Started task ${task.id.slice(0,6)}: ${task.description}`);
        })
}

export const stopCommand = (taskId: number, options: any, command: any) => {

    return findTask(taskId, localStore)
        .then((task: Task | undefined) =>{
            if (task === undefined) {
                chalk.red(`Task ${taskId} not found.`)
                return;
            }
            task.status = 'todo';
            return localStore.setObject('todo', task.id, task);
        })
        .then((task: Task) =>{
            console.log(`Stopped task ${task.id.slice(0,6)}: ${task.description}`);
        })
}

export const completeCommand = (taskId: number, options: any, command: any) => {

    return findTask(taskId, localStore)
        .then((task: Task | undefined) =>{
            if (task === undefined) {
                chalk.red(`Task ${taskId} not found.`)
                return;
            }
            task.status = 'complete';
            return localStore.setObject('todo', task.id, task);
        })
        .then((task: Task) =>{
            console.log(`Completed task ${task.id.slice(0,6)}: ${task.description}`);
        })
}

export const deleteCommand = (taskId: number, options: any, command: any) => {

    return findTask(taskId, localStore)
        .then(async (task: Task | undefined) =>{
            if (task === undefined) {
                chalk.red(`Task ${taskId} not found.`)
                return;
            }

            await localStore.removeObject('todo', task.id);

            console.log(`Deleted task ${task.id.slice(0,6)}: ${task.description}`);
        })
}