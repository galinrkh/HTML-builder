const fs = require('fs');
const path = require('path');

const pathDir = path.join(__dirname, './files/');
const pathNewDir = path.join(__dirname, './files-copy/');

fs.stat(pathNewDir, (err, stats) => {
  if (err) {
    createFolder();
    clearFolder();
    copyFolder(pathDir, pathNewDir);
  } else {
    clearFolder();
    copyFolder(pathDir, pathNewDir);
  }
})

function createFolder() {
  fs.mkdir(pathNewDir, (err) => {
    if (err) {
      throw err;
    }
  });
}

function clearFolder() {
  fs.readdir(pathNewDir, (err, files) => {
    if (err) {
      throw err;
    }
    for (const file of files) {
      fs.unlink(path.join(pathNewDir, file), err => {
        if (err) {
          throw err;
        }
      });
    }
  });
}

function copyFolder(pathDir, pathNewDir) {
  fs.readdir(pathDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      throw err;
    }
    files.forEach(file => {
      if (file.isFile()) {
        let pathFrom = path.join(pathDir, file.name);
        let pathTo = path.join(pathNewDir, file.name);
        fs.copyFile(pathFrom, pathTo, (err) => {
          if (err) {
            throw err;
          }
        });
      }
    });
  });
}