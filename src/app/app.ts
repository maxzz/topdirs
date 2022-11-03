import path from "path";
import fs from "fs";
import chalk from "chalk";
import { OsUtils } from "../utils/utils-os";
import { appOptions } from "./app-arguments";

function isOurdir(name: string): boolean {
    return appOptions.all || /^\[\d+\] /.test(name); // i.e. folder name starts from [1]
}

function scanSubDirs(name: string, level: number, rv_names: string[]) {
    fs.readdirSync(name).forEach((subName: string) => {
        let fn = path.join(name, subName);
        if (OsUtils.isDirectory(fn)) {
            if (level === 1 || isOurdir(subName)) {
                rv_names.push(fn);
                scanSubDirs(fn, level + 1, rv_names);
            }
        }
    });
}

export function handleNames(dest: string, names: string[]) {
    console.log('Starting sub-folders structure replication...');

    names.forEach((root) => {
        if (OsUtils.isDirectory(root)) {
            let rv: string[] = [];
            scanSubDirs(root, 1, rv);

            console.log(chalk.green(`    "${root}" creating ${rv.length} sub-folder${rv.length === 1 ? '' : 's'}:\n`));
            rv.forEach((sub) => {
                let short = path.relative(root, sub);
                let last = names.length === 1 ? '' : path.basename(root);
                let newName = path.join(dest, last, short);

                console.log(chalk.gray(`    creating "${newName}"`));
                OsUtils.mkdirSync(newName);
            });
        }
    });
}
