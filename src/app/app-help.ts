import chalk from "chalk";

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

export function helpFront() {
    console.log(`${cli.title} ${cli.version}`);
}

export function help() {
    console.log(cli.help.join('\n'));
}
