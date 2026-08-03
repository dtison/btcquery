import Bitcoin from "../src/bitcoin.js";

const bitcoin = Bitcoin();

const VALID_ADDRESS =
    "1BoatSLRHtKNngkdXEeobR76b53LETtpyT";

const INVALID_ADDRESS =
    "1BoatSLRHtKNngkdXEeobR76b53LETtpyU";

console.log("Valid Base58Check test:");

const result =
    bitcoin.decodeBase58Check(
        VALID_ADDRESS
    );

console.log(result);

if (result.version !== 0) {
    throw new Error(
        "Expected version byte 0"
    );
}

if (result.payload.length !== 20) {
    throw new Error(
        "Expected 20-byte payload"
    );
}

console.log();
console.log("Invalid checksum test:");

try {

    bitcoin.decodeBase58Check(
        INVALID_ADDRESS
    );

    throw new Error(
        "Checksum verification should have failed"
    );

} catch (err) {

    if (
        err.message !==
        "Invalid Base58 checksum"
    ) {
        throw err;
    }

    console.log(err.message);
}

console.log();
console.log("Base58Check tests passed.");