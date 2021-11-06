const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach(file => {
    if (file.isFile()) {
      const fileName = path.parse(file.name).name;
      const fileExtname = path.extname(file.name);
      const fullPath = path.join(dirPath, file.name);
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          console.log('\nERROR\n');
          throw err;
        }
        const fileSize = (stats.size / 1024).toFixed(3)
        console.log(fileName + ' - ' + fileExtname.slice(1) + ' - ' + fileSize + 'kb');
      });
    }
  });
});


