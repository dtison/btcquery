## Decision Log

### 2026-08-01

- Project name selected: btcquery
- Read-only architecture adopted
- No wallet functionality
- No signing layer
- No private key handling
- No seed phrase support
- Node.js selected for implementation
- Electrum protocol chosen as the query interface
- Initial tested backend: Bitcoin Knots v29.3 + electrs commit 32e5944

## v0.3.0 Completed

Implemented:

- Bech32 decoder
- Bitcoin mainnet P2WPKH address parsing
- Electrum scripthash generation
- Electrum balance queries
- `btcquery balance <address>` command

## v0.3.1 Enhancements

- Support for P2PKH addresses in addition to Bech32
- Remote Electrum server support via --host and --port flags
- Documentation improvements for trusted network usage

## v0.3.2 Features

- Format balance display as Bitcoin values (e.g., 0.01234 instead of 1234000 satoshis)
- `btcquery history <address>` via `blockchain.scripthash.get_history`