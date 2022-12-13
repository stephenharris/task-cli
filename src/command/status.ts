import chalk from "chalk"
import { getTasksWithOrdinal, Task, TaskWithOrdinal } from "../lib/tasks";
import { Disk } from "../lib/disk";

const localStore = Disk.getStore()

const findTask = (num: number) => {
    const numInt = parseInt(""+num);
    return getTasksWithOrdinal(localStore)
        .then((tasks: TaskWithOrdinal[]) => {
            return tasks.find((task: TaskWithOrdinal) => task.num === numInt)
        })
}

export const startCommand = (taskNumber: number, options: any, command: any) => {

    return findTask(taskNumber)
        .then((task: Task | undefined) =>{
            if (!task) {
                chalk.red(`Task ${taskNumber} not found.`)
                return;
            }

            task.status = 'in-progress';
            return localStore.setObject('todo', task.id, task);
        })
        .then((task: Task) =>{
            console.log(`Started task ${task.description}`);
        })
}

export const stopCommand = (taskId: number, options: any, command: any) => {

    return findTask(taskId)
        .then((task: Task | undefined) =>{
            if (task === undefined) {
                chalk.red(`Task ${taskId} not found.`)
                return;
            }
            task.status = 'todo';
            return localStore.setObject('todo', task.id, task);
        })
        .then((task: Task) =>{
            console.log(`Stopped task ${task.description}`);
        })
}

export const completeCommand = (taskId: number, options: any, command: any) => {

    return findTask(taskId)
        .then((task: Task | undefined) =>{
            if (task === undefined) {
                chalk.red(`Task ${taskId} not found.`)
                return;
            }
            task.status = 'complete';
            return localStore.setObject('todo', task.id, task);
        })
        .then((task: Task) =>{
            console.log(`Completed task ${task.description}`);
        })
}

export const deleteCommand = (taskId: number, options: any, command: any) => {

    return findTask(taskId)
        .then(async (task: Task | undefined) =>{
            if (task === undefined) {
                chalk.red(`Task ${taskId} not found.`)
                return;
            }

            await localStore.removeObject('todo', task.id);

            console.log(`Deleted task ${task.description}`);
        })
}