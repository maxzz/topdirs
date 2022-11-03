import path from 'path';
import chalk from 'chalk';
import { OsUtils } from './utils/utils-os';
import { app } from './app/app';

function genDestFolderName(): string {
    return OsUtils.ensureNameUnique(path.join(OsUtils.getDesktopPath(), `copy ${OsUtils.nowDayTime()}`), false);
}

const cli = {
    version: '1.0.2',
    title: `${chalk.cyan.bold('topdirs')}`,
    help: [
        "",
        `    topdirs will replicate folders structure wo/ coping files.`,
        "    The root of created folders tree will be located at desktop with name like",
        `    "copy 01.16.20 at 20.07.30.151" where date will be the current date.`,
        `    Specify one or more folder names to replicate folders structure.`,
        "",
        "Syntax:",
        `    topdirs [options] folder(s)`,
        "",
        "Options:",
        "    --help, -h      Show help",
        "    --version, -v   Show version",
        "    --all, -a       Copy all sub-folders otherwise only folders with name",
        "                    started with '[<numbers>]name'. Default is false.",
    ]
};

function main(): void {
    console.log(`${cli.title} ${cli.version}`);

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
        console.log(cli.help.join('\n'));
        return;
    }

    if (!targets.length) {
        console.log(cli.help.join('\n'));
        console.log(chalk.red(`\nThere is nothing to do with args:\n${chalk.gray(process.argv.reduce((acc, _) => acc += `    ${_}\n`, ''))}`));
        return;
    }

    let dest = genDestFolderName();
    app.handleNames(dest, targets);

    console.log(chalk.cyan.bold('Done.\n'));
} //main()

main();
