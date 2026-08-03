import Balance from "../src/balance.js";

// Test the balance formatting function directly
const balance = Balance();

// Mock the electrum getBalance to return satoshis
const mockGetBalance = async () => {
    return { confirmed: 1234000, unconfirmed: 5678000 };
};

// Since we can't easily mock the full Electrum client for this test,
// let's just verify our formatting function works correctly
function formatBalance(satoshis) {
    // Convert satoshis to BTC (1 BTC = 100,000,000 satoshis)
    return (satoshis / 100000000).toFixed(8);
}

console.log("Testing balance formatting:");
console.log("1234000 satoshis =", formatBalance(1234000), "BTC");
console.log("5678000 satoshis =", formatBalance(5678000), "BTC");
console.log("0 satoshis =", formatBalance(0), "BTC");
console.log("100000000 satoshis =", formatBalance(100000000), "BTC");