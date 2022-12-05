import moment from "moment";
import { get } from "./storage";

export interface Task {
  category: string;
  description: string;
  date: string;
  id: string;
  status: string
}

export interface TaskWithOrdinal extends Task {
  num: number;
}

export const getTasks = () => {
  return get("todo").then((tasks) => tasks)
};

export const getTasksWithOrdinal= () => {
  return getTasks()
    .then((tasks) => {
      let ordinal = 1;
      return tasks.map((task: Task) => {
        if (task.status !== 'complete') {
          (task as TaskWithOrdinal).num = ordinal;
          ordinal++;
        }
        return task;
      })
    })
}
export const getTask = (id: string) => getTasks().then((tasks) => tasks.find((m: Task) => m.id === id));

export const sortTasks = (a: Task, b: Task) : number => {
  const statuses = ["complete", "todo", "in-progress" ];
  const aStatus = statuses.indexOf(a.status);
  const bStatus = statuses.indexOf(b.status);

  // If status is the same, sort by date due, earliest first.
  if (aStatus === bStatus) {
    return moment(a.date).isBefore(moment(b.date)) ? -1 : 1;
  }

  // A higher status index should be shown first
  return aStatus > bStatus ? -1 : 1;
}
