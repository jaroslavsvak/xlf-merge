#!/usr/bin/env node

const process = require('process');
const fs = require('fs');
const path = require('path');

const program = require('commander');
const shell = require('shelljs');

const logger = require('./logger.js');
const xlfHandler = require('./xlf-handler');
const jsonHandler = require('./json-handler');
const arbHandler = require('./arb-handler');

function resolveHandler(fileName) {
    switch (path.extname(fileName.toLowerCase())) {
        case '.json':
            return jsonHandler;

        case '.arb':
            return arbHandler;

        default:
            return xlfHandler;
    }
}

function parseFileContent(fileName, allItems) {
    const handler = resolveHandler(fileName);
    const fileContent = fs.readFileSync(fileName).toString();
    const parser = handler.createParser(fileContent);

    let count = 0;

    for (const item of parser.parse(fileContent)) {
        const duplicate = allItems.find(t => t.id === item.id);
        if (duplicate) {
            if (duplicate.text === item.text) {
                logger.warn(`Duplicate ${item.id} found in files ${fileName} and ${duplicate.fileName}`);
            } else {
                throw new Error(
                    `Item with ID ${item.id} found in files ${fileName} and ${duplicate.fileName}. Both instances contain different text.`
                );
            }
        }

        allItems.push({ ...item, fileName });
        count++;
    }

    if (count) {
        logger.info(`Parsed ${count} translations in file ${fileName}`);
    } else {
        logger.warn(`Parsed file ${fileName}. No translations found.`);
    }

    return parser.getLocale();
}

function readInputs(inputPaths, operation) {
    for (const fileName of shell.ls(inputPaths)) {
        try {
            operation(fileName);
        } catch (err) {
            logger.error('Couldn\'t parse file ' + fileName);
            throw err;
        }
    }
}

function convertTranslationFiles(inputPaths, outputFormat) {
    let counter = 0;

    readInputs(
        inputPaths,
        fileName => {
            const transItems = [];
            const locale = parseFileContent(fileName, transItems);

            if (transItems.length) {
                const baseName = path.basename(fileName, path.extname(fileName));
                const newExt = '.' + outputFormat;
                const outputPath = path.join(path.dirname(fileName), baseName + newExt);

                const convertedContent = resolveHandler(outputPath).save(transItems, locale);
                fs.writeFileSync(outputPath, convertedContent);

                logger.info(`Converted file ${fileName} into ${outputPath}`);
            }
        }
    );

    logger.success(`xlf-merge converted all ${counter} input files`);
}

function mergeTranslationFiles(inputPaths, outputPath) {
    const transItems = [];
    let locale = null;

    readInputs(inputPaths, fileName => {
        let fileLocale = parseFileContent(fileName, transItems);
        if (locale && fileLocale && locale !== fileLocale) {
            throw new Error(`Locales among input file don't match. File ${fileName} has locale ${fileLocale}, expected ${locale}.`);
        }

        locale = fileLocale;
    });

    logger.info(`All input files parsed. Found ${transItems.length} translated texts.`);
    
    if (transItems.length) {
        const handler = resolveHandler(outputPath);
        const output = handler.save(transItems, locale);

        fs.writeFileSync(outputPath, output);
        logger.success('xlf-merge generated output file ' + outputPath);
    }
}

program
    .name('xlf-merge')
    .version('2.0.0')
    .addHelpText(
        'before',
        'Xlf-merge 2.0.0\n' +
        'Merges and/or converts translation dictionary files. Supports XLF 1.2, JSON, and ARB.\n' +
        'Generate single translation dictionary required by Angular compiler from multiple input files.\n'
    )
    .usage('[options] <input files or pattern such as *.xlf, *.json ...>')
    .option('-o --output <output>', 'Output file name')
    .addOption(new program.Option('-c --convert <format>', 'Converts all input files in place').choices(['xlf', 'json', 'arb']))
    .option('-q --quiet', 'Quiet mode. Doesn\'t show warnings and info messages.')
    .addHelpText('after', '\nEither --output or --convert option is required')
    .parse(process.argv);

const options = program.opts();
if (program.args === 0 || (!options.output && !options.convert)) {
    program.help();
}

if (options.quiet) {
    logger.quietMode = true;
}

try {
    if (options.convert) {
        convertTranslationFiles(program.args, options.convert);
    }

    if (options.output) {
        mergeTranslationFiles(program.args, options.output);
    }
} catch (err) {
    logger.error('xlf-merge failed\n' + err.toString());
    process.exitCode = 1;
}
