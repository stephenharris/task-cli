import { Disk } from "../lib/disk";
import { v4 as uuid } from 'uuid';
import * as chrono from 'chrono-node';
import { getTasksWithOrdinal, Task, TaskSchema, TaskWithOrdinal } from "../lib/tasks";
import chalk from "chalk";
import { parse, stringify } from 'yaml'
import inquirer from "inquirer"
import {YAML} from "yaml-schema"

const localStore = Disk.getStore()

const findTask = (num: number) => {
    const numInt = parseInt(""+num);
    return getTasksWithOrdinal(localStore)
        .then((tasks: TaskWithOrdinal[]) => {
            return tasks.find((task: TaskWithOrdinal) => task.num === numInt)
        })
}

const editTask = (taskDetails: string): Promise<any> => {
    
    return inquirer.prompt([
        {type:"editor", name: "task", default: taskDetails, message: "Edit task"}
    ])
    .then((answer: any) => {
        const yaml = new YAML(TaskSchema)

        try {
            const t = yaml.parse(answer["task"])
            return t;
        } catch (e: any) {
            console.log(chalk.red(`Error editing task: ${e.message}`));
            return editTask(answer["task"])
        }
    })
}

export const editCommand = (taskNumber: number, options: any, command: any) => {

    return findTask(taskNumber)
        .then((task: TaskWithOrdinal | undefined) =>{
            if (!task) {
                chalk.red(`Task ${taskNumber} not found.`)
                return;
            }

            const { id, num, ...taskDetails } = task;

            return editTask(stringify(taskDetails))
            
            .then((task: Task) => {
                task.id = id;
                return localStore.setObject('todo', task.id, task);
            })
            .then(() => {
                console.log("Task updated")
            });

        })
}