const assert = require('assert');
const fs = require('fs');

const jsonHandler = require('../json-handler');
const xlfHandler = require('../xlf-handler');

describe('JsonfHandler', () => {
    const input1 = fs.readFileSync('xlf1.xlf');
    const input2 = fs.readFileSync('xlf2.xlf');

    it('Merges as JSON', () => {
        const units = [...xlfHandler.parse(input1), ...xlfHandler.parse(input2)];
        const json = jsonHandler.save(units);
        const expectedJson = fs.readFileSync('json-handler-save1.expected.json', { encoding: 'utf-8' });
        assert.strictEqual(json, expectedJson);
    });
});
