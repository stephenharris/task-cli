import { Disk } from "../lib/disk";
import { Task, TaskSchema, TaskService, TaskWithOrdinal } from "../lib/tasks";
import chalk from "chalk";
import { stringify } from 'yaml'
import inquirer from "inquirer"
import {YAML} from "yaml-schema"
import { deepEqual } from "../lib/util";
import moment from "moment";

const taskService = new TaskService(Disk.getStore())

const editTask = (taskDetails: string, taskID: string): Promise<any> => {
    
    return inquirer.prompt([
        {type:"editor", name: "task", default: taskDetails, message: `Edit task ${taskID}`}
    ])
    .then((answer: any) => {
        const yaml = new YAML(TaskSchema)

        try {
            const t = yaml.parse(answer["task"]) as Task
            if(t.date && !moment(t.date).isValid()) {
                throw Error(`'${t.date}' is not a valid date`)
            }

            return t;
        } catch (e: any) {
            console.log(chalk.red(`Error editing task: ${e.message}`));
            return editTask(answer["task"], taskID)
        }
    })
}

export const editCommand = (taskNumber: string, options: any, command: any) => {

    return taskService.findTask(taskNumber)
        .then((task: TaskWithOrdinal | undefined) =>{
            if (!task) {
                chalk.red(`Task ${taskNumber} not found.`)
                return;
            }

            const { id, num, ...taskDetails } = task;

            return editTask(`# Edit task ${task.id}\n\n` + stringify(taskDetails), id)
                .then((editedTask: Task) => {
                    editedTask.id = id;
                    const { num, ...originalTask } = task;

                    if (!deepEqual(originalTask, editedTask)) {
                        return taskService.updateTask(editedTask).then(() => {
                            console.log(`Task ${task.id.slice(0,6)} updated`)
                        });
                    } else {
                        return console.log(`Task ${task.id.slice(0,6)} unchanged`)
                    }    
                })

        })
}