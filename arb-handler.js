module.exports.parse = function*(fileContent) {
    const data = JSON.parse(fileContent);

    for (const entry of Object.entries(data)) {
        const [id, text] = entry;
        if (!id.startsWith('@')) {
            yield { id, text };
        }
    }
};

module.exports.save = function(translatedEntries) {
    const data = {};

    for (const entry of translatedEntries) {
        data[entry.id] = entry.text;
    }

    return JSON.stringify(data);
};
