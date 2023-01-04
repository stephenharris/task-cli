import chalk from "chalk";
import moment from "moment";
import { Task, TaskWithOrdinal } from "../lib/tasks";
import Table from "cli-table3";

export const renderTable = (tasks: TaskWithOrdinal[]|Task[]) : Table.Table => {

    let table = new Table({
        head: ['#', 'Due', 'Description', "Status"].map((cell) => chalk.blueBright(cell))
      , colWidths: [5, 15, 100, 10],
        style: {
          compact: true
        }
    });

    for (let task of tasks) {

        let id = (task as TaskWithOrdinal).num !== undefined ? (task as TaskWithOrdinal).num : task.id.slice(0,6)
        let row = [id, task.date ? moment(task.date).fromNow() : '-', task.description, task.status].map((column) => {

            if (task.status === "in-progress") {
                return chalk.yellow(column)
            }

            if (task.date && moment(task.date).isBefore(moment())) {
                return chalk.red(column)
            }

            return column;
        })
        table.push(row)
    }

    return table;
}