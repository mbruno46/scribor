const {newSVGNode} = require('./utils.js');

var pages = [];
var viewport = {
  width: 595,
  height: 842,
  scale: 1,
}
var layout = {
  vrule: 91, //32mm /210*595;
  hrule: 20, //7.1mm
  nlines: 36,
}

function newPage() {
  // width + height define viewport
  // viewbox defines coordinate system; we want them equal
  let page = newSVGNode('svg', {width: viewport.width, height: viewport.height,
    viewBox: "0 0 " + viewport.width + ' ' + viewport.height,
    preserveAspectRatio: "none"});
  page.id = 'page ' + (pages.length + 1);

  let g = newSVGNode('g');
  g.id = 'layer-bg';

  let bg = newSVGNode('rect', {x:0, y:0, width: viewport.width, height: viewport.height});
  bg.classList.add('page-background');
  g.appendChild(bg);

  let margin = Math.round((viewport.height-(layout.nlines-1)*layout.hrule)/2);
  var i;
  for (i=0;i<layout.nlines-1;i++) {
    let line = newSVGNode('path');
    line.classList.add('rule','hrule');
    line.setAttribute('d','m0 ' + (margin + layout.hrule*(i+1)) + 'h' + viewport.width)
    g.appendChild(line);
  }
  let line = newSVGNode('path');
  line.classList.add('rule','vrule');
  line.setAttribute('d','m' + layout.vrule + ' 0 v' + viewport.height)
  g.appendChild(line);


  page.appendChild(g);

  let g1 = newSVGNode('g');
  g1.id = 'layer-hlighter';
  g1.classList.add('highlighter');
  page.appendChild(g1);

  let g2 = newSVGNode('g');
  g2.id = 'layer-pen';
  g2.classList.add('strokes');
  page.appendChild(g2);

  let polyline = newSVGNode('polyline');
  polyline.id = 'points';
  polyline.classList.add('points');
  page.appendChild(polyline);


  pages.push(page);

  let s = getScale();
  rescalePages(s*viewport.width);

  return page;
}

function rescalePages(new_width) {
  viewport.scale = Math.round(new_width/viewport.width*10000)/10000;

  var i, j;
  for (i=0;i<pages.length;i++) {
    pages[i].setAttribute('width',viewport.width*viewport.scale);
    pages[i].setAttribute('height',viewport.height*viewport.scale);
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

function zoomPages(sign) {
  if (sign=='+') {
    rescalePages(viewport.scale*viewport.width*1.10);
  }
  else if (sign=='-') {
    rescalePages(viewport.scale*viewport.width/1.10);
  }
}

exports.newPage = newPage;
exports.rescalePages = rescalePages;
exports.getScale = getScale;
exports.zoomPages = zoomPages;