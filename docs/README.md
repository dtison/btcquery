# btcquery

A read-only Bitcoin blockchain query utility.

`btcquery` is a lightweight command-line tool for querying Bitcoin blockchain information through a user's own local infrastructure.

It is designed to work with a local Bitcoin full node and Electrum-compatible index server, avoiding the need to disclose addresses of interest to third-party blockchain explorers.

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

The project intentionally avoids unnecessary complexity.

## Features

Current features:

* Connect to a local or remote Electrum server.
* Verify Electrum server connectivity.
* Display Electrum server software and protocol version.
* Query address balances.
* Select Electrum host and port with CLI flags.

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
{ confirmed: 0, unconfirmed: 0 }
```

Example connect to electrs on another host (LAN or VPN):

```bash
btcquery --host 10.0.0.5 --port 50001 server
btcquery --host 10.0.0.5 balance bc1qwsa5qkvdmlgndaqgh7l2hnlanrtulq66tep9e9
```

Electrum JSON-RPC is plaintext. Only use `--host` over a trusted network path (private LAN, WireGuard, or similar). Do not expose electrs to the public internet.

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

`btcquery` does not maintain its own blockchain index.

It queries information from your existing Bitcoin infrastructure.

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

