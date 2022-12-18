import { Disk } from "../lib/disk";
import { containsSearchTerm, getTasksWithOrdinal, sortTasks, TaskWithOrdinal } from "../lib/tasks";
import { renderTable } from "../common/table";

const localStore = Disk.getStore()

export const searchCommand = (searchTerm: string, options: any, command: any) => {

   console.log(searchTerm);

   return getTasksWithOrdinal(localStore)
        .then((tasks: TaskWithOrdinal[]) => tasks.filter((task: TaskWithOrdinal) => task.status !== 'complete').sort(sortTasks))
        .then((tasks: TaskWithOrdinal[]) => {
            return tasks.filter((task: TaskWithOrdinal) => containsSearchTerm(task, searchTerm))
        })
        .then((tasks: TaskWithOrdinal[]) => {
            console.log(renderTable(tasks).toString());
        })
}