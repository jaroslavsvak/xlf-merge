const assert = require('assert');
const fs = require('fs');

const jsonHandler = require('../json-handler');
const xlfHandler = require('../xlf-handler');

describe('JsonfHandler', () => {
    const expectedJson = fs.readFileSync('json-handler-save1.expected.json', { encoding: 'utf-8' });

    it('Merges as JSON', () => {
        const input1 = fs.readFileSync('json1.json');
        const input2 = fs.readFileSync('json2.json');

        const units = [...jsonHandler.createParser(input1).parse(), ...jsonHandler.createParser(input2).parse()];
        const json = jsonHandler.save(units, 'de');
        assert.strictEqual(json, expectedJson);
    });

    it('Converts from XLF', () => {
        const input1 = fs.readFileSync('xlf1.xlf');
        const input2 = fs.readFileSync('xlf2.xlf');

        const units = [...xlfHandler.createParser(input1).parse(), ...xlfHandler.createParser(input2).parse()];
        const json = jsonHandler.save(units, 'de');
        assert.strictEqual(json, expectedJson);
    });
});
