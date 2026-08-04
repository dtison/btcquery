import Electrum from "../src/electrum.js";
import { parseArgs } from "../src/args.js";

const parsed = parseArgs(process.argv.slice(2));

const electrum = Electrum(parsed.host, parsed.port);

await electrum.connect();

const result =
    await electrum.getBalance(
      "e1b5f92743cb23dfcfed126a0b1d8e8eb472eb9029ccccf26bd1cc923e5274e7"
    );

console.log(result);

await electrum.close();

console.log("Connection closed");