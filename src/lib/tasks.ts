import moment from "moment";
import { LocalStore } from "./state";

export interface Task {
  tags: string[];
  description: string;
  date: string | null;
  id: string;
  status: string
}

export interface TaskWithOrdinal extends Task {
  num: number;
}


export const getTasksWithOrdinal= (localStore: LocalStore): Promise<TaskWithOrdinal[]> => {
  return localStore.getTasks()
    .then((tasks: Task[]) => {
      let ordinal = 1;
      return tasks.map((task: Task): TaskWithOrdinal => {
        if (task.status !== 'complete') {
          (task as TaskWithOrdinal).num = ordinal;
          ordinal++;
        }
        return task as TaskWithOrdinal;
      })
    })
}
export const getTask = (id: string, localStore: LocalStore) => localStore.getTasks().then((tasks) => tasks.find((m: Task) => m.id === id));

export const sortTasks = (a: Task, b: Task) : number => {
  const statuses = ["complete", "todo", "in-progress" ];
  const aStatus = statuses.indexOf(a.status);
  const bStatus = statuses.indexOf(b.status);

  // If status is the same, sort by date due, earliest first.
  if (aStatus === bStatus) {
    if (a.date === null) {
      return 1;
    }
    if (b.date === null) {
      return -1;
    }
    return moment(a.date).isBefore(moment(b.date)) ? -1 : 1;
  }

  // A higher status index should be shown first
  return aStatus > bStatus ? -1 : 1;
}
