import { State } from "./state";

export interface RemoteStore {

    getRemoteState(): Promise<State>;
    setRemoteState(state: State): Promise<State>;
}


export class RemoteConfigError  extends Error {
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RemoteConfigError.prototype);
    }
}