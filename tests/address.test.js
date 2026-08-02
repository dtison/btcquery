import Bitcoin from "../src/bitcoin.js";

const bitcoin = Bitcoin();

const address =  "bc1qwsa5qkvdmlgndaqgh7l2hnlanrtulq66tep9e9";

const expectedScripthash =
    "e1b5f92743cb23dfcfed126a0b1d8e8eb472eb9029ccccf26bd1cc923e5274e7";

const actualScripthash =
    bitcoin.addressToScriptHash(address);

console.log("Address:");
console.log(address);

console.log("\nElectrum scripthash:");
console.log(actualScripthash);

if (actualScripthash !== expectedScripthash) {
    throw new Error(
        "scripthash mismatch"
    );
}

console.log("\nTest passed");