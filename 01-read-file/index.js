const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const stream = fs.ReadStream(filePath, 'utf-8');
const stdout = process.stdout;
stream.on('data', partData => stdout.write(partData));