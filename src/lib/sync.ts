import { Task } from "../lib/tasks";
import { State, clientVersion } from "../lib/state";
import { upgradeState } from "../lib/upgrade";
import { deepEqual } from "./util";

export const defaultState = {
    version: 2,
    serial: 1,
    tasks: []
}

export function sync(remote: State | {}, cachedState: State | {} | null, localTasks: Task[]) {

    if (deepEqual(remote, {})) {
        remote = defaultState;
        cachedState = JSON.parse(JSON.stringify(remote))
    }

    if ((remote as State).version > clientVersion){
        throw Error(`Client version ${clientVersion} not compatible with ${(remote as State).version}. Update client to version ${clientVersion}`)
    }

    let newState = JSON.parse(JSON.stringify(remote));
    newState = upgradeState(newState)

    const cachedStateTaskIds =  cachedState && (cachedState as State).tasks?.map((task: Task) => task.id) || [];
    const localStateIds =  localTasks?.map((task: Task) => task.id) || [];

    let actions = localTasks.reduce((actions, task) => {

        const index = cachedStateTaskIds.indexOf(task.id)
        
        if ( index === -1) {
            actions.add.push(task)
        } else if (!deepEqual(task, (cachedState as State).tasks[index])) {
            console.log(task);
            console.log((cachedState as State).tasks[index]);
            actions.update.push(task)
        }
        return actions;
    }, {
        add: [] as Task[],
        update: [] as Task[],
        delete: cachedStateTaskIds.filter((cachedTaskId: string) => !localStateIds.includes(cachedTaskId))
    })

    // Update remote state
    if (actions.add.length === 0 && actions.update.length === 0 && actions.delete.length === 0 && newState.version === clientVersion) {
        console.log("Already in sync");
        return newState;
    }

    // Update changed tasks
    const remoteStateIds =  (remote as State).tasks?.map((task: Task) => task.id) || [];

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