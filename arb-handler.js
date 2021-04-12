module.exports.createParser = function (fileContent) {
    const data = JSON.parse(fileContent);

    return {
        getLocale: () => data['@@locale'],
        parse: function* () {
            for (const entry of Object.entries(data)) {
                const [id, text] = entry;
                if (!id.startsWith('@')) {
                    yield { id, text };
                }
            }
        }
    };
}

module.exports.save = function (translatedEntries, locale) {
    const data = {
        '@@locale': locale || 'unknown'
    };

    for (const entry of translatedEntries) {
        data[entry.id] = entry.text;
    }

    return JSON.stringify(data);
};
