import {copyFileSync} from 'fs';

copyFileSync('package.json', 'build/package.json');
copyFileSync('src/entry.sh', 'build/entry.sh');