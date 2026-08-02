import Bitcoin from "./bitcoin.js";
import Electrum from "./electrum.js";

function Balance() {

    async function getBalance(address) {

        const bitcoin = Bitcoin();
        const electrum = Electrum();

        const scripthash =
            bitcoin.addressToScriptHash(address);

        await electrum.connect(
            "127.0.0.1",
            50001
        );

        const result =
            await electrum.getBalance(
                scripthash
            );

        await electrum.close();

        return result;
    }

    return Object.freeze({
        getBalance,
    });
}

export default Balance();