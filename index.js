#!/usr/bin/env node

const process = require('process');
const fs = require('fs');
const path = require('path');

const program = require('commander');
const shell = require('shelljs');

const logger = require('./logger.js');
const xlfHandler = require('./xlf-handler');
const jsonHandler = require('./json-handler');

function resolveHandler(fileName) {
    switch (path.extname(fileName.toLowerCase())) {
        case '.json':
            return jsonHandler;

        default:
            return xlfHandler;
    }
}

function parseFileContent(fileName, allItems) {
    const handler = resolveHandler(fileName);
    const fileContent = fs.readFileSync(fileName).toString();
    let count = 0;

    for (const item of handler.parse(fileContent)) {
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

    return count;
}

function readInputs(inputPaths) {
    const allItems = [];

    for (const fileName of shell.ls(inputPaths)) {
        try {
            const count = parseFileContent(fileName, allItems);
        } catch (err) {
            logger.error('Couldn\'t parse file ' + fileName);
            throw err;
        }
    }

    logger.info(`All input files parsed. Found ${allItems.length} translated items.`);
    return allItems;
}

program
    .version('2.0.0')
    .usage('[options] <input files or pattern such as *.xlf, *.json ...>')
    .requiredOption('-o --output <output>', 'Output file name')
    .option('-q --quiet', 'Quiet mode. Doesn\'t show warnings and info messages.')
    .parse(process.argv);

if (program.args === 0) {
    program.help();
}

const options = program.opts();
if (options.quiet) {
    logger.quietMode = true;
}

let transItems = null;
try {
    transItems = readInputs(program.args);
} catch (err) {
    logger.error('xlf-merge failed while parsing input files\n' + err.toString());
    process.exitCode = 1;
}

try {
    if (transItems) {
        const outputPath = options.output;
        const handler = resolveHandler(outputPath);
        const output = handler.save(transItems);

        fs.writeFileSync(outputPath, output);
        logger.success('xlf-merge generated output file ' + outputPath);
    }
} catch (err) {
    logger.error('xlf-merge failed to generate output file\n' + err.toString());
    process.exitCode = 1;
}
