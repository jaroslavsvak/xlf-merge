const assert = require('assert');
const fs = require('fs');

const arbHandler = require('../arb-handler');
const xlfHandler = require('../xlf-handler');

describe('ArbHandler', () => {
    const expectedArb = fs.readFileSync('arb-handler-save1.expected.arb', { encoding: 'utf-8' });

    it('Merges as JSON', () => {
        const input1 = fs.readFileSync('arb1.arb');
        const input2 = fs.readFileSync('arb2.arb');

        const units = [...arbHandler.parse(input1), ...arbHandler.parse(input2)];
        const json = arbHandler.save(units);
        assert.strictEqual(json, expectedArb);
    });

    it('Converts from XLF', () => {
        const input1 = fs.readFileSync('xlf1.xlf');
        const input2 = fs.readFileSync('xlf2.xlf');

        const units = [...xlfHandler.parse(input1), ...xlfHandler.parse(input2)];
        const json = arbHandler.save(units);
        assert.strictEqual(json, expectedArb);
    });
});
