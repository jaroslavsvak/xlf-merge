const assert = require('assert');
const fs = require('fs');

const xlfHandler = require('../xlf-handler');

describe('XlfHandler', () => {
    const input1 = fs.readFileSync('xlf1.xlf');
    const input2 = fs.readFileSync('xlf2.xlf');

    it('Parses input 1', () => {
        const units = [...xlfHandler.parse(input1)];
        assert.strictEqual(units.length, 3);
        assert.strictEqual(units[0].text, 'Content');
        assert.strictEqual(units[2].text, ' whitespace test ');
    });

    it('Parses input 2', () => {
        const units = [...xlfHandler.parse(input2)];
        assert.strictEqual(units.length, 2);
        assert.strictEqual(units[0].text, 'Testing ${INTERPOLATION} interpolation');
    });

    it('Converts text', () => {
        const data = [
            {
                id: 'SimpleContent',
                transElement: null,
                text: 'Text content 1'
            },
            {
                id: 'Interpolation',
                transElement: null,
                text: 'Testing ${INTERPOLATION} interpolation'
            },
            {
                id: 'Link',
                transElement: null,
                text: 'Testing ${START_LINK}Link${CLOSE_LINK}. More text.'
            },
            {
                id: 'StartLink',
                transElement: null,
                text: '${START_LINK}Link${CLOSE_LINK}. More text.'
            },
            {
                id: 'EndLink',
                transElement: null,
                text: 'Testing ${START_LINK}Link${CLOSE_LINK}'
            },
            {
                id: 'MultiLink',
                transElement: null,
                text: 'Testing ${START_LINK}Link${CLOSE_LINK}${START_LINK}Link2${CLOSE_LINK}, more...'
            }
        ];

        const xml = xlfHandler.save(data);
        const expectedXml = fs.readFileSync('xlf-hander-save1.expected.xml', { encoding: 'utf-8' });
        assert.strictEqual(xml, expectedXml);
    });
});
