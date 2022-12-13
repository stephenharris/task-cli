import { Gist } from "../lib/gist";
import chalk from "chalk"
import { sync } from "../lib/sync";
import { Disk } from "../lib/disk";
import { defaultState, LocalStore, State } from "../lib/state";
import {RemoteConfigError, RemoteStore} from "../lib/remote"

export const syncCommand = async (options: any, command: any) => {

    const localStore: LocalStore = await Disk.getStore();
    const gist = await localStore.get("gist");

    if( !gist || !gist.token || !gist.id) {
        throw new RemoteConfigError("Gist not configured")
    }

    const store: RemoteStore = new Gist(gist.id, gist.token);
    
    return store.getRemoteState().then((remoteState: State) => {
        return Promise.allSettled([
            localStore.getTasks(),
            localStore.getCachedState(),
            remoteState
        ])
        .then(async (result) => {

            if (result[0].status !== "fulfilled") {
                throw Error("Failed to fetch tasks")
            }

            let tasks = result[0].value;
            let cachedState = result[1].status === "fulfilled" ? result[1].value : defaultState
            let remoteState = result[2].status === "fulfilled" ? result[2].value : defaultState
            
            let newState = await sync(remoteState, cachedState, tasks);

            if (remoteState === null || newState.serial === remoteState.serial + 1) {
              await store.setRemoteState(newState)
            }

            return localStore.setCachedState(newState)
                .then(() => localStore.set("todo", newState.tasks));
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