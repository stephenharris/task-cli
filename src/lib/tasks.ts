import moment from "moment";
import { SchemaObject } from "yaml-schema";
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

export const TaskSchema: SchemaObject = {
  type: "object",
  props: {
      description: {
          type: "string"
      },
      date: {
          type: "string"
      },
      status: {
          type: "choices",
          choices: [
              "todo",
              "in-progress",
              "complete"
          ]
      },
      tags: {
          type: "array",
          element: {
              type: "string"
          }
      }
  }
}

export class TaskService {

  localStore: LocalStore;

  constructor(localStore: LocalStore) {
    this.localStore = localStore
  }

  updateTask(task: Task): Promise<Task> {
    return this.localStore.setTask(task.id, task)
  }

  deleteTask(taskId: string) {
    return this.localStore.removeTask(taskId)
  }

  getTasksWithOrdinal(): Promise<TaskWithOrdinal[]> {
    return this.localStore.getTasks()
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

  search(searchTerm: string): Promise<TaskWithOrdinal[]> {
    return this.getTasksWithOrdinal()
      .then((tasks: TaskWithOrdinal[]) => {
        return tasks.filter((task: TaskWithOrdinal) => containsSearchTerm(task, searchTerm))
      })
  }
  

  getTask(id: string): Promise<Task>{ 
    return this.localStore.getTasks()
      .then((tasks) => tasks.find((m: Task) => m.id === id))
      .then((task: Task | undefined) => {
        if (task === undefined) {
          throw Error(`Task ${id} not found`)
        }
        return task;
      });
  }

  findTask(num: string): Promise<TaskWithOrdinal>{

    const identifier = num+""
  
    if (identifier.match("^[0-9a-fA-F]{6}$") !== null) {
        return getTasksWithOrdinal(this.localStore)
            .then((tasks: TaskWithOrdinal[]) => {
                return tasks.find((task: TaskWithOrdinal) => task.id.toLowerCase().startsWith(identifier.toLowerCase()))
            })
            .then((task: TaskWithOrdinal | undefined) => {
              if (task === undefined) {
                throw Error(`Task ${identifier} not found`)
              }
              return task;
            })
    } else {
        const numInt = parseInt(identifier);
        return getTasksWithOrdinal(this.localStore)
            .then((tasks: TaskWithOrdinal[]) => {
                return tasks.find((task: TaskWithOrdinal) => task.num === numInt)
            })
            .then((task: TaskWithOrdinal | undefined) => {
              if (task === undefined) {
                throw Error(`Task ${identifier} not found`)
              }
              return task;
            })
    }
    
  }

}

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

export const containsSearchTerm = (task: Task, searchTerm: string) : boolean => { 
  return task.description.toLocaleLowerCase().match(searchTerm.toLocaleLowerCase()) !== null;
}

// Deprecated
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

export const findTask = (num: number | string, localStore: LocalStore) => {

  const identifier = num+""

  if (identifier.match("^[0-9a-fA-F]{6}$") !== null) {

      return getTasksWithOrdinal(localStore)
          .then((tasks: TaskWithOrdinal[]) => {
              return tasks.find((task: TaskWithOrdinal) => task.id.toLowerCase().startsWith(identifier.toLowerCase()))
          })
  } else {
      const numInt = parseInt(identifier);
      return getTasksWithOrdinal(localStore)
          .then((tasks: TaskWithOrdinal[]) => {
              return tasks.find((task: TaskWithOrdinal) => task.num === numInt)
          })
  }
  
}