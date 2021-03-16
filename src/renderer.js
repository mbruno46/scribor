const utils = require('./components/utils.js');
const {Sketch} = require('./components/sketch.js');
const {exportPDF} = require('./components/exportpdf.js');
const { remote, globalShortcut } = require('electron');
const {dialog} = remote;
const fs = require('fs');
const {fireCoverPagePreferences, firePagePreferences, fireLatexEditor} = require('./components/popup.js');
const {TeXBox} = require('./components/texbox.js');
const {checkVersion} = require('./components/update.js');
const { ipcRenderer } = require('electron')
const zlib = require('zlib');
const {Notebook} = require('./components/notebook.js');

// initialize notebook with cover page filling available width
const nb = Notebook(document.getElementById('notebook'));
nb.init();
nb.fit_width();

let s = Sketch(nb);
s.setFocusPage(nb.getPage());

s.setMode('pen');
setActiveBtnGroup(document.getElementById('pen').parentElement);
var notebook_file = null;

Listeners(true);

// save prefs when closing app
ipcRenderer.on('check-updates', (event, arg) => {
  checkVersion(arg.version);
  event.returnValue = 'DONE';
});

function Listeners(add = true) {
  utils.pointerEventListener('down', nb.getPage(), s.start, add);
  utils.pointerEventListener('move', document, s.move, add);
  utils.pointerEventListener('up leave', document, s.end, add);
  utils.eventListener('keydown', document, keydown, add);
}

function keydown(ev) {
  if ((ev.ctrlKey || ev.metaKey)) {
    if (event.key == "z" && !event.shiftKey) {nb.getPreviousState();}
    if (event.key == "y" && !event.shiftKey) {nb.getNextState();}

    if (event.key == "x" && !event.shiftKey) {s.cutSelection();}
    if (event.key == "c" && !event.shiftKey) {s.copySelection();}
    if (event.key == "v" && !event.shiftKey) {s.pasteSelection();}

    return false;
  }
  return true;
};

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

document.getElementById('eraser').onclick = ev => {
  s.setMode('eraser');
  nb.setCursorIcon('eraser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('select').onclick = ev => {
  s.setMode('select');
  nb.setCursorIcon();
  setActiveBtnGroup(event.currentTarget.parentElement);
}
document.getElementById('move').onclick = ev => {
  s.setMode('move');
  nb.setCursorIcon('move-cursor');
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
  nb.setCursorIcon();
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
  nb.setCursorIcon();
  setActiveBtnGroup(event.currentTarget.parentElement);
}

//
// LaTeX
//
document.getElementById('latex').onclick = ev => {
  nb.setCursorIcon();
  setActiveBtnGroup(event.currentTarget.parentElement);
  Listeners(false);
  fireLatexEditor(createLatex).then(function(resolve) {
    Listeners(true);
    // change to move
    s.setMode('move');
    nb.setCursorIcon('move-cursor');
    setActiveBtnGroup(document.getElementById('move').parentElement);
  });
  function createLatex(text, color, size) {
    s.appendSVG(TeXBox(text, [100,150], color, size), 'layer-latex');
  }
}

document.getElementById('edit-latex').onclick = ev => {
  nb.setCursorIcon();
  setActiveBtnGroup(event.currentTarget.parentElement);
  let sel = s.getSelectedElements();
  if (sel.length==0) {return;}

  Listeners(false);
  let bbox = sel[0].getBBox();
  let opts = [sel[0].getAttribute('latex'), sel[0].getAttribute('fill'),
    parseFloat(sel[0].getAttribute('scale'))];

  fireLatexEditor(replaceLatex, opts[0], opts[1], opts[2]).then(function(resolve) {
    Listeners(true);
    // change to move
    s.setMode('move');
    nb.setCursorIcon('move-cursor');
    setActiveBtnGroup(document.getElementById('move').parentElement);
  });
  function replaceLatex(text, color, size) {
    let p = sel[0].parentElement;
    p.removeChild(sel[0]);
    s.appendSVG(TeXBox(text, [bbox.x,bbox.y + bbox.height], color, size), 'layer-latex');
  }
}

document.getElementById('select-latex').onclick = ev => {
  s.setMode('select-latex');
  nb.setCursorIcon();
  setActiveBtnGroup(event.currentTarget.parentElement);
}


nb.notebook.oncontextmenu = ev => {
  // right click
  if (event.which != 3) {
    return true;
  }
  // prevents drawing on the page;
  ev.stopPropagation();
  if (s.getMode() == 'pen') {
    s.setMode('eraser');
    nb.setCursorIcon('eraser-cursor');
    setActiveBtnGroup(document.getElementById('eraser').parentElement);
  }
  else {
    s.setMode('pen');
    nb.setCursorIcon();
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
    nb.setContent(zlib.inflateSync(data).toString());
    s.setFocusPage(nb.getPage());
    refreshPageLabel();
    nb.fit_width();
  });
  document.title = 'SCRIBOR: ' + notebook_file;
}

function save_notebook(fname) {
  fs.writeFile(fname, zlib.deflateSync(nb.getContent()), (err) => {
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
  exportPDF(nb.notebook, fname);
}

document.getElementById('zoom_in').onclick = ev => {
  nb.zoomPages('+');
}
document.getElementById('zoom_out').onclick = ev => {
  nb.zoomPages('-');
}


document.getElementById('fit-width').onclick = ev => {nb.fit_width();}
document.getElementById('fit-height').onclick = ev => {nb.fit_height();}
document.getElementById('real-width').onclick = ev => {nb.real_width();}

function refreshPageLabel() {
  let idx = s.getFocusPage();
  let msg = (idx==0) ? 'cover' : 'Page ' + idx + '/' + (notebook.children.length-1);
  document.getElementById('page-label').textContent = msg;
}

nb.notebook.onclick = ev => {
  refreshPageLabel();
}


document.getElementById('new-page').onclick = ev => {
  let idx = s.getFocusPage();
  nb.addPageAt(idx+1);
  s.setFocusPage(nb.getPage(idx+1));
  refreshPageLabel();
}

document.getElementById('del-page').onclick = ev => {
  let idx = s.getFocusPage();
  nb.rmPageAt(idx);
  s.setFocusPage(nb.getPage(idx-1));
  refreshPageLabel();
}

document.getElementById('undo').onclick = ev => {nb.getPreviousState();}
document.getElementById('redo').onclick = ev => {nb.getNextState();}

document.getElementById('cut').onclick = ev => {s.cutSelection();}
document.getElementById('copy').onclick = ev => {s.copySelection();}
document.getElementById('paste').onclick = ev => {s.pasteSelection();}

document.getElementById('preferences').onclick = ev => {
  Listeners(false);
  let idx = s.getFocusPage();
  let g = nb.getPage(idx).children[0];

  if (idx == 0) {
    let opts = {coverPageStyle: [g.children[0].getAttribute('fill'),
      g.children[1].getAttribute('fill'), g.children[1].getAttribute('stroke')],
      image: g.children[1].getAttribute('ig'),
    };
    fireCoverPagePreferences(opts).then(function(resolve) {
      Listeners(true);
      if (resolve=='do-nothing') {
        return;
      }
      nb.setCoverPageStyle(resolve.coverPageStyle, resolve.image);
    });
  }
  else {
    let opts = {idx: idx, ruling: g.getAttribute('ruling'),
      bgcolor: g.children[0].getAttribute('fill')
    };
    firePagePreferences(opts).then(function(resolve) {
      Listeners(true);
      if (resolve=='do-nothing') {
        return;
      }
      nb.setBackgrounStyle(idx, resolve.ruling, resolve.bgcolor);
    });
  }
}

document.getElementById('laser').onclick = ev => {
  s.setMode('none');
  nb.setCursorIcon('laser-cursor');
  setActiveBtnGroup(event.currentTarget.parentElement);
}
