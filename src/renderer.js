const utils = require('./components/utils.js');
const {newPage, rescalePages} = require('./components/pages.js');
const {Sketch} = require('./components/sketch.js');

const page = newPage();
const notebook = document.getElementById('notebook');
notebook.appendChild(page);
let s = Sketch();
s.init(page);

utils.pointerEventListener('down', page, s.start);
utils.pointerEventListener('move', document, s.move);
utils.pointerEventListener('up leave', document, s.end);

const eraser = document.getElementById('eraser');
eraser.onclick = ev => {
  s.setMode('eraser');
}

const pen = document.getElementById('pen');
pen.onclick = ev => {
  s.setMode('pen');
}


// const zoom_in = document.getElementById('zoom_in');
// zoom_in.onclick = ev => {
//   zoomPages('+');
// }
// const zoom_out = document.getElementById('zoom_out');
// zoom_out.onclick = ev => {
//   zoomPages('-');
// }

const fit_width = document.getElementById('fit-width');
fit_width.onclick = ev => {
  const css = getComputedStyle(notebook);
  let w = notebook.offsetWidth -
    utils.px2int(css.paddingLeft) - utils.px2int(css.paddingRight);
  rescalePages(w);
}
