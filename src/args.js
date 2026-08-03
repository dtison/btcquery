const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 50001;

/**
 * Parse CLI arguments into command, positional args, and connection options.
 *
 * Supports global flags before or after the command name:
 *   btcquery --host 10.0.0.5 --port 50001 server
 *   btcquery balance --host 10.0.0.5 bc1q...
 *
 * @param {string[]} argv - process.argv.slice(2)
 * @returns {{
 *   help: boolean,
 *   version: boolean,
 *   command: string | null,
 *   args: string[],
 *   host: string,
 *   port: number
 * }}
 */
export function parseArgs(argv) {
    let help = false;
    let version = false;
    let host = DEFAULT_HOST;
    let port = DEFAULT_PORT;
    let command = null;
    const args = [];

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === "-h" || token === "--help") {
            help = true;
            continue;
        }

        if (token === "-v" || token === "--version") {
            version = true;
            continue;
        }

        if (token === "--host") {
            const value = argv[++i];

            if (value === undefined || value.startsWith("-")) {
                throw new Error("--host requires a value");
            }

            host = value;
            continue;
        }

        if (token.startsWith("--host=")) {
            const value = token.slice("--host=".length);

            if (value === "") {
                throw new Error("--host requires a value");
            }

            host = value;
            continue;
        }

        if (token === "--port") {
            const value = argv[++i];

            if (value === undefined || value.startsWith("-")) {
                throw new Error("--port requires a value");
            }

            port = parsePort(value);
            continue;
        }

        if (token.startsWith("--port=")) {
            const value = token.slice("--port=".length);

            if (value === "") {
                throw new Error("--port requires a value");
            }

            port = parsePort(value);
            continue;
        }

        if (token.startsWith("-")) {
            throw new Error(`Unknown option: ${token}`);
        }

        if (command === null) {
            command = token;
        } else {
            args.push(token);
        }
    }

    return {
        help,
        version,
        command,
        args,
        host,
        port
    };
}

function parsePort(value) {
    if (!/^\d+$/.test(value)) {
        throw new Error(
            `Invalid port: ${value} (expected integer 1-65535)`
        );
    }

    const port = Number(value);

    if (port < 1 || port > 65535) {
        throw new Error(
            `Invalid port: ${value} (expected integer 1-65535)`
        );
    }

    return port;
}

export { DEFAULT_HOST, DEFAULT_PORT };
