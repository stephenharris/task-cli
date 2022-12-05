import { Octokit } from 'octokit';
import { get, set } from './storage';
import { Task } from './tasks';

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

export interface Gist {
    id: string;
    token: string;
  }
 
  
export class RemoteConfigError  extends Error {
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RemoteConfigError.prototype);
    }
}
export const getCachedState = () => {
    return get("cachedstate")
}

export const setCachedState = (data: State) => {
    return set("cachedstate", data);
}


export const getGist = () => {
    return get("gist")
}

export const setGist = (data: Gist) => {
    return set("gist", data);
}

export const getRemoteStorage = async () => {

    try {
        const gist = await getGist();
        console.log('gist', gist);
        if( !gist || !gist.token || !gist.id) {
            throw new RemoteConfigError("Gist token/id configured")
        }    
        
        const octokit = new Octokit({
            auth: gist.token
        })
          
        return octokit.request('GET /gists/{gist_id}', {
            gist_id: gist.id
        }).then((result) => {
            if (result?.data?.files) {
                console.log("tasks");
                return JSON.parse(result?.data?.files['tasks.json']?.content || JSON.stringify(defaultState));   
            }
            throw Error("Error retrieving state");
        })

    } catch (error: any) {
        throw new RemoteConfigError("Error getting remote state: " + error.message);
    }
}


export const updateRemoteStorage = async (data: any) => {
    
    const gist = await getGist();

    if( !gist || !gist.token || !gist.id) {
        throw new RemoteConfigError("Gist not configured")
    }

    const octokit = new Octokit({
        auth: gist.token
    })
    return octokit.request('PATCH /gists/{gist_id}', {
      gist_id: gist.id,
      files: {
        'tasks.json': {
          content: JSON.stringify(data, null, 2)
        }
      }
    })
}