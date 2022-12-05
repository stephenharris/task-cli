import { getRemoteStorage, Gist, RemoteConfigError, setGist } from "../data/remote";
import chalk from "chalk"
import inquirer from 'inquirer'


export const remoteInitCommand = async (options: any, command: any) => {

  let gist: Gist = {
    id: "",
    token: ""
  }

  let prompts = [];


  if(options.gist) {
    gist.id = options.gist;
  } else {
    prompts.push({
      type: 'string',
      name: 'id',
      message: 'Gist Id',
    })
  }

  if(options.token) {
    gist.token = options.token;
  } else {
    prompts.push({
      type: 'string',
      name: 'token',
      message: 'GitHub PAC token',
    })
  }

  if (prompts.length > 0) {
    await inquirer.prompt(prompts)
      .then((answer) => {
        Object.assign(gist, answer);
      })
  }

  return setGist(gist).then(() => console.log("Remote configured."));
}



