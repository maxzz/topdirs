import path from "path";
import chalk from "chalk";
import { OsUtils } from "../utils/utils-os";
import { help } from "./app-help";

export let appOptions = {
    all: false
};

export function getArgTargets(): string[] | undefined {
    let args = require('minimist')(process.argv.slice(2), {
        boolean: [ 'all', 'version', 'help' ],
        alias: { a: 'all', v: 'version' },
        default: { all: false }
    });

    const targets: string[] = args._ || [];
    appOptions.all = args.all;

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
}

export function genDestFolderName(): string {
    return OsUtils.ensureNameUnique(path.join(OsUtils.getDesktopPath(), `copy ${OsUtils.nowDayTime()}`), false);
}
