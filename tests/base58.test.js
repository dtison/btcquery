import Bitcoin from "../src/bitcoin.js";

const bitcoin = Bitcoin();

const decoded =
    bitcoin.decodeBase58("1112");

console.log(decoded);

try {

    bitcoin.decodeBase58("0");

} catch (err) {

    console.log(err.message);
}