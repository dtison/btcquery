import Bitcoin from "./bitcoin.js";
import Electrum from "./electrum.js";

export default function Balance() {

    async function getBalance(address) {

        const bitcoin = Bitcoin();
        const electrum = Electrum();

        const electrumhash =
            bitcoin.addressToElectrumScriptHash(address);

        await electrum.connect(
            "127.0.0.1",
            50001
        );

        const result =
            await electrum.getBalance(
                electrumhash
            );

        await electrum.close();

        return result;
    }

    return Object.freeze({
        getBalance,
    });
}
 