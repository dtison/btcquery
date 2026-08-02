/*
 * Bitcoin utility functions.
 *
 * This module contains Bitcoin-specific logic only.
 *
 * All operations are read-only.
 * 
 * It does not:
 * - connect to Bitcoin nodes
 * - connect to Electrum servers
 * - handle private keys
 * - create or broadcast transactions
 */


export default function Bitcoin() {

    const BECH32_CHARSET =
        "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

    function polymod(values) {
        const generator = [
            0x3b6a57b2,
            0x26508e6d,
            0x1ea119fa,
            0x3d4233dd,
            0x2a1462b3
        ];

        let chk = 1;

        for (const value of values) {
            const top = chk >> 25;

            chk = ((chk & 0x1ffffff) << 5) ^ value;

            for (let i = 0; i < 5; i++) {
                if ((top >> i) & 1) {
                    chk ^= generator[i];
                }
            }
        }

        return chk;
    }

    function hrpExpand(hrp) {
        const values = [];

        for (const char of hrp) {
            values.push(char.charCodeAt(0) >> 5);
        }

        values.push(0);

        for (const char of hrp) {
            values.push(char.charCodeAt(0) & 31);
        }

        return values;
    }

    function verifyChecksum(hrp, data) {
        return (
            polymod(
                hrpExpand(hrp).concat(data)
            ) === 1
        );
    }

    function decodeBech32(address) {

    if (address !== address.toLowerCase() &&
        address !== address.toUpperCase()) {
        throw new Error(
            "Mixed case Bech32 string"
        );
    }

    address = address.toLowerCase();

        const separator = address.lastIndexOf("1");

        if (separator < 1) {
            throw new Error("Invalid Bech32 address");
        }

        const hrp =
            address.slice(0, separator);

        const dataPart =
            address.slice(separator + 1);

        const data = [];

        for (const char of dataPart) {

            const value =
                BECH32_CHARSET.indexOf(char);

            if (value === -1) {
                throw new Error(
                    "Invalid Bech32 character"
                );
            }

            data.push(value);
        }

        if (!verifyChecksum(hrp, data)) {
            throw new Error(
                "Invalid Bech32 checksum"
            );
        }

        return {
            hrp,
            data: data.slice(0, -6)
        };
    }

    return Object.freeze({
        decodeBech32
    });
}