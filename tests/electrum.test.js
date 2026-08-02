import Electrum from "../src/electrum.js";

const electrum = Electrum();

await electrum.connect(
    "127.0.0.1",
    50001
);

const result =
    await electrum.getBalance(
      "e1b5f92743cb23dfcfed126a0b1d8e8eb472eb9029ccccf26bd1cc923e5274e7"
    );

console.log(result);

await electrum.close();

console.log("Connection closed");