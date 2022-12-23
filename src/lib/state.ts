import { Task } from "./tasks";

export const clientVersion = 2;

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

export interface LocalStore {

    get(key: string): Promise<any>
    set(key: string, value: any): Promise<void>

    setTask(id: string, task: Task): Promise<Task>
    removeTask(id: string): Promise<void>

    getTasks(): Promise<Task[]>
    getCachedState(): Promise<State>;
    setCachedState(state: State): Promise<State>;
}

