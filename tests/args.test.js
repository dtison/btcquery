import {
    parseArgs,
    DEFAULT_HOST,
    DEFAULT_PORT
} from "../src/args.js";

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function assertThrows(fn, match) {
    let threw = false;

    try {
        fn();
    } catch (err) {
        threw = true;

        if (match && !String(err.message).includes(match)) {
            throw new Error(
                `Expected error matching "${match}", got: ${err.message}`
            );
        }
    }

    if (!threw) {
        throw new Error("Expected function to throw");
    }
}

// Defaults
{
    const parsed = parseArgs([]);

    assert(parsed.host === DEFAULT_HOST, "default host");
    assert(parsed.port === DEFAULT_PORT, "default port");
    assert(parsed.command === null, "no command");
    assert(parsed.help === false, "help false");
    assert(parsed.version === false, "version false");
}

// Flags before command
{
    const parsed = parseArgs([
        "--host", "10.0.0.5",
        "--port", "50001",
        "server"
    ]);

    assert(parsed.host === "10.0.0.5", "host before command");
    assert(parsed.port === 50001, "port before command");
    assert(parsed.command === "server", "command after flags");
}

// Flags after command
{
    const parsed = parseArgs([
        "balance",
        "--host", "node.local",
        "bc1qexample"
    ]);

    assert(parsed.command === "balance", "command first");
    assert(parsed.host === "node.local", "host after command");
    assert(parsed.args[0] === "bc1qexample", "address positional");
}

// Equals form
{
    const parsed = parseArgs([
        "--host=192.168.1.10",
        "--port=50002",
        "server"
    ]);

    assert(parsed.host === "192.168.1.10", "host equals form");
    assert(parsed.port === 50002, "port equals form");
}

// Help and version
{
    const help = parseArgs(["--help"]);
    assert(help.help === true, "help flag");

    const version = parseArgs(["-v"]);
    assert(version.version === true, "version flag");
}

// Invalid port
assertThrows(
    () => parseArgs(["--port", "abc", "server"]),
    "Invalid port"
);

assertThrows(
    () => parseArgs(["--port", "70000", "server"]),
    "Invalid port"
);

assertThrows(
    () => parseArgs(["--port", "0", "server"]),
    "Invalid port"
);

// Missing values
assertThrows(
    () => parseArgs(["--host"]),
    "--host requires a value"
);

assertThrows(
    () => parseArgs(["--port"]),
    "--port requires a value"
);

// Unknown option
assertThrows(
    () => parseArgs(["--unknown"]),
    "Unknown option"
);

console.log("args.test.js: all assertions passed");
