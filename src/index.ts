import chalk from "chalk";
import {Command} from "commander"
import { exit } from "process";
import { fileURLToPath } from "url";
import { addCommand } from "./command/add";
import { editCommand } from "./command/edit";
import { listCommmand } from "./command/list";
import { recentlyDoneCommand } from "./command/recently-done";
import { remoteInitCommand } from "./command/remote-init";
import { searchCommand } from "./command/search";
import { startCommand, stopCommand, completeCommand, deleteCommand } from "./command/status";
import { syncCommand } from "./command/sync";
import { upgradeCommand } from "./command/upgrade";
import { getVersionSync } from "./common/version";
import { Disk } from "./lib/disk";
import { clientVersion, State } from "./lib/state";

const program = new Command();

const __filename = fileURLToPath(import.meta.url);
program.version(`${getVersionSync(__filename)} / ${clientVersion}`);

export const verifyStateVersion = async () => {

  const localStore = Disk.getStore();

  await localStore.getCachedState().then((cachedState: State) => {
      if(cachedState.version > clientVersion) {
          throw Error(`Client version is ${clientVersion}, but state is at version ${cachedState.version}. Please update the client client.`)
      }
      if(cachedState.version < clientVersion) {
          throw Error(
              `Client version is ${clientVersion}, but state is at version ${cachedState.version}. Run 
                  task upgrade`)
      }
  })
}

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
  .alias('started')
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

program
  .command('edit')  
  .argument('task')
  .hook('preAction', verifyStateVersion)
  .action(editCommand);


program
  .command('search')  
  .argument('searchTerm')
  .hook('preAction', verifyStateVersion)
  .action(searchCommand);

program
  .command('recently-done')  
  .hook('preAction', verifyStateVersion)
  .action(recentlyDoneCommand);



program.parseAsync().catch((err: any) => {
  console.log(chalk.red("ERROR: " + err.message));
  exit(1);
});

