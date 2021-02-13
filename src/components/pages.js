const {newSVGNode, px2float, flattenSVG, RectAsPath} = require('./utils.js');
const fs = require('fs');
const path = require('path');

var pages = [];
var viewport = {
  width: 595,
  height: 842,
  realwidth: 210, //mm
  scale: 1,
}
var layout = {
  vrule: 91, //32mm /210*595;
  hrule: 20, //7.1mm
  nlines: 36,
  grid: 14.03,
  label: [90,90,595-2*90,120,10],
  label_nlines: 2,
}


var graphics = ['', path.join(__dirname, '../../public/svgs/collision2.path.svg')];

function setBackgroundLayer(idx, ruling, bgcolor = 'white') {
  var g = pages[idx].children[0];
  while (g.hasChildNodes()) {
    g.removeChild(g.firstElementChild);
  }

  g.setAttribute('ruling',ruling);

  let bg = newSVGNode('rect', {x:0, y:0, width: viewport.width, height: viewport.height, fill: bgcolor});
  g.appendChild(bg);

  if (ruling == 'ruled') {
    let margin = Math.round((viewport.height-(layout.nlines-1)*layout.hrule)/2);
    var i;
    for (i=0;i<layout.nlines-1;i++) {
      let line = newSVGNode('path',{d: 'm0 ' + (margin + layout.hrule*(i+1)) + 'h' + viewport.width});
      line.classList.add('rule','hrule');
      g.appendChild(line);
    }
    let line = newSVGNode('path',{d: 'm' + layout.vrule + ' 0 v' + viewport.height});
    line.classList.add('rule','vrule');
    g.appendChild(line);
  }
  else {
    var i, n;
    n = Math.round(viewport.height/layout.grid);
    for (i=0;i<n;i++) {
      let line = newSVGNode('path',{d: 'm0 ' + (layout.grid*(i+1)) + 'h' + viewport.width});
      line.classList.add('rule','hrule');
      g.appendChild(line);
    }

    n = Math.round(viewport.width/layout.grid);
    for (i=0;i<n;i++) {
      let line = newSVGNode('path',{d: 'm ' + (layout.grid*(i+1)) + ' 0 v' + viewport.height});
      line.classList.add('rule','hrule');
      g.appendChild(line);
    }
  }

  let pn = newSVGNode('text',{x: viewport.width-25, y: viewport.height-15});
  pn.classList.add('page-number');
  g.appendChild(pn);

  refreshPageNumbers();
}

function makeCoverPage(color, ig) {
  var g = pages[0].children[0];
  while (g.hasChildNodes()) {
    g.removeChild(g.firstElementChild);
  }

  let bg = newSVGNode('rect', {x:0, y:0, width: viewport.width, height: viewport.height});
  bg.setAttribute('fill',color[0]);
  g.appendChild(bg);

  // let img = flattenSVG(newSVGNode('path',{d: fs.readFileSync(graphics[0])}),[`translate(120,570) scale(1.8, 1.8)`])[0];
  // img.setAttribute('fill','yellow');
  let img = newSVGNode('path',{d: (ig==0) ? '' : fs.readFileSync(graphics[ig]), fill: color[1], stroke: color[2], ig: ig});
  g.appendChild(img);

  let d = layout.label;
  let label = newSVGNode('path',{
    d: RectAsPath(d[0],d[1],d[2],d[3],d[4],d[4]),
    fill: 'white',
    stroke: 'black',
    'stroke-width': 2
  })
  g.appendChild(label);

  var i;
  for (i=0;i<layout.label_nlines;i++) {
    let line = newSVGNode('path');
    line.classList.add('rule','hrule');
    line.setAttribute('d','m' + (d[0]+d[4]) + ' ' + (d[1]+2*layout.hrule*(i+1)) + 'h' + (d[2]-2*d[4]))
    g.appendChild(line);
  }
}

function newPage(coverPage = false) {
  // width + height define viewport
  // viewbox defines coordinate system; we want them equal
  let page = newSVGNode('svg', {width: viewport.width, height: viewport.height,
    viewBox: "0 0 " + viewport.width + ' ' + viewport.height,
    preserveAspectRatio: "none"});
  page.id = 'page ' + pages.length;
  pages.push(page);

  let g = newSVGNode('g');
  g.id = 'layer-bg';
  page.appendChild(g);

  if (!coverPage) {
    setBackgroundLayer(pages.length-1, 'ruled');
  }
  else {
    makeCoverPage(['var(--cover-page-blue)','yellow','red'],1);
  }

  let g1 = newSVGNode('g');
  g1.id = 'layer-hlighter';
  g1.classList.add('highlighter');
  page.appendChild(g1);

  let g3 = newSVGNode('g');
  g3.id = 'layer-latex';
  g3.classList.add('latex');
  page.appendChild(g3);

  let g2 = newSVGNode('g');
  g2.id = 'layer-pen';
  g2.classList.add('strokes');
  page.appendChild(g2);

  // let polyline = newSVGNode('polyline');
  // polyline.id = 'points';
  // polyline.classList.add('points');
  // page.appendChild(polyline);

  let selbox = newSVGNode('rect');
  selbox.id = 'selection-box';
  selbox.classList.add('selection-box');
  page.appendChild(selbox);

  let s = getScale();
  rescalePages(s*viewport.width);

  return page;
}

function rescalePages(new_width) {
  viewport.scale = Math.round(new_width/viewport.width*10000)/10000;

  var i, j;
  for (i=0;i<pages.length;i++) {
    pages[i].setAttribute('width',(viewport.width*viewport.scale));
    pages[i].setAttribute('height',(viewport.height*viewport.scale));
    pages[i].setAttribute('view-box','0 0 ' + viewport.width*viewport.scale + ' ' +
      viewport.height*viewport.scale);

    for (j=0;j<pages[i].children.length;j++) {
      pages[i].children[j].setAttribute('transform','scale(' +
        viewport.scale + ' ' + viewport.scale + ')');
    }
  }
}

function getScale() {
  return viewport.scale;
}

function getAspectRatio() {
  return viewport.width/viewport.height;
}

function getRealWidth() {
  let div = document.createElement('div');
  div.id = 'dpi';
  document.body.appendChild(div);
  let css = getComputedStyle(div);
  let w = px2float(css.width) * viewport.realwidth/ 10.0 * window.devicePixelRatio;
  document.body.removeChild(div);
  return Math.round(w);
}

function zoomPages(sign) {
  if (sign=='+') {
    rescalePages(viewport.scale*viewport.width*1.10);
  }
  else if (sign=='-') {
    rescalePages(viewport.scale*viewport.width/1.10);
  }
}

function refreshPagesDatabaseFromNotebook(notebook) {
  pages = []
  var i;
  for (i=0;i<notebook.children.length;i++) {
    pages.push(notebook.children[i]);
  }
}

function refreshPageNumbers() {
  var i;
  for (i=0;i<pages.length;i++) {
    let h = pages[i].children[0].children;
    let pn = h[h.length-1];
    pn.textContent = pages[i].id.split('page ')[1];
  }
}

exports.newPage = newPage;
exports.rescalePages = rescalePages;
exports.getScale = getScale;
exports.getAspectRatio = getAspectRatio;
exports.getRealWidth = getRealWidth;
exports.zoomPages = zoomPages;
exports.refreshPagesDatabaseFromNotebook = refreshPagesDatabaseFromNotebook;
exports.refreshPageNumbers = refreshPageNumbers;
exports.setBackgroundLayer = setBackgroundLayer;
exports.makeCoverPage = makeCoverPage;
