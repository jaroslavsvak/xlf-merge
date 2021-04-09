const xmlJs = require('xml-js');

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
    if (!src || !src.elements) {
        return '';
    }

    return xmlJs.js2xml(src);
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

module.exports.readFile = function*(fileContent) {
    const xml = xmlJs.xml2js(fileContent);
    const root = getElement(xml, ['xliff', 'file', 'body']);

    for (const transUnit of getTransUnits(root)) {
        const id = transUnit.attributes.id;
        const transElement = getElement(transUnit, ['target']);
        const text = convertToPlainText(transElement);

        yield { id, transElement, text };
    }
};

module.exports.writeFile = function(translatedEntries) {
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
                                    elements: [e.transElement]
                                }))
                            }
                        ]
                    }
                ]
            }
        ]
    };

    return xmlJs.js2xml(xml);
}
