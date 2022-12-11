import { getTasks } from "../lib/tasks";
import { set } from "../lib/storage";
import {getCachedState, setCachedState} from "../lib/state"
import { upgradeState } from "../lib/upgrade";

export const upgradeCommand = async (options: any, command: any) => {

    Promise.allSettled([
        getTasks(),
        getCachedState()
    ])
    .then(async (result) => {

        if (result[0].status !== "fulfilled") {
            throw Error("Failed to fetch tasks")
        }

        if (result[1].status !== "fulfilled") {
            throw Error("Failed to fetch cached state")
        }

        let tasks = result[0].value;
        let cachedState = result[1].value;

        let tmp = JSON.parse(JSON.stringify(cachedState));
        tmp.tasks = tasks;

        tmp = upgradeState(tmp);
        cachedState = upgradeState(cachedState);

        return setCachedState(cachedState)
                .then(() => set("todo", tmp.tasks));

    })
}

