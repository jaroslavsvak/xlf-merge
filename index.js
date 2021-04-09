#!/usr/bin/env node

const process = require('process');
const program = require('commander');
const fs = require('fs');
const convert = require('xml-js');
const shell = require('shelljs');

const logger = require('./logger.js');
const mergeXlf = require('./merge-xlf');
const xlfHandler = require('./xlf-handler');

function runMerge(inputPaths, outputPath) {
    const inputFiles = (function*() { yield* shell.ls(inputPaths); })();
    const sourceFile = inputFiles.next().value;
    
    console.log('Initial file', sourceFile);
    let fileContent = fs.readFileSync(sourceFile).toString();
    let output = convert.xml2js(fileContent);
    
    for (let fileIter = inputFiles.next(); !fileIter.done; fileIter = inputFiles.next()) {
        fileContent = fs.readFileSync(fileIter.value).toString();
        output = mergeXlf(output, convert.xml2js(fileContent), fileIter.value);
    }
    
    const outXml = convert.js2xml(output);
    fs.writeFileSync(outputPath, outXml);
    logger.success('Generated output file ' + outputPath);
}

function readInputs(inputPaths) {
    const items = [];

    for (const fileName of shell.ls(inputPaths)) {
        let count = 0;
        const fileContent = fs.readFileSync(fileName).toString();

        for (const item of xlfHandler.readFile(fileContent)) {
            const duplicate = items.find(t => t.id === item.id);
            if (duplicate) {
                if (duplicate.text === item.text) {
                    logger.warn(`Duplicate ${item.id} found in files ${fileName} and ${duplicate.fileName}`);
                } else {
                    throw new Error(`Item ${item.id} found in files ${fileName} and ${duplicate.fileName} with different text`);
                }
            }

            items.push({ ...item, fileName });
            count++;
        }

        if (count) {
            logger.info(`Parsed file ${fileName}. found ${count} translations.`);
        } else {
            logger.warn(`Parsed file ${fileName}. No translations found.`);
        }
    }

    logger.info(`All input files parsed. Found ${items.length} translated items.`);
    return items;
}

function generateOutput(transItems) {
    return xlfHandler.writeFile(transItems);
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
        logger.success('xlf-merge generated output ' + outputPath);
    }
} catch (err) {
    logger.error('xlf-merge failed to generate output\n' + err.toString());
    process.exitCode = 1;
}
