import { get, set } from "./storage";
import { Task } from "./tasks";

export const clientVersion = 1;

export interface State {
    version: number;
    serial: number;
    tasks: Task[];
}

export const defaultState = {
    version: clientVersion,
    serial: 1,
    tasks: []
}

export const getCachedState = () => {
    return get("cachedstate")
}

export const setCachedState = (data: State) => {
    return set("cachedstate", data);
}
