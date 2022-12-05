import chalk from "chalk"
import { getTasksWithOrdinal, Task, TaskWithOrdinal } from "../data/tasks";
import { removeObject, setObject } from "../data/storage";

const findTask = (num: number) => {
    const numInt = parseInt(""+num);
    return getTasksWithOrdinal()
        .then((tasks) => {
            return tasks.find((task: TaskWithOrdinal) => task.num === numInt)
        })
}

export const startCommand = (taskNumber: number, options: any, command: any) => {

    return findTask(taskNumber)
        .then((task: Task) =>{
            if (!task) {
                chalk.red(`Task ${taskNumber} not found.`)
                return;
            }

            task.status = 'in-progress';
            return setObject('todo', task.id, task);
        })
        .then((task: Task) =>{
            console.log(`Started task ${task.description}`);
        })
}

export const stopCommand = (taskId: number, options: any, command: any) => {

    return findTask(taskId)
        .then((task: Task) =>{
            if (task === undefined) {
                chalk.red(`Task ${taskId} not found.`)
                return;
            }
            task.status = 'todo';
            return setObject('todo', task.id, task);
        })
        .then((task: Task) =>{
            console.log(`Stopped task ${task.description}`);
        })
}

export const completeCommand = (taskId: number, options: any, command: any) => {

    return findTask(taskId)
        .then((task: Task) =>{
            if (task === undefined) {
                chalk.red(`Task ${taskId} not found.`)
                return;
            }
            task.status = 'complete';
            return setObject('todo', task.id, task);
        })
        .then((task: Task) =>{
            console.log(`Completed task ${task.description}`);
        })
}

export const deleteCommand = (taskId: number, options: any, command: any) => {

    return findTask(taskId)
        .then(async (task: Task) =>{
            if (task === undefined) {
                chalk.red(`Task ${taskId} not found.`)
                return;
            }

            await removeObject('todo', task.id);

            console.log(`Deleted task ${task.description}`);
        })
}