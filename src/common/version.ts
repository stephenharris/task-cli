import { findUpSync } from "find-up";
import fs from "fs"

export function getPackageJSONSync(dirname: string) {

    const path = findUpSync("package.json", { cwd: dirname });
    if(path !== undefined) {
        let rawdata = fs.readFileSync(path, 'utf8');
        return JSON.parse(rawdata);
    }
}
 
export function getVersionSync(dirname: string): string | undefined {
    return getPackageJSONSync(dirname)?.version;
  }