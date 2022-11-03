import path from "path";
import fs from "fs";
import chalk from "chalk";
import { OsUtils } from "../utils/utils-os";
import { appOptions } from "./app-arguments";

function isOurdir(name: string): boolean {
    return appOptions.all || /^\[\d+\] /.test(name); // i.e. folder name starts from [1]
}

function recursivelyScanSubDirs(name: string, level: number, rv: string[]) {
    fs.readdirSync(name)
        .forEach((subName: string) => {
            const fullName = path.join(name, subName);
            if (OsUtils.isDirectory(fullName)) {
                if (level === 1 || isOurdir(subName)) {
                    rv.push(fullName);
                    recursivelyScanSubDirs(fullName, level + 1, rv);
                }
            }
        });
}

function scanSubDirs(name: string, level: number): string[] {
    const rv: string[] = [];
    recursivelyScanSubDirs(name, level, rv);
    return rv;
}

export function handleNames(dest: string, names: string[]) {
    console.log('Starting sub-folders structure replication...');

    names.forEach((root) => {
        if (!OsUtils.isDirectory(root)) {
            console.log(chalk.red(`Folder ${root} does not exist.`));
            return;
        }

        const dirNames = scanSubDirs(root, 1);

        console.log(chalk.green(`Creating ${dirNames.length} sub-folder${dirNames.length === 1 ? '' : 's'} from "${root}":`));

        dirNames.forEach((sub) => {
            const short = path.relative(root, sub);
            const last = names.length === 1 ? '' : path.basename(root);
            const newName = path.join(dest, last, short);

            console.log(chalk.gray(`    "${newName}", ${sub}`));
            OsUtils.mkdirSync(newName);
        });

    });
}
