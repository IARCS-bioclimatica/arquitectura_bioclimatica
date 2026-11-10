const fs = require('node:fs');
const path = require('node:path');

const pdfDirectory = path.join(__dirname, '..', 'PDF´S');
const outputFile = path.join(__dirname, '..', 'pdfs.json');

const pdfs = fs.readdirSync(pdfDirectory, { withFileTypes: true })
    .filter(entry => entry.isFile() && /\.pdf$/i.test(entry.name))
    .map(entry => `PDF´S/${entry.name}`)
    .sort((a, b) => a.localeCompare(b, 'es'));

fs.writeFileSync(outputFile, `${JSON.stringify(pdfs, null, 2)}\n`, 'utf8');
console.log(`Índice PDF generado con ${pdfs.length} documento(s).`);
