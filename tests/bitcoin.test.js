import Bitcoin from "../src/bitcoin.js";

const bitcoin = Bitcoin();

console.log("Valid Bech32 checksum test:");

const result = bitcoin.decodeBech32(
    "A12UEL5L"
);

console.log(result);


console.log("\nInvalid checksum test:");

try {
    bitcoin.decodeBech32(
        "A12UEL5M"
    );

    console.error(
        "ERROR: invalid checksum accepted"
    );

} catch (err) {
    console.log(
        err.message
    );
}