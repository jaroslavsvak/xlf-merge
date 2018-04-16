const program = require('commander');
const fs = require('fs');
const convert = require('xml-js');
const mt = require('./merge');

program
    .version('1.0.0')
    .option('-d, --inDir <inDir>', 'Input path (all *.xlf files in the path will be merged)')
    .option('-o, --out <out>', 'Output file name')
    .parse(process.argv);

if (!program.inDir || !program.out) {
    program.help();
}

const allFiles = fs.readdirSync(program.inDir).filter(name => name.endsWith('.xlf'));
if (allFiles.length < 2) {
    throw new Error('At least two input files are required. Make sure that they are in the input path ' + program.inDir + '.');
}

console.log('Reading source file', allFiles[0]);
let fileContent = fs.readFileSync(allFiles[0]).toString();
let output = convert.xml2js(fileContent);

for (let i = 1; i < allFiles.length; i++) {
    const fileName = allFiles[i];
    console.log('Merging', fileName);

    fileContent = fs.readFileSync(allFiles[i]).toString();
    output = mt.merge(output, convert.xml2js(fileContent));
}

const outXml = convert.js2xml(output);
fs.writeFileSync(program.out, outXml);
console.log('Generated output file', program.out);
