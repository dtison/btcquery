# Security

## Philosophy

`btcquery` is designed to be a **read-only** Bitcoin blockchain query utility.

Its purpose is to retrieve blockchain information from a **trusted local Electrum server** (such as `electrs`) backed by the user's own Bitcoin full node.

The project intentionally avoids any functionality that could place private key material at risk.

## Security Goals

* Never handle private keys.
* Never generate private keys.
* Never generate or import seed phrases.
* Never create or manage wallets.
* Never sign transactions.
* Never broadcast transactions.
* Never communicate with public blockchain explorer APIs.
* Never collect telemetry or usage analytics.

## Trust Model

`btcquery` assumes the following components are trusted:

* Your Bitcoin full node.
* Your local Electrum server.
* Your local operating system.

No trust is placed in third-party blockchain explorers or remote query services.

## Privacy

One motivation for this project is to avoid leaking information about addresses of interest.

When a Bitcoin address is entered into a public blockchain explorer, that service may learn:

* The address being investigated.
* The IP address of the requester.
* The approximate time of the query.

`btcquery` performs all address lookups against your own infrastructure, avoiding this disclosure.

## Scope

The following features are intentionally out of scope:

* Wallet management
* Descriptor support
* Key derivation
* Seed phrase generation
* Transaction construction
* Transaction signing
* Transaction broadcasting
* Exchange integration
* Cloud synchronization

If a feature requires access to private key material, it does not belong in this project.

## Auditable Design

The project is intended to remain small, readable, and easy to audit.

Security benefits from simplicity. Features that substantially increase complexity or expand the trust boundary will generally not be accepted.
