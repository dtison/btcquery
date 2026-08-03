import History from "../src/history.js";

const result =
    await History().getHistory(
        "bc1qwsa5qkvdmlgndaqgh7l2hnlanrtulq66tep9e9"
    );

console.log(result);
