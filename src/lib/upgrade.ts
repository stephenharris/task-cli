import { clientVersion, getCachedState, State } from "./state"

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

export const verifyStateVersion = async () => {

    await getCachedState().then((cachedState) => {
        if(cachedState.version > clientVersion) {
            throw Error(`Client version is ${clientVersion}, but state is at version ${cachedState.version}. Please update the client client.`)
        }
        if(cachedState.version < clientVersion) {
            throw Error(
                `Client version is ${clientVersion}, but state is at version ${cachedState.version}. Run 
                    task upgrade`)
        }
    })
}


export function upgradeState(newState: Version1State) : State {

    if(newState.version <= 1) {
        newState = upgradeStatev2(newState);
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