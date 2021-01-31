const {newSVGNode} = require('./utils.js');

let pages = [];
var viewport = {
  width: 210,
  height: 297,
  scale: 1,
}

function newPage() {
  // width + height define viewport
  // viewbox defines coordinate system; we want them equal
  let page = newSVGNode('svg', {width: viewport.width, height: viewport.height,
    viewBox: "0 0 210 297", preserveAspectRatio: "none"});
  page.id = 'page ' + pages.length + 1;

  let g = newSVGNode('g');
  g.id = 'layer0';

  let bg = newSVGNode('rect', {x:0,y:0,width: viewport.width, height: viewport.height});
  bg.classList.add('page-background');
  g.appendChild(bg);

  let nlines = 32;
  let margin = 14;
  let dh = (viewport.height-2*margin)/nlines;
  var i;
  for (i=0;i<nlines-1;i++) {
    let line = newSVGNode('path');
    line.classList.add('rule','hrule');
    line.setAttribute('d','m0 ' + (margin + dh*(i+1)) + 'h' + viewport.width)
    // line.setAttribute('d','m10.143 ' + (229.33 + i*dh) + 'h750.64');
    g.appendChild(line);
  }
  let line = newSVGNode('path');
  line.classList.add('rule','vrule');
  line.setAttribute('d','m30 0 v' + viewport.height)
  g.appendChild(line);


  page.appendChild(g);

  let g1 = newSVGNode('g');
  g1.id = 'layer1';
  g1.classList.add('highlighter');
  page.appendChild(g1);

  let g2 = newSVGNode('g');
  g2.id = 'layer2';
  g2.classList.add('strokes');
  page.appendChild(g1);

  let polyline = newSVGNode('polyline');
  polyline.id = 'points';
  polyline.classList.add('points');
  page.appendChild(polyline);


  pages.push(page);

  return page;
}

function zoomPages(sign) {
  if (sign == '+') {
    viewport.scale *= 1.4;
  }
  if (sign == '-') {
    viewport.scale /= 1.4;
  }

  var i, j;
  for (i=0;i<pages.length;i++) {
    page.setAttribute('width',viewport.width*viewport.scale);
    page.setAttribute('height',viewport.height*viewport.scale);
    page.setAttribute('view-box','0 0 ' + viewport.width*viewport.scale + ' ' +
      viewport.height*viewport.scale);

    for (j=0;j<page.children.length;j++) {
      page.children[j].setAttribute('transform','scale(' +
        viewport.scale + ' ' + viewport.scale + ')');
    }
  }
}

function getScale() {
  return viewport.scale;
}

exports.newPage = newPage;
exports.zoomPages = zoomPages;
exports.getScale = getScale;
