import {Task, TaskService, TaskWithOrdinal } from "../lib/tasks";
import moment from "moment";
import {sortTasks} from '../lib/tasks'
import { Disk } from "../lib/disk";
import { renderTable } from "../common/table";

moment.relativeTimeThreshold('m', 45);
moment.relativeTimeThreshold('h', 48);
moment.relativeTimeThreshold('d', 14);
moment.relativeTimeThreshold('w', 4)

const taskService = new TaskService(Disk.getStore())

export const listCommmand = (options: any, command: any) => {

    return taskService.getTasksWithOrdinal()
    .then((tasks: TaskWithOrdinal[]) => tasks.filter((task) => showTask(task, options)).sort(sortTasks))
    .then((tasks: TaskWithOrdinal[]) => {
        console.log(renderTable(tasks).toString());
    })
}

const showTask = (task: Task, options: any) : boolean => {

    if (task.status === "complete") {
      return false;
    }

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