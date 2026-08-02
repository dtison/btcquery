#!/usr/bin/env node

import ElectrumClient from "./electrum.js";
import Balance from "./balance.js";

const VERSION = "0.2.1";

function showHelp() {
    console.log(`
btcquery ${VERSION}

Usage:
  btcquery <command>

Commands:
  server          Test connection to Electrum server

Options:
  -h, --help      Show this help
  -v, --version   Show version
`);
}

function showVersion() {
    console.log(VERSION);
}

async function serverCommand() {
    const electrum = ElectrumClient();

    console.log(
        "Connecting to 127.0.0.1:50001..."
    );

    try {
        await electrum.connect();

        console.log();
        console.log("Connected");
        console.log();

        const info =
            await electrum.serverVersion();

        console.log("Server");
        console.log("------");
        console.log(`Software : ${info.server}`);
        console.log(`Protocol : ${info.protocol}`);

        await electrum.close();

    } catch (err) {
        console.error();
        console.error(
            "Unable to connect to Electrum server."
        );
        console.error(err.message);

        process.exit(1);
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        showHelp();
        return;
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
            await serverCommand();
            break;

        case "balance":

            const result =
                await Balance.getBalance(args[1]);

            console.log(result);

            break;

        default:
            console.error(
                `Unknown command: ${args[0]}`
            );
            console.error(
                "Use --help for usage."
            );
            process.exit(2);
    }
}

main();