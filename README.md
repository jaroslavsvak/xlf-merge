# xlf-merge
Command line tool to merge multiple XLF files into one.
Useful for Angular compiler which requires single transation file per language.

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

# Merges all language-specific XLF files in directory i18n into a file with all translations per language
xlf-merge i18n/*.en.xlf -o all.en.xlf
xlf-merge i18n/*.de.xlf -o all.de.xlf
xlf-merge i18n/*.fr.xlf -o all.fr.xlf
```

## Author
Jaroslav Svak

## License
MIT
