module.exports.parse = function*(fileContent) {
    const data = JSON.parse(fileContent);

    if (!data.translations) {
        return;
    }

    for (const it of Object.entries(data.translations)) {
        const [id, text] = it;

        const transElement = {
            type: 'element',
            name: 'target',
            elements: [
                {
                    type: 'text',
                    text
                }
            ]
        };

        yield { id, text, transElement };
    }
};

module.exports.save = function(translatedEntries) {
    const data = {
        translations: {}
    };

    for (const entry of translatedEntries) {
        data.translations[entry.id] = entry.text;
    }

    return JSON.stringify(data);
};
