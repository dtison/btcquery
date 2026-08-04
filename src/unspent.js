import Bitcoin from "./bitcoin.js";
import Electrum from "./electrum.js";

export default function Unspent() {

    function formatValue(satoshis) {
        return (satoshis / 100000000).toFixed(8);
    }

    async function listUnspent(address, options = {}) {
        const host = options.host;
        const port = options.port;

        const bitcoin = Bitcoin();
        const electrum = Electrum(host, port);

        const electrumhash =
            bitcoin.addressToElectrumScriptHash(address);

        try {
            await electrum.connect();

            const result = await electrum.listUnspent(
                electrumhash
            );

            return result.map((utxo) => ({
                height: utxo.height,
                tx_hash: utxo.tx_hash,
                tx_pos: utxo.tx_pos,
                value: formatValue(utxo.value)
            }));
        } finally {
            await electrum.close();
        }
    }

    return Object.freeze({
        listUnspent,
    });
}
