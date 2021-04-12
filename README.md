# xlf-merge
Command line tool that merges any number of XLF 1.2 files, JSON text dictionaries, and ARB text dictionaries.
Input and output is tested and compatible with Angular compiler.

Designed for (but not limited to) Angular-based applications to simplify their i18n process.
The NG compiler requires a single dictionay file per language. If your translations are organized into
many small files, you can run this tool to merge them before invoking the Angular compilation.

## Installation
```bash
# Install globally (run by xlf-merge <parameters>)
npm install xlf-merge -g

# Install locally as development tool (run by node ./node_modules/xlf-merge <parameters>)
npm install xlf-merge --save-dev
```

## Usage
- Accepts any number of input files (wildcards supported)
- File format is detected by file extension
    - *.xlf, *.xml - file treated as XLF 1.2
    - *.json - file treated as JSON text dictionary
    - *.abr - file treated as ARB text dictionary    
- Requires single output file path (--output parameter) to merge translated texts
```bash
# Merges three input files into output.xlf
xlf-merge input1.xlf input2.xlf input3.xlf --output all-translations.xlf

# Merges all language-specific XLF files in directory i18n into a file containing all translations per language
xlf-merge i18n/*.en.xlf -o all.en.xlf
xlf-merge i18n/*.de.xlf -o all.de.xlf
xlf-merge i18n/*.fr.xlf -o all.fr.xlf

# Merges *.de.xlf files recursively in the current path
xlf-merge **/*.de.xlf -o all.de.xlf

# Merges all XLF and JSON files with patterns *.de.xlf and *.de.json. Merged file has JSON format.
xlf-merge i18n/**/*.de.xlf i18n/**/*.de.json --output all.de.json
```
- Supply the --convert <format> parameter to convert all found files
    - Each converted file is saved in the same path as its source file
    - Conversion is allowed with or without the --output parameter (which also merges all input files)
```bash
# Converts all XLF files in current directory into JSON format
xlf-merge *.xlf --convert json

# Recursively converts all XLF files into ARB format
xlf-merge **/*.xlf --convert arb
```

## Example set-up
Supposing XLF files are in path src/i18n/**.
German translations have pattern *.de.xlf, Swedish translations have pattern *.sv.xlf.
- Install Xlf-merge locally by running "npm install --save-dev xlf-merge"
- Run xlf-merge before production build of Angular application
- Write npm scripts to automate the entire build task, for example:
```json
"scripts": {
    "merge-de": "node ./node_modules/xlf-merge src/i18n/**/*.de.xlf",
    "merge-sv": "node ./node_modules/xlf-merge src/i18n/**/*.sv.xlf",
    "merge-all": "npm run merge-de && npm run merge-sv",
    "build": "npm run merge-all && ng build --prod"
}
```

## Author
Jaroslav Svak, 2018 - 2021

## License
MIT
