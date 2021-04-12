module.exports.createParser = function (fileContent) {
    const data = JSON.parse(fileContent);

    return {
        getLocale: () => data.locale,
        parse: function* () {
            if (!data.translations) {
                return;
            }
        
            for (const entry of Object.entries(data.translations)) {
                const [id, text] = entry;
                yield { id, text };
            }
        }
    };
}

module.exports.save = function (translatedEntries, locale) {
    const data = {
        locale: locale || 'unknown',
        translations: {}
    };

    for (const entry of translatedEntries) {
        data.translations[entry.id] = entry.text;
    }

    return JSON.stringify(data);
};
