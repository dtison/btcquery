#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { parseArgs } from './src/args.js';

const parsed = parseArgs(process.argv.slice(2));

// Default to local electrum server if no host specified
if (parsed.host === "127.0.0.1" && parsed.port === 50001) {
    console.log("Using default local Electrum server at 127.0.0.1:50001");
} else {
    console.log(`Using Electrum server at ${parsed.host}:${parsed.port}`);
}

const testFiles = [
    'tests/args.test.js',
    'tests/base58.test.js',
    'tests/base58check.test.js',
    'tests/bitcoin.test.js',
    'tests/address.test.js',
    'tests/electrum.test.js',
    'tests/balance.test.js',
    'tests/history.test.js',
    'tests/unspent.test.js'
];

console.log('Running tests with host:', parsed.host, 'port:', parsed.port);
console.log('---');

for (const testFile of testFiles) {
    try {
        console.log(`Running ${testFile}...`);
        const output = execSync(`node ${testFile} --host ${parsed.host} --port ${parsed.port}`, {
            encoding: 'utf-8',
            stdio: 'pipe'
        });
        console.log(output.trim());
        console.log('✓ Success');
    } catch (error) {
        console.error(`✗ Failed: ${testFile}`);
        console.error(error.message);
        process.exit(1);
    }
    console.log('');
}

console.log('All tests completed successfully!');