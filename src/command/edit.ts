import { Disk } from "../lib/disk";
import { findTask, Task, TaskSchema, TaskWithOrdinal } from "../lib/tasks";
import chalk from "chalk";
import { stringify } from 'yaml'
import inquirer from "inquirer"
import {YAML} from "yaml-schema"

const localStore = Disk.getStore()

const editTask = (taskDetails: string, taskID: string): Promise<any> => {
    
    return inquirer.prompt([
        {type:"editor", name: "task", default: taskDetails, message: `Edit task ${taskID}`}
    ])
    .then((answer: any) => {
        const yaml = new YAML(TaskSchema)

        try {
            const t = yaml.parse(answer["task"])
            return t;
        } catch (e: any) {
            console.log(chalk.red(`Error editing task: ${e.message}`));
            return editTask(answer["task"], taskID)
        }
    })
}

export const editCommand = (taskNumber: number, options: any, command: any) => {

    return findTask(taskNumber, localStore)
        .then((task: TaskWithOrdinal | undefined) =>{
            if (!task) {
                chalk.red(`Task ${taskNumber} not found.`)
                return;
            }

            const { id, num, ...taskDetails } = task;

            return editTask(`# Edit task ${task.id}\n\n` + stringify(taskDetails), id)
            
            .then((task: Task) => {
                task.id = id;
                return localStore.setObject('todo', task.id, task);
            })
            .then(() => {
                console.log(`Task ${task.id.slice(0,6)} updated`)
            });

        })
}