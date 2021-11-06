const fs = require('fs');
const path = require('path');

const stdout = process.stdout;
const stdin = process.stdin;

const pathProject = path.join(__dirname, './project-dist/');
const pathStyles = path.join(__dirname, './styles/');
const pathFileBundle = path.join(pathProject, 'bundle.css');

fs.createWriteStream(pathFileBundle);


function readFolderStyles() {
  fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      const fileExtname = path.extname(file.name);
      if (file.isFile() && fileExtname == '.css') {
        const filePath = path.join(pathStyles, file.name);
        const stream = fs.ReadStream(filePath, 'utf-8');
        stream.on('data', partData => writeFileBundle(partData));
      }
    });
  });
}
readFolderStyles()

function writeFileBundle(partData) {
  fs.appendFile(pathFileBundle, partData, err => {
    if (err) throw err;
  });
}



