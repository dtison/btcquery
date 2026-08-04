import Unspent from "../src/unspent.js";
import { parseArgs } from "../src/args.js";

const parsed = parseArgs(process.argv.slice(2));

const result =
    await Unspent().listUnspent(
        "bc1qwsa5qkvdmlgndaqgh7l2hnlanrtulq66tep9e9",
        { host: parsed.host, port: parsed.port }
    );

console.log(result);
