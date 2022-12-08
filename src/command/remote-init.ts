import { Gist } from "../lib/gist";
import inquirer from 'inquirer'


export const remoteInitCommand = async (options: any, command: any) => {

  let prompts = Gist.getConfig().filter((prompt) => options[prompt.name] == undefined )

  if (prompts.length > 0) {
    await inquirer.prompt(prompts)
      .then((answer) => {
        Object.assign(options, answer);
      })
  }

  return Gist.persistConig(options.gist, options.token).then(() => console.log("Remote configured."));
}



