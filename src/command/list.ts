import chalk from "chalk"
import { getTasks, getTasksWithOrdinal, Task, TaskWithOrdinal } from "../lib/tasks";
import Table from "cli-table3";
import moment from "moment";
import {sortTasks} from '../lib/tasks'

moment.relativeTimeThreshold('m', 45);
moment.relativeTimeThreshold('h', 48);
moment.relativeTimeThreshold('d', 14);
moment.relativeTimeThreshold('w', 4)

export const listCommmand = (options: any, command: any) => {

    return getTasksWithOrdinal()
    .then((tasks: TaskWithOrdinal[]) => tasks.filter((task: TaskWithOrdinal) => task.status !== 'complete').sort(sortTasks))
    .then((tasks) => tasks.filter((task) => showTask(task, options)))
    .then((tasks: TaskWithOrdinal[]) => {
    
        let table = new Table({
            head: ['#', 'Due', 'Description', "Status"].map((cell) => chalk.blueBright(cell))
          , colWidths: [5, 15, 100, 10],
            style: {
              compact: true
            }
        });

        for (let task of tasks) {

            let row = [task.num ? task.num : '-', task.date ? moment(task.date).fromNow() : '-', task.description, task.status].map((column) => {

                if (task.status === "in-progress") {
                    return chalk.yellow(column)
                }

                if (moment(task.date).isBefore(moment())) {
                    return chalk.red(column)
                }

                return column;
            })
            table.push(row)
        }

        console.log(table.toString());
    })
}

const showTask = (task: Task, options: any) : boolean => {

    if( options.tag && !task.tags.includes(options.tag.toLowerCase())) {
      return false;
    }

    if (!options.due) {
        return true;
    }

    switch (options.due.toLowerCase()) {
      case "today":
        return !!task.date && moment(task.date).isSame(moment(), "day");
      case "tomorrow":
        return !!task.date && moment(task.date).isSame(moment("tomorrow"), "day");
      case "none":
        return !task.date;
      case "overdue":
        return !!task.date && moment(task.date).isBefore(moment(), "day") && task.status !== "complete";
      default:
        return true;
    }

  }