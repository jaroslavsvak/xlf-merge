#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const convert = require('xml-js');
const shell = require('shelljs');
const mergeXlf = require('./merge-xlf');

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
    console.log('Generated output file', outputPath);
}

//runMerge(['data/test3/generic.xlf', 'data/test3/home-page.xlf', 'data/test3/lesson.xlf'], 'data/test3/out.xlf');
//return;

program
    .version('1.0.7')
    .usage('[options] <input files or pattern such as *.xlf ...>')
    .option('-o, --output <output>', 'Output file name')
    .parse(process.argv);

if (program.args === 0 || !program.output) {
    program.help();
}

try {
    runMerge(program.args, program.output);
}
catch (err) {
    console.error(err);
}
