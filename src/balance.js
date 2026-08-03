import Bitcoin from "./bitcoin.js";
import Electrum from "./electrum.js";

export default function Balance() {

    function formatBalance(satoshis) {
        // Convert satoshis to BTC (1 BTC = 100,000,000 satoshis)
        return (satoshis / 100000000).toFixed(8);
    }

    async function getBalance(address, options = {}) {
        const host = options.host;
        const port = options.port;

        const bitcoin = Bitcoin();
        const electrum = Electrum(host, port);

        const electrumhash =
            bitcoin.addressToElectrumScriptHash(address);

        try {
            await electrum.connect();

            const result = await electrum.getBalance(
                electrumhash
            );
            
            // Format the balance to show BTC instead of satoshis
            return {
                confirmed: formatBalance(result.confirmed),
                unconfirmed: formatBalance(result.unconfirmed)
            };
        } finally {
            await electrum.close();
        }
    }

    return Object.freeze({
        getBalance,
    });
}
