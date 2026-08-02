#!/usr/bin/env node

/**
 * btcquery
 * A read-only Bitcoin blockchain query utility.
 */

const VERSION = "0.1.0";

function showHelp() {
    console.log(`
btcquery ${VERSION}

Usage:
  btcquery <command> [options]

Commands:
  server          Test connection to the configured Electrum server

Options:
  -h, --help      Show this help
  -v, --version   Show version
`);
}

function showVersion() {
    console.log(VERSION);
}

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        showHelp();
        process.exit(0);
    }

    switch (args[0]) {
        case "-h":
        case "--help":
            showHelp();
            break;

        case "-v":
        case "--version":
            showVersion();
            break;

        case "server":
            console.log("Not implemented yet.");
            break;

        default:
            console.error(`Unknown command: ${args[0]}`);
            console.error("Use --help for usage.");
            process.exit(1);
    }
}

main();