import net from "node:net";

export default function ElectrumClient(
    host = "127.0.0.1",
    port = 50001
) {
    let socket = null;
    let buffer = "";
    let nextId = 1;

    function connect() {
        return new Promise((resolve, reject) => {
            socket = net.createConnection(
                {
                    host,
                    port
                },
                () => resolve()
            );

            socket.setEncoding("utf8");

            socket.once("error", reject);
        });
    }

    function close() {
        return new Promise((resolve) => {
            if (!socket) {
                resolve();
                return;
            }

            const currentSocket = socket;

            socket = null;

            currentSocket.end(() => {
                resolve();
            });
        });
    }

    function request(method, params = []) {
        return new Promise((resolve, reject) => {
            const id = nextId++;

            const payload =
                JSON.stringify({
                    id,
                    method,
                    params
                }) + "\n";

            function onData(chunk) {
                buffer += chunk;

                const newline = buffer.indexOf("\n");

                if (newline === -1) {
                    return;
                }

                const line = buffer.slice(0, newline);
                buffer = buffer.slice(newline + 1);

                socket.off("data", onData);

                try {
                    const response = JSON.parse(line);

                    if (response.error) {
                        reject(new Error(response.error.message));
                        return;
                    }

                    resolve(response.result);
                } catch (err) {
                    reject(err);
                }
            }

            socket.on("data", onData);

            socket.write(payload);
        });
    }

    async function serverVersion() {
        const result = await request(
            "server.version",
            [
                "btcquery",
                "1.4"
            ]
        );

        return {
            server: result[0],
            protocol: result[1]
        };
    }

    function getBalance(scripthash) {
        return request(
            "blockchain.scripthash.get_balance",
            [scripthash]
        );
    }

    function getHistory(scripthash) {
        return request(
            "blockchain.scripthash.get_history",
            [scripthash]
        );
    }

    return Object.freeze({
        connect,
        close,
        request,
        serverVersion,
        getBalance,
        getHistory
    });
}