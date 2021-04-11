const assert = require('assert');
const fs = require('fs');

const jsonHandler = require('../json-handler');
const xlfHandler = require('../xlf-handler');

describe('JsonfHandler', () => {
    const expectedJson = fs.readFileSync('json-handler-save1.expected.json', { encoding: 'utf-8' });

    it('Merges as JSON', () => {
        const input1 = fs.readFileSync('json1.json');
        const input2 = fs.readFileSync('json2.json');

        const units = [...jsonHandler.parse(input1), ...jsonHandler.parse(input2)];
        const json = jsonHandler.save(units);
        assert.strictEqual(json, expectedJson);
    });

    it('Converts from XLF', () => {
        const input1 = fs.readFileSync('xlf1.xlf');
        const input2 = fs.readFileSync('xlf2.xlf');

        const units = [...xlfHandler.parse(input1), ...xlfHandler.parse(input2)];
        const json = jsonHandler.save(units);
        assert.strictEqual(json, expectedJson);
    });
});
