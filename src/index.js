#!/usr/bin/env node

import ElectrumClient from "./electrum.js";
import Balance from "./balance.js";
import History from "./history.js";
import { parseArgs } from "./args.js";

const VERSION = "0.3.1";

function showHelp() {
    console.log(`
btcquery ${VERSION}

Usage:
  btcquery [options] <command>

Commands:
  server                    Test connection to Electrum server
  balance <address>         Display balance
  history <address>         Display transaction history

Options:
  --host <host>   Electrum server host (default: 127.0.0.1)
  --port <port>   Electrum server port (default: 50001)
  -h, --help      Show this help
  -v, --version   Show version

Examples:
  btcquery server
  btcquery --host 10.0.0.5 --port 50001 server
  btcquery --host 10.0.0.5 balance bc1q...
  btcquery history bc1q...
`);
}

function showVersion() {
    console.log(VERSION);
}

async function serverCommand(host, port) {
    const electrum = ElectrumClient(host, port);

    console.log(
        `Connecting to ${host}:${port}...`
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

async function balanceCommand(address, host, port) {
    if (!address) {
        console.error(
            "Usage: btcquery balance <address>"
        );
        process.exit(2);
    }

    try {
        const result = await Balance().getBalance(
            address,
            { host, port }
        );

        console.log(result);
    } catch (err) {
        console.error();
        console.error(
            "Unable to query balance."
        );
        console.error(err.message);
        process.exit(1);
    }
}

async function historyCommand(address, host, port) {
    if (!address) {
        console.error(
            "Usage: btcquery history <address>"
        );
        process.exit(2);
    }

    try {
        const result = await History().getHistory(
            address,
            { host, port }
        );

        console.log(result);
    } catch (err) {
        console.error();
        console.error(
            "Unable to query history."
        );
        console.error(err.message);
        process.exit(1);
    }
}

async function main() {
    let parsed;

    try {
        parsed = parseArgs(process.argv.slice(2));
    } catch (err) {
        console.error(err.message);
        console.error("Use --help for usage.");
        process.exit(2);
    }

    if (parsed.help || (parsed.command === null && !parsed.version)) {
        showHelp();
        return;
    }

    if (parsed.version) {
        showVersion();
        return;
    }

    switch (parsed.command) {
        case "server":
            await serverCommand(parsed.host, parsed.port);
            break;

        case "balance":
            await balanceCommand(
                parsed.args[0],
                parsed.host,
                parsed.port
            );
            break;

        case "history":
            await historyCommand(
                parsed.args[0],
                parsed.host,
                parsed.port
            );
            break;

        default:
            console.error(
                `Unknown command: ${parsed.command}`
            );
            console.error(
                "Use --help for usage."
            );
            process.exit(2);
    }
}

main();
