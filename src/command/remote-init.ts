import { Gist } from "../lib/gist";
import inquirer from 'inquirer'
import { Disk } from "../lib/disk";


export const remoteInitCommand = async (options: any, command: any) => {

  const localStore = Disk.getStore();
  let prompts = Gist.getConfig().filter((prompt) => options[prompt.name] == undefined )

  if (prompts.length > 0) {
    await inquirer.prompt(prompts)
      .then((answer) => {
        Object.assign(options, answer);
      })
  }

  return localStore.set("gist", {id: options.gist, token:options.token}).then(() => console.log("Remote configured."));
}



