const fs = require('fs');
const path = require('path');

const stdout = process.stdout;
const stdin = process.stdin;
const pathFile = path.join(__dirname, 'data.txt');

fs.createWriteStream(pathFile);

stdout.write('Please, enter text:\n');
stdin.on('data', (data) => {
  if (data.toString().trim().toLowerCase() == 'exit') {
    processExit();
  }
  fs.appendFile(pathFile, data, err => {
    if (err) {
      console.log('\nERROR\n');
      throw err;
    }
  });
});

process.on("SIGINT", function () {
  processExit();
});

function processExit() {
  stdout.write('Goodbye my friend!');
  process.exit();
}