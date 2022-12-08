#!/usr/local/bin/node --experimental-specifier-resolution=node


// todo #!/usr/bin/env node 
import chalk from "chalk";
import {Command} from "commander"
import { exit } from "process";
import { addCommand } from "./command/add";
import { listCommmand } from "./command/list";
import { remoteInitCommand } from "./command/remote-init";
import { startCommand, stopCommand, completeCommand, deleteCommand } from "./command/status";
import { syncCommand } from "./command/sync";

const program = new Command();

program
  .command('sync')
  .option('-t, --title <honorific>', 'title to use before name')
  .option('-d, --debug', 'display some debugging')
  .action(syncCommand);

program
  .command('remote-init')
  .option('-g, --gist <gist-id>', 'id of the gist')
  .option('-t, --token <pac-token>', 'GitHub PAC token')
  .action(remoteInitCommand);

program
  .command('list')
  .option('-d, --due <due>', 'Filter events by due date')
  .option('-t, --tag <tag>', 'Filter events by tag')
  .action(listCommmand);

program
  .command('add')  
  .argument('description')
  .option('-t, --tag <tag>', 'Tags')
  .option('-d, --due <date>', 'Due date')
  .action(addCommand);

program
  .command('start')  
  .argument('task')
  .action(startCommand);

program
  .command('stop')  
  .argument('task')
  .action(stopCommand);

program
  .command('complete')  
  .argument('task')
  .action(completeCommand);

program
  .command('delete')  
  .argument('task')
  .action(deleteCommand);

program.parseAsync().catch((err: any) => {
  console.log(chalk.red("ERROR: " + err.message));
  exit(1);
});