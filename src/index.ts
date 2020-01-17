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

                console.log(chalk.green(`    "${root}" creating ${rv.length} sub-folder${rv.length === 1 ?'':'s'}:\n`));
                rv.forEach((sub) => {
                    let short = path.relative(root, sub);
                    let last = names.length === 1 ? '' : path.basename(root);
                    let newName = path.join(dest, last, short);

                    console.log(chalk.gray(`    creating "${newName}"`));
                    osutils.mkdirSync(newName);
                });
            }
        });
    } //handleNames()
} //namespace app

function genDestFolderName(): string {
    return osutils.ensureNameUnique(path.join(osutils.getDesktopPath(), `copy ${osutils.nowDayTime()}`), false);
}

const cli = {
    version: '1.0.2',
    title: `${chalk.cyan.bold('topdirs')}`,
    help: [
        "",
        "Syntax:",
        `   ${chalk.cyan.bold('topdirs')} folder(s)\n`,
        `   topdirs will replicate folders structure wo/ coping files.`,
        "   The root of created folders tree will be located at desktop with name like",
        `   "copy 01.16.20 at 20.07.30.151" where date will be the current date.`,
        "",
        `   Specify one or more folder names to replicate folders structure.`,
    ]
};

function main(): void {
    console.log(`${cli.title} ${cli.version}`);

    let args = process.argv.slice(2);
    if (!args.length) {
        console.log(cli.help.join('\n'));
        console.log(chalk.red(`\n   Nothing to do with args:\n${chalk.gray(process.argv.reduce((acc, _) => acc += `\t${_}\n`, ''))}`));
        return;
    }

    console.log('Starting sub-folders structure replication...');

    let dest = genDestFolderName();
    app.handleNames(dest, args);

    console.log(chalk.cyan.bold('Done.\n'));
} //main()

main();
