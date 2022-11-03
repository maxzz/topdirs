import path from 'path';
import chalk from 'chalk';
import { OsUtils } from './utils/utils-os';
import { app } from './app/app';
import { help, helpFront } from './app/app-help';

function genDestFolderName(): string {
    return OsUtils.ensureNameUnique(path.join(OsUtils.getDesktopPath(), `copy ${OsUtils.nowDayTime()}`), false);
}

function main(): void {
    helpFront();

    let args = require('minimist')(process.argv.slice(2), {
        boolean: [ 'all', 'version', 'help' ],
        alias: { a: 'all', v: 'version' },
        default: { all: false }
    });

    const targets = args._ || [];
    app.options.all = args.all;

    if (args.version) {
        return;
    }

    if (args.help) {
        help();
        return;
    }

    if (!targets.length) {
        help();
        console.log(chalk.red(`\nThere is nothing to do with args:\n${chalk.gray(process.argv.reduce((acc, _) => acc += `    ${_}\n`, ''))}`));
        return;
    }

    let dest = genDestFolderName();
    app.handleNames(dest, targets);

    console.log(chalk.cyan.bold('Done.\n'));
} //main()

main();
