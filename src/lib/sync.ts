import { Task } from "../data/tasks";
import { clientVersion } from "./remote";

export const defaultState = {
    version: 1,
    serial: 1,
    tasks: []
}

function deepEqual(x: any, y: any): boolean {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
      ok(x).length === ok(y).length &&
        ok(x).every((key: any) => deepEqual(x[key], y[key]))
    ) : (x === y);
  }

export function sync(remote: any, cachedState: any, localTasks: any[]) {

    if (deepEqual(remote, {})) {
        remote = defaultState;
        cachedState = JSON.parse(JSON.stringify(remote))
    }

    if (remote.version > clientVersion){
        throw Error(`Client version ${clientVersion} not compatible with ${remote.version}. Update client to version ${clientVersion}`)
    }

    let newState = JSON.parse(JSON.stringify(remote));
    const cachedStateTaskIds =  cachedState.tasks?.map((task: Task) => task.id) || [];
    const localStateIds =  localTasks?.map((task: Task) => task.id) || [];

    let actions = localTasks.reduce((actions, task) => {

        const index = cachedStateTaskIds.indexOf(task.id)
        
        if ( index === -1) {
            actions.add.push(task)
        } else if (!deepEqual(task, cachedState.tasks[index])) {
            console.log(task);
            console.log(cachedState.tasks[index]);
            actions.update.push(task)
        }
        return actions;
    }, {
        add: [],
        update: [],
        delete: cachedStateTaskIds.filter((cachedTaskId: string) => !localStateIds.includes(cachedTaskId))
    })

    // Update remote state
    if (actions.add.length === 0 && actions.update.length === 0 && actions.delete.length === 0) {
        console.log("Already in sync");
        return newState;
    }

    // Update changed tasks
    const remoteStateIds =  remote.tasks?.map((task: Task) => task.id) || [];

    for (let task of actions.update) {
        const index = remoteStateIds.indexOf(task.id);

        if (index == -1) {
            // Task has been deleted
            continue;
        }
        newState.tasks[index] = task;
    }

    // Add new tasks
    newState.tasks = newState.tasks.concat(actions.add);

    // Remove deleted tasks
    newState.tasks = newState.tasks.filter((task: Task) => !actions.delete.includes(task.id));

    // Update serial
    newState.serial++;

    return newState;
}