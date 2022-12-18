import chalk from "chalk";
import moment from "moment";
import { TaskWithOrdinal } from "../lib/tasks";
import Table from "cli-table3";

export const renderTable = (tasks: TaskWithOrdinal[]) : Table.Table => {

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

    return table;
}