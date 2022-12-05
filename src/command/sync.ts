import { getCachedState, getRemoteStorage, RemoteConfigError, setCachedState, updateRemoteStorage } from "../data/remote";
import chalk from "chalk"
import { sync } from "../data/sync";
import { getTasks } from "../data/tasks";
import { set } from "../data/storage";

export const syncCommand = (options: any, command: any) => {

    
    return getRemoteStorage().then((remoteState) => {
        console.log("remoteState");
        console.log(remoteState);

        return Promise.allSettled([
            getTasks(),
            getCachedState(),
            remoteState
        ])
        .then(async (result) => {

            if (result[0].status !== "fulfilled") {
                throw Error("Failed to fetch tasks")
            }

            let tasks = result[0].value;
            let cachedState = result[1].status === "fulfilled" ? result[1].value : null
            let remoteState = result[2].status === "fulfilled" ? result[2].value : null
            
            let newState = await sync(remoteState, cachedState, tasks);

            if (newState.serial === remoteState.serial + 1) {
              await updateRemoteStorage(newState)
            }

            return setCachedState(newState)
                .then(() => set("todo", newState.tasks));
        })
        .then(() => {
            console.log('In sync');
        })

    })
    .catch((e: Error )=> {
        if (e instanceof RemoteConfigError) {
            console.log(chalk.red("Requires set up: " + e.message));
            console.log("\ttask remote-init");
        } else {
            throw e;
        }
    })
}