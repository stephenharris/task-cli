import {Task, TaskService } from "../lib/tasks";
import moment from "moment";
import { Disk } from "../lib/disk";
import Table from "cli-table3";
import chalk from "chalk";

const taskService = new TaskService(Disk.getStore())

export const recentlyDoneCommand = (options: any, command: any) => {

    return taskService.getTasks()
    .then((tasks: Task[]) => tasks.filter(recentlyCompletedFilter).sort(sortByCompletedDate))
    .then((tasks: Task[]) => {
        console.log(renderCompletedTasksTable(tasks).toString());
    })
}

const recentlyCompletedFilter = (task: Task) : boolean => {

  if (task.status !== 'complete') {
    return false;
  }

  if( moment(task.lastUpdated).isBefore(moment().subtract(1,'w'))) {
    return false;
  }

  return true;
}

const sortByCompletedDate = (a: Task, b: Task) : number => {
      
  if (a.lastUpdated === null) {
    return 1;
  }
  if (b.lastUpdated === null) {
    return -1;
  }
  return moment(a.lastUpdated).isBefore(moment(b.lastUpdated)) ? 1 : -1;
}

export const renderCompletedTasksTable = (tasks: Task[]) : Table.Table => {

  let table = new Table({
      head: ['#', 'Description'].map((cell) => chalk.blueBright(cell))
    , colWidths: [8, 100],
      style: {
        compact: true
      }
  });

  let date = null;

  for (let task of tasks) {

      if (!moment(task.lastUpdated).isSame(date, 'date')) {
        table.push(
          [{ colSpan: 2, content: "" }],
          [{ colSpan: 2, content: chalk.blue.bold(moment(task.lastUpdated).format("\n"+'dddd Do MMMM')) }],
          [{ colSpan: 2, content: "" }],
        )
        date = task.lastUpdated
      }

      let row = [task.id.slice(0,6), task.description].map((column) => {
          return column;
      })
      table.push(row)
  }

  return table;
}