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

The application can now query public Bitcoin address balances through a user's own electrs instance without private keys or wallet access.