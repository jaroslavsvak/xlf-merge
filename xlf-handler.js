const xmlJs = require('xml-js');
const logger = require('./logger');

function getElement(src, path) {
    let result = src;

    for (const pnode of path) {
        if (!result.elements) {
            return null;
        }

        result = result.elements.find(e => e.name === pnode);
        if (!result) {
            return null;
        }
    }

    return result;
}

function convertToPlainText(src) {
    let result = '';
    if (!src || !src.elements) {
        return result;
    }

    for (const el of src.elements) {
        switch (el.type) {
            case 'text':
                result += el.text;
                break;
            
            case 'element':
                if (el.name === 'x') {
                    result += '${' + el.attributes.id + '}';
                }

                break;
        }
    }

    const leftTrimmed = result.trimStart();
    if (leftTrimmed.length !== result.length) {
        result = ' ' + leftTrimmed;
    }

    const rightTrimmed = result.trimEnd();
    if (rightTrimmed.length !== result.length) {
        result = rightTrimmed + ' ';
    }

    return result;
}

function convertToXml(entry) {
    if (entry.transElement) {
        return entry.transElement;
    }

    const result = [];

    let start = 0;
    let len = entry.text.length;

    result.push({ type: 'text', text: entry.text.substr(start, len) });

    return result;
}

function* getTransUnits(root) {
    if (!root.elements) {
        return;
    }

    for (const el of root.elements) {
        if (el.name === 'trans-unit') {
            yield el;
        }
    }
}

module.exports.parse = function*(fileContent) {
    const xml = xmlJs.xml2js(fileContent);
    const root = getElement(xml, ['xliff', 'file', 'body']);

    for (const transUnit of getTransUnits(root)) {
        const id = transUnit.attributes.id;
        const transElement = getElement(transUnit, ['target']);
        const text = convertToPlainText(transElement);

        yield { id, transElement, text };
    }
};

module.exports.save = function(translatedEntries) {
    const xml = {
        declaration: {
            attributes: {
                version: '1.0',
                encoding: 'utf-8'
            }
        },
        elements: [
            {
                type: 'element',
                name: 'xliff',
                attributes: {
                    version: '1.2',
                    xmlns: 'urn:oasis:names:tc:xliff:document:1.2',
                    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    'xsi:schemaLocation': 'urn:oasis:names:tc:xliff:document:1.2 xliff-core-1.2-strict.xsd'
                },
                elements: [
                    {
                        type: 'element',
                        name: 'file',
                        elements: [
                            {
                                type: 'element',
                                name: 'body',
                                elements: translatedEntries.map(e => ({
                                    type: 'element',
                                    name: 'trans-unit',
                                    attributes: { id: e.id },
                                    elements: [convertToXml(e)]
                                }))
                            }
                        ]
                    }
                ]
            }
        ]
    };

    return xmlJs.js2xml(xml);
};
