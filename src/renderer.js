const utils = require('./components/utils.js');
const pages = require('./components/pages.js');
const {Sketch} = require('./components/sketch.js');
const {exportPDF} = require('./components/exportpdf.js');
const { remote, globalShortcut } = require('electron');
const {dialog} = remote;
const fs = require('fs');

// initialize notebook with empty page filling available width
var page = pages.newPage();
const notebook = document.getElementById('notebook');
notebook.appendChild(page);
let s = Sketch();
s.setFocusPage(page);
refreshPageLabel();
fit_width();
var notebook_file = null;

utils.pointerEventListener('down', page, s.start);
utils.pointerEventListener('move', document, s.move);
utils.pointerEventListener('up leave', document, s.end);

document.getElementById('eraser').onclick = ev => {
  s.setMode('eraser');
  notebook.classList.add('eraser-cursor');
}
document.getElementById('pen').onclick = ev => {
  s.setMode('pen');
  s.setSize(1.0);
  s.setColor("var(--pen-color-blue)");
  notebook.classList.remove('eraser-cursor');
}
document.getElementById('highlighter').onclick = ev => {
  s.setMode('highlighter');
  s.setColor("var(--pen-color-orange)");
  notebook.classList.remove('eraser-cursor');
}

//

document.getElementById('thin').onclick = ev => {
  s.setSize(1.0);
}
document.getElementById('medium').onclick = ev => {
  s.setSize(2.0);
}
document.getElementById('thick').onclick = ev => {
  s.setSize(3.0);
}

document.getElementById('yellow').onclick = ev => {
  s.setColor("var(--pen-color-yellow)");
}
document.getElementById('orange').onclick = ev => {
  s.setColor("var(--pen-color-orange)");
}
document.getElementById('green').onclick = ev => {
  s.setColor("var(--pen-color-green)");
}
document.getElementById('cyan').onclick = ev => {
  s.setColor("var(--pen-color-cyan)");
}
document.getElementById('red').onclick = ev => {
  s.setColor("var(--pen-color-red)");
}
document.getElementById('blue').onclick = ev => {
  s.setColor("var(--pen-color-blue)");
}
document.getElementById('black').onclick = ev => {
  s.setColor("black");
}

document.getElementById('open').onclick = ev => {
  opts = {title: 'Open notebook', properties: ['openFile'], filters: [{name: 'Notebooks', extensions: ['svgnb']}]};
  let fname = dialog.showOpenDialogSync(remote.getCurrentWindow(), opts);
  if (!fname || !fname[0]) {return;}
  notebook_file = fname[0];

  fs.readFile(notebook_file, (err, data) => {
    if (err) {
      alert('File could not be read');
    }
    notebook.innerHTML = data;
    pages.refreshPagesDatabaseFromNotebook(notebook);
    s.setFocusPage(notebook.children[0]);
    refreshPageLabel();
    fit_width();
  });
  document.title = notebook_file;
}

function save_notebook() {
  fs.writeFile(fname, notebook.innerHTML, (err) => {
    if (err) {
      alert('File could not be saved');
    }
  });
}

document.getElementById('save').onclick = ev => {
  opts = {title: 'Save notebook', filters: [{name: 'Notebooks', extensions: ['svgnb']}]};
  let fname = dialog.showSaveDialogSync(remote.getCurrentWindow(), opts);
  if (!fname) {return;}

  if (fname.substring(fname.length-6) != '.svgnb') {
    notebook_file = fname + '.svgnb';
  }
  document.title = notebook_file;  
  save_notebook();
}

document.getElementById('export-pdf').onclick = ev => {
  opts = {title: 'Export notebook to pdf', filters: [{name: 'Documents', extensions: ['pdf']}]};
  let fname = dialog.showSaveDialogSync(remote.getCurrentWindow(), opts);
  if (!fname) {return;}

  if (fname.substring(fname.length-4) != '.pdf') {
    fname = fname + '.pdf';
  }
  exportPDF(notebook, fname);
}

document.getElementById('zoom_in').onclick = ev => {
  pages.zoomPages('+');
}
document.getElementById('zoom_out').onclick = ev => {
  pages.zoomPages('-');
}



function fit_width() {
  const css = getComputedStyle(notebook);
  let w = notebook.offsetWidth -
    utils.px2int(css.paddingLeft) - utils.px2int(css.paddingRight)*2;
  pages.rescalePages(w);
}
document.getElementById('fit-width').onclick = ev => {
  fit_width();
}


function refreshPageLabel() {
  document.getElementById('page-label').textContent =
    'Page ' + s.getFocusPage() + '/' + notebook.children.length;
}

notebook.onclick = ev => {
  refreshPageLabel();
}

function appendAtIndex(parent, child, index) {
  if (!index) index = 0
  if (index >= parent.children.length) {
    parent.appendChild(child)
  } else {
    parent.insertBefore(child, parent.children[index])
  }
}

document.getElementById('new-page').onclick = ev => {
  let idx = s.getFocusPage()-1;
  let _new = pages.newPage();
  appendAtIndex(notebook, _new, idx+1);

  var i;
  for (i=1;i<=notebook.children.length;i++) {
    notebook.children[i-1].id = 'page ' + i;
  }

  s.setFocusPage(_new);
  refreshPageLabel();
}

document.getElementById('del-page').onclick = ev => {
  let idx = s.getFocusPage()-1;
  notebook.removeChild(notebook.children[idx]);
  if (idx==0) {
    notebook.appendChild(pages.newPage());
  }

  var i;
  for (i=1;i<=notebook.children.length;i++) {
    notebook.children[i-1].id = 'page ' + i;
  }

  s.setFocusPage(notebook.children[(idx>0) ? idx-1 : 0]);
  refreshPageLabel();
}
