import moment from "moment";
import { clientVersion, State } from "./state"

export interface Version1State {
    version: number;
    serial: number;
    tasks: {
        category: string;
        description: string;
        date: string;
        id: string;
        status: string
    }[];
}

export interface Version2State {
    version: number;
    serial: number;
    tasks: {
        description: string;
        date: string;
        id: string;
        status: string
        tags: string[];
        lastUpdated?: string | null
    }[];

    
}

export function upgradeState(newState: Version1State) : State {

    if(newState.version <= 1) {
        newState = upgradeStatev2(newState);
    }

    if(newState.version <= 2) {
        (newState as unknown) = upgradeStatev3(newState as any);
    }


    newState.version = clientVersion;
    return (newState as unknown) as State;
}


function upgradeStatev2(newState: Version1State) {

    newState.tasks = newState.tasks.map((task) => {
        (task as any).tags = task.category ? [task.category] : []
        delete (task as any).category;
        return task;
    })

    return newState;
}

function upgradeStatev3(newState: Version2State) {

    newState.tasks = newState.tasks.map((task) => {
        (task as any).lastUpdated = task.lastUpdated ? task.lastUpdated : moment().toISOString()
        return task;
    })

    return newState;
}