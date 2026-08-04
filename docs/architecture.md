# Architecture

## Overview

`btcquery` is a lightweight command-line client that communicates with a local Electrum server using the Electrum JSON-RPC protocol.

It does not maintain its own blockchain database and does not interact directly with the Bitcoin peer-to-peer network.

```
        Bitcoin Network
               │
               ▼
     Bitcoin Core / Bitcoin Knots
               │
      RPC / REST / ZMQ
               │
               ▼
            electrs
               │
     Electrum JSON-RPC
               │
               ▼
           btcquery
               │
               ▼
         Terminal Output
```

## Design Principles

* Read-only by design.
* Stateless.
* Minimal dependencies.
* Simple, auditable code.
* Clear separation of responsibilities.

## Repository Layout

```
btcquery/

├── docs/
├── src/
├── tests/
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

## Source Layout

```
src/

index.js            Entry point

config.js           Configuration loading

electrum.js         Electrum protocol transport

address.js          Address parsing and script hash conversion

formatter.js        Human-readable formatting

balance.js          Balance command logic

history.js          History command logic

unspent.js          Unspent outputs command logic

bitcoin.js          Bitcoin address parsing
```

## Responsibilities

Each module should have one clearly defined responsibility.

For example:

* `electrum.js` knows how to communicate with an Electrum server.
* `address.js` converts Bitcoin addresses into Electrum script hashes.
* Command modules perform one user-facing operation.
* Formatting code is isolated from business logic.

## Future Growth

New commands should reuse the existing transport layer rather than creating new networking implementations.

Whenever practical, complexity should be reduced rather than added.

The goal is to keep the project approachable for developers who wish to understand the entire codebase.


## Current Address Support

The application supports both Bech32 (P2WPKH) and P2PKH Bitcoin addresses:

- Bitcoin mainnet addresses
- Native SegWit addresses (Bech32 encoding)
- Witness version 0
- Pay-to-Witness-Public-Key-Hash (P2WPKH)
- Pay-to-Pubkey-Hash (P2PKH)