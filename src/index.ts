import chalk from "chalk";
import {Command} from "commander"
import { exit } from "process";
import { addCommand } from "./command/add";
import { listCommmand } from "./command/list";
import { remoteInitCommand } from "./command/remote-init";
import { startCommand, stopCommand, completeCommand, deleteCommand } from "./command/status";
import { syncCommand } from "./command/sync";
import { upgradeCommand } from "./command/upgrade";
import { clientVersion } from "./lib/state";
import { verifyStateVersion } from "./lib/upgrade";

const program = new Command();
program.version(`0.2.0 / ${clientVersion}`);

program
  .command('sync')
  .option('-t, --title <honorific>', 'title to use before name')
  .option('-d, --debug', 'display some debugging')
  .hook('preAction', verifyStateVersion)
  .action(syncCommand);


program
  .command('upgrade')
  .action(upgradeCommand);

program
  .command('remote-init')
  .option('-g, --gist <gist-id>', 'id of the gist')
  .option('-t, --token <pac-token>', 'GitHub PAC token')
  .action(remoteInitCommand);

program
  .command('list')
  .option('-d, --due <due>', 'Filter events by due date')
  .option('-t, --tag <tag>', 'Filter events by tag')
  .hook('preAction', verifyStateVersion)
  .action(listCommmand);

program
  .command('add')  
  .argument('description')
  .option('-t, --tag <tag>', 'Tags')
  .option('-d, --due <date>', 'Due date')
  .hook('preAction', verifyStateVersion)
  .action(addCommand);

program
  .command('start')  
  .argument('task')
  .hook('preAction', verifyStateVersion)
  .action(startCommand);

program
  .command('stop')  
  .argument('task')
  .hook('preAction', verifyStateVersion)
  .action(stopCommand);

program
  .command('done')
  .alias('complete')  
  .argument('task')
  .hook('preAction', verifyStateVersion)
  .action(completeCommand);

program
  .command('delete')  
  .argument('task')
  .hook('preAction', verifyStateVersion)
  .action(deleteCommand);

program.parseAsync().catch((err: any) => {
  console.log(chalk.red("ERROR: " + err.message));
  exit(1);
});