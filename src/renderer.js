const utils = require('./components/utils.js');
const {newPage, rescalePages, zoomPages} = require('./components/pages.js');
const {Sketch} = require('./components/sketch.js');
const {exportPDF} = require('./components/exportpdf.js');

// initialize notebook with empty page filling available width
var page = newPage();
const notebook = document.getElementById('notebook');
notebook.appendChild(page);
let s = Sketch();
s.setFocusPage(page);
refreshPageLabel();
fit_width();

utils.pointerEventListener('down', page, s.start);
utils.pointerEventListener('move', document, s.move);
utils.pointerEventListener('up leave', document, s.end);

document.getElementById('eraser').onclick = ev => {
  s.setMode('eraser');
}
document.getElementById('pen').onclick = ev => {
  s.setMode('pen');
}

//

document.getElementById('thin').onclick = ev => {
  s.setSize(0.4);
}
document.getElementById('medium').onclick = ev => {
  s.setSize(0.8);
}
document.getElementById('thick').onclick = ev => {
  s.setSize(1.2);
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

document.getElementById('export-pdf').onclick = ev => {
  exportPDF(notebook, './temp.pdf');
}

document.getElementById('zoom_in').onclick = ev => {
  zoomPages('+');
}
document.getElementById('zoom_out').onclick = ev => {
  zoomPages('-');
}



function fit_width() {
  const css = getComputedStyle(notebook);
  let w = notebook.offsetWidth -
    utils.px2int(css.paddingLeft) - utils.px2int(css.paddingRight)*2;
  rescalePages(w);
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
  let _new = newPage();
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
    notebook.appendChild(newPage());
  }

  var i;
  for (i=1;i<=notebook.children.length;i++) {
    notebook.children[i-1].id = 'page ' + i;
  }

  s.setFocusPage(notebook.children[(idx>0) ? idx-1 : 0]);
  refreshPageLabel();
}
