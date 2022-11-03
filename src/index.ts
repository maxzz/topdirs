import chalk from 'chalk';
import { helpFront } from './app/app-help';
import { genDestFolderName, getArgTargets } from './app/app-arguments';
import { app } from './app/app';

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
