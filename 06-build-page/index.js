const fs = require('fs');
const path = require('path');

const pathNewDirProject = path.join(__dirname, 'project-dist');
const pathDirAssets = path.join(__dirname, 'assets');
const pathNewDirAssets = path.join(pathNewDirProject, 'assets');
const pathFileIndexHtml = path.join(pathNewDirProject, 'index.html');
const pathFileStyleCss = path.join(pathNewDirProject, 'style.css');
const pathDirStyles = path.join(__dirname, 'styles');
const pathDirComponents = path.join(__dirname, 'components');
const pathTemplate = path.join(__dirname, 'template.html');

// проверяяем есть ли директория project-dist
fs.stat(pathNewDirProject, (err, stats) => {
  if (err) {
    createDirProject();
  } else {
    deleteDirProject();
  }
});

// удаляем директорию project-dist и создаем снова
function deleteDirProject() {
  fs.rm(pathNewDirProject, { recursive: true }, (err) => {
    if (err) throw err;
    createDirProject();
  });
}

// создаем директорию project-dist
function createDirProject() {
  fs.mkdir(pathNewDirProject, (err) => {
    if (err) throw err;
    createFilesProject();
  });
}

// создаем файлы index.html и style.css в директории project-dist
function createFilesProject() {
  fs.createWriteStream(pathFileIndexHtml);
  fs.createWriteStream(pathFileStyleCss);
  readDirStyles();
  writeFileIndexHtml();
  copyDirAssets(pathDirAssets, pathNewDirAssets);
}

// копирование папок и файлов assets в директорию project-dist
function copyDirAssets(from, to) {
  fs.mkdir(to, (err) => {
    if (err) throw err;
    fs.readdir(from, (err, files) => {
      if (err) throw err;
      files.forEach(element => {
        const pathFrom = path.join(from, element);
        const pathTo = path.join(to, element);
        fs.stat(pathFrom, (err, stats) => {
          if (err) throw err;
          if (stats.isFile()) {
            fs.copyFile(pathFrom, pathTo, (err) => {
              if (err) throw err;
            });
          } else {
            copyDirAssets(pathFrom, pathTo);
          }
        })
      });
    });
  });
}

// мержим стили в style.css
function readDirStyles() {
  fs.readdir(pathDirStyles, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      const fileExtname = path.extname(file.name);
      if (file.isFile() && fileExtname == '.css') {
        const filePath = path.join(pathDirStyles, file.name);
        const stream = fs.ReadStream(filePath, 'utf-8');
        stream.on('data', partData => writeFile(partData, pathFileStyleCss));
      }
    });
  });
}

function writeFile(data, pathFile) {
  fs.appendFile(pathFile, data, err => {
    if (err) throw err;
  });
}

// копирование template.html в index.html
function writeFileIndexHtml() {
  const streamTemplate = fs.ReadStream(pathTemplate, 'utf-8');
  streamTemplate.on('data', partData => writeFile(partData, pathFileIndexHtml));
  setTimeout(() => mergeHtmlFiles(), 100);
}

// сборка index.html из директории components
function mergeHtmlFiles() {
  const streamIndex = fs.ReadStream(pathFileIndexHtml, 'utf-8');
  streamIndex.on('data', contentIndex => readDirComponents(contentIndex));
}

function readDirComponents(contentIndex) {
  fs.readdir(pathDirComponents, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      const fileExtname = path.extname(file.name);
      const fileName = path.parse(file.name).name;
      if (file.isFile() && fileExtname == '.html') {
        const filePath = path.join(pathDirComponents, file.name);
        const content = fs.ReadStream(filePath, 'utf-8');
        content.on('data', content => {
          contentIndex = contentIndex.replace(new RegExp(`{{${fileName}}}`), content);
          setTimeout(() =>
            fs.writeFile(pathFileIndexHtml, contentIndex, (err) => {
              if (err) throw err;
            })
          );
        });
      }
    });
  });
}