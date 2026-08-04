import Bitcoin from "./bitcoin.js";
import Electrum from "./electrum.js";

export default function History() {

    async function getHistory(address, options = {}) {
        const host = options.host;
        const port = options.port;

        const bitcoin = Bitcoin();
        const electrum = Electrum(host, port);

        const electrumhash =
            bitcoin.addressToElectrumScriptHash(address);

        try {
            await electrum.connect();

            const history = await electrum.getHistory(
                electrumhash
            );

            // For each transaction in history, fetch details to get amounts
            const detailedHistory = [];
            for (const tx of history) {
                try {
                    const txDetails = await electrum.request(
                        "blockchain.transaction.get",
                        [tx.tx_hash, true]  // verbose=true
                    );
                    
                    // Calculate net amount for this address
                    let amount = 0;
                    let isOutgoing = false;
                    
                    if (txDetails && txDetails.vout) {
                        // Find outputs that belong to our address
                        for (const output of txDetails.vout) {
                            let outputAddresses = [];
                            
                            // Handle different address formats in scriptPubKey
                            if (output.scriptPubKey && output.scriptPubKey.addresses) {
                                outputAddresses = output.scriptPubKey.addresses;
                            } else if (output.scriptPubKey && output.scriptPubKey.address) {
                                outputAddresses = [output.scriptPubKey.address];
                            }
                            
                            // Check if any of the addresses match our target address
                            if (outputAddresses.includes(address)) {
                                amount += parseFloat(output.value);
                            }
                        }
                        
                        // Find inputs from our address (to determine if outgoing)
                        if (txDetails.vin) {
                            for (const input of txDetails.vin) {
                                let inputAddresses = [];
                                
                                // Handle different address formats in prevout
                                if (input.prevout && input.prevout.scriptPubKey && input.prevout.scriptPubKey.addresses) {
                                    inputAddresses = input.prevout.scriptPubKey.addresses;
                                } else if (input.prevout && input.prevout.scriptPubKey && input.prevout.scriptPubKey.address) {
                                    inputAddresses = [input.prevout.scriptPubKey.address];
                                }
                                
                                // Check if any of the addresses match our target address
                                if (inputAddresses.includes(address)) {
                                    isOutgoing = true;
                                    // Subtract the value of inputs from our address
                                    amount -= parseFloat(input.value);
                                }
                            }
                        }
                    }
                    
                    detailedHistory.push({
                        height: tx.height,
                        tx_hash: tx.tx_hash,
                        amount: amount.toFixed(8)  // BTC as string
                    });
                } catch (err) {
                    // If we can't get transaction details, just include basic info
                    detailedHistory.push({
                        height: tx.height,
                        tx_hash: tx.tx_hash,
                        amount: null  // Could not determine amount
                    });
                }
            }
            
            return detailedHistory;
        } finally {
            await electrum.close();
        }
    }

    return Object.freeze({
        getHistory,
    });
}
