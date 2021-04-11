module.exports.parse = function* (fileContent) {
    const data = JSON.parse(fileContent);

    if (!data.translations) {
        return;
    }

    for (const entry of Object.entries(data.translations)) {
        const [id, text] = entry;
        yield { id, text };
    }
};

module.exports.save = function (translatedEntries) {
    const data = {
        locale: '',
        translations: {}
    };

    for (const entry of translatedEntries) {
        data.translations[entry.id] = entry.text;
    }

    return JSON.stringify(data);
};
