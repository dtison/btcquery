import Balance from "../src/balance.js";

const result =
    await Balance().getBalance(
        "bc1qwsa5qkvdmlgndaqgh7l2hnlanrtulq66tep9e9"
    );

console.log(result);
