import {copyFileSync, chmodSync} from 'fs';

copyFileSync('package.json', 'build/package.json');
copyFileSync('src/entry.sh', 'build/entry.sh');
chmodSync('build/entry.sh', '755');