module.exports = function(first, second, fileName) {
    function fail(message) {
        throw new Error(message + ' File name: ' + fileName + '.');
    }

    function getElement(src, path) {
        let result = src;
        let breadcrumbs = '';
    
        for (const pnode of path) {
            breadcrumbs += '/' + pnode;
    
            if (!result.elements) {
                fail(breadcrumbs + ' - expected element ' + pnode + ' not found. Make sure that the XLF file schema is correct.');
            }
    
            result = result.elements.find(e => e.name === pnode);
            if (!result) {
                fail('Element ' + breadcrumbs + ' not found. Make sure that the XLF file schema is correct.');
            }
        }
    
        return result;
    }
    
    function getContent(src) {
        const result = src.elements.find(e => e.type === 'text');
        if (!result) {
            fail('No text content at ' + src + '.');
        }
    
        return result.text;
    }
    
    function* getTransUnits(root) {
        if (!root.elements) {
            fail('No trans-units found.');
        }
    
        for (const el of root.elements) {
            if (el.name === 'trans-unit') {
                yield el;
            }
        }
    }

    const transPath = ['xliff', 'file', 'body'];
    const srcRoot = getElement(first, transPath);
    const tgtRoot = getElement(second, transPath);
    const tgtTransUnits = [...getTransUnits(tgtRoot)];
    let numMergedTransUnits = 0;

    function findTgtById(id) {
        return tgtTransUnits.find(t => t.attributes && t.attributes.id === id);
    }

    for (const srcTransUnit of getTransUnits(srcRoot)) {
        const id = srcTransUnit.attributes.id;
        const content = getContent(getElement(srcTransUnit, ['target']));

        const matchingTgt = findTgtById(id);
        if (matchingTgt) {
            const tgtContent = getContent(getElement(matchingTgt, ['target']));
            if (content !== tgtContent) {
                console.log('trans-unit', id);
                console.log('already present content:', content);
                console.log('differs in file', fileName, ':', tgtContent);
                fail('Translations mismatch at trans-unit ID: ' + id + '.');
            }
        } else {
            tgtRoot.elements.push(srcTransUnit);
            numMergedTransUnits++;
        }
    }

    console.log(fileName, ' -> ', numMergedTransUnits, 'translations merged');
    return second;
}
