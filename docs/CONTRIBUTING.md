# Contributing

Thank you for your interest in contributing to **btcquery**.

The long-term goal of this project is to provide a small, reliable, and security-focused command-line utility for querying a trusted local Electrum server.

## Project Philosophy

This project values:

* Simplicity
* Readability
* Predictability
* Security
* Privacy

Features that increase complexity without providing significant value are unlikely to be accepted.

## Coding Guidelines

* Prefer readability over cleverness.
* Keep functions small and focused.
* One responsibility per source file.
* Use descriptive names.
* Add documentation for exported functions.
* Minimize dependencies.
* Avoid unnecessary abstractions.

## Security Guidelines

Contributions must not introduce support for:

* Private keys
* Seed phrases
* Wallet creation
* Wallet management
* Transaction signing
* Transaction broadcasting
* Telemetry
* Third-party blockchain explorer APIs

These limitations are intentional and are central to the project's design.

## Pull Requests

Please keep pull requests focused on a single logical change.

Small, well-tested pull requests are much easier to review than large changes covering multiple topics.

## Bug Reports

When reporting a bug, please include:

* Operating system
* Node.js version
* Bitcoin node software and version
* Electrs version or commit
* Steps to reproduce
* Relevant log output

## Compatibility

Compatibility with Bitcoin node software evolves over time.

If you successfully test a new version of Bitcoin Core, Bitcoin Knots, or electrs, please include the version information with your report or pull request so it can be added to the compatibility documentation.

## Code of Conduct

Please be respectful, constructive, and patient.

The goal is to build reliable software and a welcoming project for users and contributors alike.
