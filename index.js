#!/usr/bin/env node

const process = require('process');
const program = require('commander');
const fs = require('fs');
const shell = require('shelljs');

const logger = require('./logger.js');
const xlfHandler = require('./xlf-handler');

function parseFileContent(fileName, allItems) {
    const fileContent = fs.readFileSync(fileName).toString();
    let count = 0;

    for (const item of xlfHandler.parse(fileContent)) {
        const duplicate = allItems.find(t => t.id === item.id);
        if (duplicate) {
            if (duplicate.text === item.text) {
                logger.warn(`Duplicate ${item.id} found in files ${fileName} and ${duplicate.fileName}`);
            } else {
                throw new Error(`Item ${item.id} found in files ${fileName} and ${duplicate.fileName}. Both instances contain different text.`);
            }
        }

        allItems.push({ ...item, fileName });
        count++;
    }

    if (count) {
        logger.info(`Parsed file ${fileName}. Found ${count} translations.`);
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

function generateOutput(transItems) {
    return xlfHandler.save(transItems);
}

program
    .version('2.0.0')
    .usage('[options] <input files or pattern such as *.xlf ...>')
    .requiredOption('-o --output <output>', 'Output file name')
    .parse(process.argv);

if (program.args === 0) {
    program.help();
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
        const output = generateOutput(transItems);

        const outputPath = program.opts().output;
        fs.writeFileSync(outputPath, output);
        logger.success('xlf-merge generated output file ' + outputPath);
    }
} catch (err) {
    logger.error('xlf-merge failed to generate output file\n' + err.toString());
    process.exitCode = 1;
}
