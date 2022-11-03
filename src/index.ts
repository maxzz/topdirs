import path from 'path';
import chalk from 'chalk';
import { OsUtils } from './utils/utils-os';
import { app } from './app/app';
import { helpFront } from './app/app-help';
import { getArgTargets } from './app/app-arguments';

function genDestFolderName(): string {
    return OsUtils.ensureNameUnique(path.join(OsUtils.getDesktopPath(), `copy ${OsUtils.nowDayTime()}`), false);
}

function main(): void {
    helpFront();

    const targets = getArgTargets();
    if (!targets) {
        return;
    }

    let dest = genDestFolderName();
    app.handleNames(dest, targets);

    console.log(chalk.cyan.bold('Done.\n'));
}

main();
