module.exports.parse = function*(fileContent) {
    const data = JSON.parse(fileContent);

    if (!data.translations) {
        return;
    }

    for (const it of Object.entries(data)) {
        const [key, text] = it;
        yield { id, text, transElement: null };
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
