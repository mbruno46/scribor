const utils = require('./components/utils.js');
const pages = require('./components/pages.js');
const {Sketch} = require('./components/sketch.js');
const {exportPDF} = require('./components/exportpdf.js');
const { remote, globalShortcut } = require('electron');
const {dialog} = remote;
const fs = require('fs');
const history = require('./components/history.js');

// initialize notebook with cover page filling available width
var page = pages.newPage(true);
const notebook = document.getElementById('notebook');
notebook.appendChild(page);
let s = Sketch();
s.setFocusPage(page);
refreshPageLabel();
fit_width();
s.setMode('pen');
setActiveBtnGroup(document.getElementById('pen').parentElement);
var notebook_file = null;

history.reset(notebook);
history.recordState();

utils.pointerEventListener('down', page, s.start);
utils.pointerEventListener('move', document, s.move);
utils.pointerEventListener('up leave', document, s.end);

function setActiveBtnGroup(g) {
  var el = document.getElementsByClassName('btn-group-active');
  if (el && el[0]) {
    el[0].classList.remove('btn-group-active');
  }
  g.classList.add('btn-group-active');
}

document.getElementById('eraser').onclick = ev => {
  s.setMode('eraser');
  notebook.classList.add('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('select').onclick = ev => {
  s.setMode('select');
  s.resetSelection();
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('pen').onclick = ev => {
  s.setMode('pen');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('highlighter').onclick = ev => {
  s.setMode('highlighter');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
notebook.oncontextmenu = ev => {
  // right click
  if (event.which != 3) {
    return true;
  }
  // prevents drawing on the page;
  ev.stopPropagation();
  console.log(event.which);
  if (s.getMode() == 'pen') {
    s.setMode('eraser');
    notebook.classList.add('eraser-cursor');
    setActiveBtnGroup(document.getElementById('eraser').parentElement);
  }
  else {
    s.setMode('pen');
    notebook.classList.remove('eraser-cursor');
    setActiveBtnGroup(document.getElementById('pen').parentElement);
  }
};
//

document.getElementById('thin').onclick = ev => {
  s.setSize(1.0);
  s.setMode('pen');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('medium').onclick = ev => {
  s.setSize(2.0);
  s.setMode('pen');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('thick').onclick = ev => {
  s.setSize(3.0);
  s.setMode('pen');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}

document.getElementById('red').onclick = ev => {
  s.setColor("var(--pen-color-red)");
  s.setMode('pen');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('blue').onclick = ev => {
  s.setColor("var(--pen-color-blue)");
  s.setMode('pen');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('black').onclick = ev => {
  s.setColor("black");
  s.setMode('pen');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}


document.getElementById('yellow').onclick = ev => {
  s.setColor("var(--pen-color-yellow)",1);
  s.setMode('highlighter');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('orange').onclick = ev => {
  s.setColor("var(--pen-color-orange)",1);
  s.setMode('highlighter');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('green').onclick = ev => {
  s.setColor("var(--pen-color-green)",1);
  s.setMode('highlighter');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('cyan').onclick = ev => {
  s.setColor("var(--pen-color-cyan)",1);
  s.setMode('highlighter');
  notebook.classList.remove('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
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

    history.reset(notebook);
    history.recordState();
  });
  document.title = 'SCRIBOR: ' + notebook_file;
}

function save_notebook(fname) {
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

  notebook_file = fname;
  notebook_file += (fname.substring(fname.length-6) != '.svgnb') ? '.svgnb' : '';
  document.title = 'SCRIBOR: ' + notebook_file;
  save_notebook(notebook_file);
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
document.getElementById('fit-height').onclick = ev => {
  const css = getComputedStyle(notebook);
  let h = notebook.offsetHeight -
    utils.px2int(css.paddingTop) - utils.px2int(css.paddingBottom);
  pages.rescalePages(pages.getAspectRatio() * h);
}
document.getElementById('real-width').onclick = ev => {
  pages.rescalePages(pages.getRealWidth());
}

function refreshPageLabel() {
  let idx = s.getFocusPage();
  let msg = (idx==0) ? 'cover' : 'Page ' + idx + '/' + (notebook.children.length-1);
  document.getElementById('page-label').textContent = msg;
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
  let idx = s.getFocusPage();
  let _new = pages.newPage();
  appendAtIndex(notebook, _new, idx+1);

  var i;
  for (i=0;i<notebook.children.length;i++) {
    notebook.children[i].id = 'page ' + i;
  }

  s.setFocusPage(_new);
  refreshPageLabel();
}

document.getElementById('del-page').onclick = ev => {
  let idx = s.getFocusPage();
  if (idx==0) {
    return;
  }
  notebook.removeChild(notebook.children[idx]);
  var i;
  for (i=0;i<notebook.children.length;i++) {
    notebook.children[i].id = 'page ' + i;
  }

  s.setFocusPage(notebook.children[idx]);
  refreshPageLabel();
}

document.getElementById('undo').onclick = ev => {
  history.getPreviousState();
}
document.getElementById('redo').onclick = ev => {
  history.getNextState();
}
