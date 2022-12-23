import { Disk } from "../lib/disk";
import { sortTasks, TaskService, TaskWithOrdinal } from "../lib/tasks";
import { renderTable } from "../common/table";

const taskService = new TaskService(Disk.getStore())

export const searchCommand = (searchTerm: string, options: any, command: any) => {

   console.log(searchTerm);

   return taskService.search(searchTerm)
        .then((tasks: TaskWithOrdinal[]) => tasks.filter((task: TaskWithOrdinal) => task.status !== 'complete').sort(sortTasks))
        .then((tasks: TaskWithOrdinal[]) => {
            console.log(renderTable(tasks).toString());
        })
}