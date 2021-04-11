# xlf-merge
Command line tool that merges any number of XLF 1.2 files, JSON text dictionaries, and ARB text dictionaries.
Input and output is tested and compatible with Angular v10 and v11 compiler.

Designer for (but not limite to) Angular application. The NG compiler requires single dictionay per language. If your translations are organized into
many small files, you can run this tool to merge them before invoking Angular compilation.

## Installation
```bash
npm install xlf-merge --save-dev
```

## Usage
- Accespts any number of input files (wildcards supported)
- File format is detected by file extension
    - *.json - file treated as JSON text dictionary
    - *.abr - file treated as ARB text dictionary
    - *.xlf, *.xml - file treated as XLF 1.2
- Requires single output file path (--output parameter) to merge translated texts
```bash
# Merges three input files into output.xlf
xlf-merge input1.xlf input2.xlf input3.xlf --output all-translations.xlf

# Merges all language-specific XLF files in directory i18n into a file containing all translations per language
xlf-merge i18n/*.en.xlf -o all.en.xlf
xlf-merge i18n/*.de.xlf -o all.de.xlf
xlf-merge i18n/*.fr.xlf -o all.fr.xlf

# Merges also files in subdirectories
xlf-merge i18n/**/*.de.xlf -o all.de.xlf

# Merge all XLF files and JSON files, output in JSON format
xlf-merge i18n/**/*.de.xlf i18n/**/*.de.json -o all.de.json
```
- Supply the --convert <format> parameter to convert all found files
    - Each converted file is saved in the same path as its source file
    - Conversion is allowed with or without the --output parameter (which also merges all input files if supplied)

## Example setp
Supposing xlf files are in src/i18n and its subdirectories.
Add xlf-merge before production build of Angular application.
Modify npm scripts to automate the build task, for example:
```
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
