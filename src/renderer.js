const {pointerEventListener} = require('./components/utils.js');
const {newPage, zoomPages} = require('./components/pages.js');
const {Sketch} = require('./components/sketch.js');

const page = newPage();
const notebook = document.getElementById('notebook');
notebook.appendChild(page);
let s = Sketch(page);

pointerEventListener('down', page, s.start);
pointerEventListener('move', document, s.draw);
pointerEventListener('up leave', document, s.end);

const zoom_in = document.getElementById('zoom_in');
zoom_in.onclick = ev => {
  zoomPages('+');
}
const zoom_out = document.getElementById('zoom_out');
zoom_out.onclick = ev => {
  zoomPages('-');
}
