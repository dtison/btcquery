import Bitcoin from "./bitcoin.js";
import Electrum from "./electrum.js";

export default function Balance() {

    async function getBalance(address, options = {}) {
        const host = options.host;
        const port = options.port;

        const bitcoin = Bitcoin();
        const electrum = Electrum(host, port);

        const electrumhash =
            bitcoin.addressToElectrumScriptHash(address);

        try {
            await electrum.connect();

            return await electrum.getBalance(
                electrumhash
            );
        } finally {
            await electrum.close();
        }
    }

    return Object.freeze({
        getBalance,
    });
}
