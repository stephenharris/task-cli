import { Octokit } from 'octokit';
import { Disk } from './disk';
import { RemoteConfigError, RemoteStore } from './remote';
import { defaultState, LocalStore, State } from './state';

export class Gist implements RemoteStore {

    private id: string;
    private octokit: Octokit;
    private static instance: Gist;
    

    public constructor(id: string, token: string) {
        this.id = id;
        this.octokit = new Octokit({
            auth: token
        })
    }

    getRemoteState(): Promise<State> {
        return this.octokit.request('GET /gists/{gist_id}', {
            gist_id: this.id
        }).then((result) => {
            if (result?.data?.files) {
                console.log("tasks");
                return JSON.parse(result?.data?.files['tasks.json']?.content || JSON.stringify(defaultState));   
            }
            throw Error("Error retrieving state");
        })
    }

    setRemoteState(state: State): Promise<State> {
        return this.octokit.request('PATCH /gists/{gist_id}', {
            gist_id: this.id,
            files: {
              'tasks.json': {
                content: JSON.stringify(state, null, 2)
              }
            }
          })
          .then(() => state)
    }

    static getConfig(): {name: string, type: string, message: string}[] {
        return [
            {
                type: 'string',
                name: 'gist',
                message: 'Gist Id',
            },
            {
                type: 'string',
                name: 'token',
                message: 'GitHub PAC token',
              }
        ]
    }
}




