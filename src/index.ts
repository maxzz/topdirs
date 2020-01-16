//import * as utl from './utils-os';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { osutils } from './utils/utils';

namespace app {
    function isOurdir(name: string): boolean {
        return /^\[\d+\] /.test(name); // i.e. folder name starts from [1]
    }
    function scanSubDirs(name: string, level: number, rv_names: string[]) {
        fs.readdirSync(name).forEach((subName: string) => {
            let fn = path.join(name, subName);
            if (osutils.isDirectory(fn)) {
                if (level === 1 || isOurdir(subName)) {
                    rv_names.push(fn);
                    scanSubDirs(fn, level + 1, rv_names);
                }
            }
        });
    } //scanSubDirs()
    export function handleNames(dest: string, names: string[]) {
        names.forEach((root) => {
            if (osutils.isDirectory(root)) {
                let rv: string[] = [];
                scanSubDirs(root, 1, rv);

                console.log(chalk.gray(`"${root}" sub-folders to create: ${rv.length}`));
                rv.forEach((sub) => {
                    let short = path.relative(root, sub);
                    let last = names.length === 1 ? '' : path.basename(root);
                    let newName = path.join(dest, last, short);

                    console.log(chalk.gray(`  creating "${newName}"`));
                    osutils.mkdirSync(newName);
                });
            }
        });
    } //handleNames()
} //namespace app

function genDestFolderName(): string {
    return osutils.ensureNameUnique(`${osutils.getDesktopPath()}/copy ${osutils.nowDayTime()}`, false);
}

function main(): void {
    console.log(`\n${chalk.cyan.bold('topdirs')} will replicate folders structure wo/ files.`);

    let newArgs = process.argv.slice(2);
    if (!newArgs.length) {
        console.log(chalk.red(`\nSpecify one or more folder names to replicate folders structure.`));
        console.log(`Nothing to do with args:\n[${process.argv}]\n`);
        return;
    }

    console.log('Starting sub-folders structure replication...');

    let dest = genDestFolderName();
    app.handleNames(dest, newArgs);

    console.log(chalk.cyan.bold('Done.\n'));
} //main()

main();
