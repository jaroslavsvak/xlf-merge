# xlf-merge
Command line tool that merges any number of XLF 1.2 files.

Useful for Angular apps where the NG compiler requires single translation file per language. If your translations are orginized into
many small XLF files you can run this tool to merge them before invoking Angular compilation.

## Installation
```bash
npm install -g xlf-merge
```

## Usage
- Accespts any number of input files (wildcards supported)
- Requires single output file path (-o parameter)
```bash
# Merges three input files into output.xlf
xlf-merge input1.xlf input2.xlf input3.xlf -o output.xlf

# Merges all language-specific XLF files in directory i18n into a file containing all translations per language
xlf-merge i18n/*.en.xlf -o all.en.xlf
xlf-merge i18n/*.de.xlf -o all.de.xlf
xlf-merge i18n/*.fr.xlf -o all.fr.xlf
```

## Author
Jaroslav Svak

## License
MIT
