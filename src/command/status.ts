import chalk from "chalk"
import { Task, TaskService } from "../lib/tasks";
import { Disk } from "../lib/disk";

const taskService = new TaskService(Disk.getStore())

export const startCommand = (taskNumber: string, options: any, command: any) => {

    return taskService.findTask(taskNumber)
        .then((task: Task | undefined) =>{
            if (!task) {
                throw Error(`Task ${taskNumber} not found.`)
            }

            task.status = 'in-progress';
            return taskService.updateTask(task);
        })
        .then((task: Task) =>{
            console.log(`Started task ${task.id.slice(0,6)}: ${task.description}`);
        })
}

export const stopCommand = (taskId: string, options: any, command: any) => {

    return taskService.findTask(taskId)
        .then((task: Task | undefined) =>{
            if (task === undefined) {
                throw Error(`Task ${taskId} not found.`)
            }
            task.status = 'todo';
            return taskService.updateTask(task);
        })
        .then((task: Task) =>{
            console.log(`Stopped task ${task.id.slice(0,6)}: ${task.description}`);
        })
}

export const completeCommand = (taskId: string, options: any, command: any) => {

    return taskService.findTask(taskId)
        .then((task: Task | undefined) =>{
            if (task === undefined) {
                throw Error(`Task ${taskId} not found.`);
            }
            task.status = 'complete';
            return taskService.updateTask(task);
        })
        .then((task: Task) =>{
            console.log(`Completed task ${task.id.slice(0,6)}: ${task.description}`);
        })
}

export const deleteCommand = (taskId: string, options: any, command: any) => {

    return taskService.findTask(taskId)
        .then(async (task: Task | undefined) =>{
            if (task === undefined) {
                chalk.red(`Task ${taskId} not found.`)
                return;
            }

            await taskService.deleteTask(task.id);

            console.log(`Deleted task ${task.id.slice(0,6)}: ${task.description}`);
        })
}