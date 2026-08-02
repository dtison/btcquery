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

import crypto from "node:crypto";

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


    function convertBits(data, fromBits, toBits, pad = true) {
        let accumulator = 0;
        let bits = 0;
        const result = [];

        const maxValue = (1 << toBits) - 1;

        for (const value of data) {

            if (value < 0 || (value >> fromBits) !== 0) {
                throw new Error("Invalid data value");
            }

            accumulator =
                (accumulator << fromBits) | value;

            bits += fromBits;

            while (bits >= toBits) {

                bits -= toBits;

                result.push(
                    (accumulator >> bits) & maxValue
                );
            }
        }

        if (pad && bits > 0) {
            result.push(
                (accumulator << (toBits - bits)) & maxValue
            );
        }

        return result;
    }
    function sha256(data) {

        return crypto
            .createHash("sha256")
            .update(data)
            .digest();
    }

    function addressToScriptHash(address) {

        const decoded =
            decodeBech32(address);

        if (decoded.hrp !== "bc") {
            throw new Error(
                "Only Bitcoin mainnet addresses supported"
            );
        }

        const witnessVersion =
            decoded.data[0];

        if (witnessVersion !== 0) {
            throw new Error(
                "Only witness version 0 supported"
            );
        }

        const program =
            Buffer.from(
                convertBits(
                    decoded.data.slice(1),
                    5,
                    8,
                    false
                )
            );

        if (program.length !== 20) {
            throw new Error(
                "Only P2WPKH addresses supported"
            );
        }

        const scriptPubKey =
            Buffer.concat([
                Buffer.from([0x00, 0x14]),
                program
            ]);

        const hash =
            sha256(scriptPubKey);

        return Buffer
            .from(hash)
            .reverse()
            .toString("hex");
    }

    return Object.freeze({
        decodeBech32,
        addressToScriptHash
    });
   
}