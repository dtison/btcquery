# btcquery

A read-only Bitcoin blockchain query utility.

`btcquery` is a lightweight command-line tool for querying Bitcoin blockchain information through a user's own local infrastructure.

It works with a local Bitcoin full node and Electrum-compatible index server, avoiding the need to disclose addresses of interest to third-party blockchain explorers. Since everything runs on your local private network, there is no communicating at all with any external servers. This preserves the privacy of your Bitcoin addresses and balances.

## Quick Start

- **Full Node**
The source of data for btcquery is the public Bitcoin blockchain. There are several options: Bitcoin Core, Bitcoin Knots,Umbrel, myNode, nodl, Ronin Dojo, RaspiBlitz, Start9 Embassy.

Set up your full node with these options in bitcoin.conf:

    daemon=1
    server=1
    rest=1
    zmqpubrawblock=tcp://127.0.0.1:28332
    zmqpubrawtx=tcp://127.0.0.1:28333
    rpcauth=electrs:password-hash
    dbcache=2048
    rpcbind=127.0.0.1
    rpcallowip=127.0.0.0/8

- **Electrum Server**

The Electrum Server re-indexes the Bitcoin Blockchain in a way you can query by Bitcoin address **without** needing a wallet open or the security risks of having private keys attached to the internet. (Hot wallet risk)

Use Electrs https://github.com/romanz/electrs. 

electrs.toml:

    network = "bitcoin"

    # Bitcoin Knots RPC
    daemon_rpc_addr = "127.0.0.1:8332"

    # Bitcoin Knots P2P
    daemon_p2p_addr = "127.0.0.1:8333"

    # Knots data directory
    daemon_dir = "/home/dtison/.bitcoin"

    # Electrs database
    db_dir = "/home/dtison/electrs-db"

    # Local Electrum server
    electrum_rpc_addr = "0.0.0.0:50001"

    # Logging
    log_filters = "INFO"

    # RISC-V / 8GB RAM tuning
    db_parallelism = 4

    auth =  "electrs:password"

Once the Bitcoin full node is sync'd and the electrs has indexed the blockchain, you should be able to connect using btcquery and the --host options.

See architecture.md for more details of how everything works together.

## Why?

When using public blockchain explorers, users may reveal:

* Bitcoin addresses they are investigating.
* Their IP address.
* The time and frequency of their queries.

`btcquery` is designed for users who prefer to query their own infrastructure.

Your node. Your data. Your privacy.

## Project Goals

`btcquery` focuses on being:

* Simple
* Readable
* Auditable
* Privacy-focused
* Dependency-light
* Security

The project intentionally avoids importing any npm libraries.

## Features

Current features:

* Connect to a local or remote Electrum server.
* Verify Electrum server connectivity.
* Display Electrum server software and protocol version.
* Query address balances.
* Query address transaction history.
* Query address unspent outputs (UTXOs).
* Select Electrum host and port with CLI flags.
* Support for P2PKH (Pay-to-Pubkey-Hash) addresses in addition to Bech32.

Example connect to server:

```bash
btcquery server
```

Output:

```text
Connecting to 127.0.0.1:50001...

Connected

Server
------
Software : electrs/0.11.1
Protocol : 1.4
```

Example get address balance:

```bash
btcquery balance bc1qwsa5qkvdmlgndaqgh7l2hnlanrtulq66tep9e9
```

Output:

```text
{ confirmed: "0.00000000", unconfirmed: "0.00000000" }
```

Example get address history:

```bash
btcquery history bc1qwsa5qkvdmlgndaqgh7l2hnlanrtulq66tep9e9
```

Output:

```text
[
  { height: 700000, tx_hash: "abc..." },
  { height: 700001, tx_hash: "def..." }
]
```

Each entry is a transaction affecting the address. `height` is the block
height (0 or negative for unconfirmed). `tx_hash` is the transaction id.

Example list unspent outputs:

```bash
btcquery unspent bc1qwsa5qkvdmlgndaqgh7l2hnlanrtulq66tep9e9
```

Output:

```text
[
  {
    height: 700000,
    tx_hash: "abc...",
    tx_pos: 0,
    value: "0.01234000"
  }
]
```

Each entry is a transaction. `amount` shows the net effect on your balance (positive for incoming, negative for outgoing). `height` is 0 for mempool outputs.

Example connect to electrs on another host (LAN or VPN):

```bash
btcquery --host 10.0.0.5 --port 50001 server
btcquery --host 10.0.0.5 history bc1qwsa5qkvdmlgndaqgh7l2hnlanrtulq66tep9e9
```

All commands support `--host` and `--port` flags for connecting to remote Electrum servers:

```bash
btcquery --host 10.0.0.5 --port 50001 history bc1q...
btcquery --host 10.0.0.5 unspent bc1q...
```

Electrum JSON-RPC is plaintext. Only use `--host` over a trusted network path (private LAN, WireGuard, or similar). Do not expose electrs to the public internet.

The application supports both local and remote Electrum servers via --host and --port flags.

## Non-Features

`btcquery` is not a wallet.

It does not and will not provide:

* Private key handling
* Seed phrase management
* Wallet creation
* Wallet import
* Transaction signing
* Transaction broadcasting
* Exchange integration
* Third-party blockchain explorer APIs

Keeping these features out of scope is intentional.

## Requirements

`btcquery` requires:

* A Bitcoin full node.
* A fully synchronized blockchain.
* An Electrum-compatible index server.

Tested configuration:

* Bitcoin Knots 29.3
* electrs 0.11.1
* Node.js

## Architecture

```text
Bitcoin Network
       |
       v
Bitcoin Core / Bitcoin Knots
       |
       v
    electrs
       |
       | Electrum JSON-RPC
       v
   btcquery CLI
       |
       v
 User Output
```

 
Btcquery retrieves information from your existing Bitcoin infrastructure.

## Installation

Clone the repository:

```bash
git clone https://github.com/dtison/btcquery.git
cd btcquery
```

Install:

```bash
npm install
```

For local development:

```bash
npm link
```

Verify:

```bash
btcquery --help
```

## Usage

Show help:

```bash
btcquery --help
```

Show version:

```bash
btcquery --version
```

Test Electrum connectivity (defaults to `127.0.0.1:50001`):

```bash
btcquery server
```

Connect to a remote Electrum server:

```bash
btcquery --host 10.0.0.5 --port 50001 server
```

Query an address balance on a remote server:

```bash
btcquery --host 10.0.0.5 balance bc1qwsa5qkvdmlgndaqgh7l2hnlanrtulq66tep9e9
```

### Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `--host <host>` | Electrum server hostname or IP | `127.0.0.1` |
| `--port <port>` | Electrum server TCP port | `50001` |
| `-h`, `--help` | Show help | |
| `-v`, `--version` | Show version | |

Flags may appear before or after the command name.

## Development

The project uses a small, dependency-light design.

Current source layout:

```text
src/

index.js        Command-line interface
args.js         CLI argument parsing
electrum.js     Electrum protocol client
balance.js      Balance command logic
history.js      History command logic
unspent.js      Unspent outputs command logic
bitcoin.js      Address parsing and scripthash conversion
```

Modules use a functional style with private state managed through closures.

## Compatibility

Known working configuration:

| Component     | Version | Status |
| ------------- | ------- | ------ |
| Bitcoin Knots | 29.3    | Tested |
| electrs       | 0.11.1  | Tested |

Additional compatibility information will be documented as tested.

## Security

See:

`docs/security.md`

The project follows a read-only design philosophy:

* No private keys.
* No wallet functionality.
* No signing.
* No transaction broadcasting.
* No external blockchain APIs.

## Address Support

The application supports both Bech32 (P2WPKH) and P2PKH Bitcoin addresses:

* Native SegWit addresses (Bech32 encoding)
* Pay-to-Witness-Public-Key-Hash (P2WPKH) 
* Pay-to-Pubkey-Hash (P2PKH)

## Contributing

See:

`CONTRIBUTING.md`

Contributions should preserve the project's goals of simplicity, privacy, and auditability.

## Project Plan

See:

`PROJECT_PLAN.md`

The project follows a release principle:

> Each release should allow users to accomplish something they could not do before.

## License

MIT License

