const utils = require('./components/utils.js');
const pages = require('./components/pages.js');
const {Sketch} = require('./components/sketch.js');
const {exportPDF} = require('./components/exportpdf.js');
const { remote, globalShortcut } = require('electron');
const {dialog} = remote;
const fs = require('fs');
const history = require('./components/history.js');
const {firePreferences, fireLatexEditor} = require('./components/popup.js');
const {TeXBox} = require('./components/texbox.js');

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
Listeners(true);

function Listeners(add = true) {
  utils.pointerEventListener('down', page, s.start, add);
  utils.pointerEventListener('move', document, s.move, add);
  utils.pointerEventListener('up leave', document, s.end, add);
}

function setActiveBtnGroup(g) {
  var el = document.getElementsByClassName('btn-group-active');
  if (el && el[0]) {
    if (el[0] == g) {return;}

    _hide(el[0].children,true);
    el[0].classList.remove('btn-group-active');
  }
  _hide(g.children, false);
  g.classList.add('btn-group-active');

  function _hide(arr,hide) {
    for (var i=0;i<arr.length;i++) {
      let btn = arr[i];
      if (btn.hasAttribute('hidable')) {
        if (hide) {
          btn.classList.add('hidden');
        }
        else {
          btn.classList.remove('hidden');
        }
      }
    }
  };
}

function setCursorIcon(type = '') {
  notebook.classList.remove('eraser-cursor','move-cursor');
  if (type != '') {
    notebook.classList.add(type);
  }
}

document.getElementById('eraser').onclick = ev => {
  s.setMode('eraser');
  setCursorIcon('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('select').onclick = ev => {
  s.setMode('select');
  setCursorIcon();
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('move').onclick = ev => {
  s.setMode('move');
  setCursorIcon('move-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}

//
// pen
//
new Map([
  ['thin', 1.0],
  ['medium', 2.0],
  ['thick', 3.0],
]).forEach(function(v,k) {
  document.getElementById(k).onclick = ev => {
    s.setSize(v);
  }
});

new Map([
  ['red', 'var(--pen-color-red)'],
  ['blue', 'var(--pen-color-blue)'],
  ['black', 'black'],
]).forEach(function(v,k) {
  document.getElementById(k).onclick = ev => {
    s.setColor(v);
  }
});

s.setSize(2.0);
s.setColor('var(--pen-color-blue)');

document.getElementById('pen').onclick = ev => {
  s.setMode('pen');
  setCursorIcon();
  setActiveBtnGroup(event.currentTarget.parentElement);
}

//
// highlighter
//
['orange','yellow','cyan','green'].forEach(function(id) {
  document.getElementById(id).onclick = ev => {
    let color = "var(--pen-color-" + id + ")";
    document.getElementById('highlighter').style.color = color;
    s.setColor(color,1);
  }
});

document.getElementById('highlighter').setAttribute('style','color: var(--pen-color-orange)')
s.setColor("var(--pen-color-orange)",1);

document.getElementById('highlighter').onclick = ev => {
  s.setMode('highlighter');
  setCursorIcon();
  setActiveBtnGroup(event.currentTarget.parentElement);
}

//
// LaTeX
//
document.getElementById('latex').onclick = ev => {
  setCursorIcon();
  setActiveBtnGroup(event.currentTarget.parentElement);
  Listeners(false);
  fireLatexEditor(createLatex).then(function(resolve) {
    Listeners(true);
  });
  function createLatex(text, color, size) {
    s.appendSVG(TeXBox(text, color, size), 'layer-latex');
  }
}

document.getElementById('select-latex').onclick = ev => {
  s.setMode('select-latex');
  setCursorIcon();
  setActiveBtnGroup(event.currentTarget.parentElement);
}


notebook.oncontextmenu = ev => {
  // right click
  if (event.which != 3) {
    return true;
  }
  // prevents drawing on the page;
  ev.stopPropagation();
  if (s.getMode() == 'pen') {
    s.setMode('eraser');
    setCursorIcon('eraser-cursor');
    setActiveBtnGroup(document.getElementById('eraser').parentElement);
  }
  else {
    s.setMode('pen');
    setCursorIcon();
    setActiveBtnGroup(document.getElementById('pen').parentElement);
  }
};


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
  pages.refreshPageNumbers();
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

  s.setFocusPage(notebook.children[idx-1]);
  refreshPageLabel();
  pages.refreshPageNumbers();
}

document.getElementById('undo').onclick = ev => {
  history.getPreviousState();
}
document.getElementById('redo').onclick = ev => {
  history.getNextState();
}

document.getElementById('preferences').onclick = ev => {
  firePreferences();
}
