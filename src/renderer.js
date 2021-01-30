const {pointerEventListener} = require('./components/utils.js');
const {Sketch} = require('./components/sketch.js');

const pad = document.getElementById('pad');
let s = Sketch(pad);

pointerEventListener('down', pad, s.start);
pointerEventListener('move', document, s.draw);
pointerEventListener('up leave', document, s.end);
