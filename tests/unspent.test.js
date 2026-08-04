import Unspent from "../src/unspent.js";

const result =
    await Unspent().listUnspent(
        "bc1qwsa5qkvdmlgndaqgh7l2hnlanrtulq66tep9e9"
    );

console.log(result);
