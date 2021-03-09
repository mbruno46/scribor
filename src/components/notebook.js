const {newSVGNode, px2float, flattenSVG, RectAsPath,
  appendAtIndex, removeChildren} = require('./utils.js');
const utils = require('./utils.js');
const fs = require('fs');
const path = require('path');
const {History} = require('./history.js');

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

var graphics = ['', path.join(__dirname, '../../public/svgs/collision2.path.svg'),
  path.join(__dirname, '../../public/svgs/feyndiagr2.path.svg')];


function setBackgroundLayer(page, ruling, bgcolor = 'white') {
  var g = page.children[0];
  removeChildren(g);

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

  // refreshPageNumbers();
}


function makeCoverPage(page, color, ig) {
  var g = page.children[0];
  removeChildren(g);

  let bg = newSVGNode('rect', {x:0, y:0, width: viewport.width, height: viewport.height});
  bg.setAttribute('fill',color[0]);
  g.appendChild(bg);

  // let img = flattenSVG(newSVGNode('path',{d: fs.readFileSync(graphics[ig])}),[`translate(-400,-550) scale(3.2, 3.2) rotate(-25 0 0)`])[0];
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

  let g = newSVGNode('g');
  g.id = 'layer-bg';
  page.appendChild(g);

  if (!coverPage) {
    setBackgroundLayer(page, 'ruled');
  }
  else {
    makeCoverPage(page, ['var(--cover-page-blue)','yellow','red'],1);
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

  return page;
}


function Notebook(nb) {
  var notebook = nb;
  var NMAX = 100;
  var idx;
  var at;
  var history = [];

  notebook.onkeydown = ev => {
    if ((ev.ctrlKey || ev.metaKey)) {
      if (event.key == "z" && !event.shiftKey) {getPreviousState();}
      if (event.key == "y" && !event.shiftKey) {getNextState();}
    }
  }

  function addPageAt(i, innerHTML=null) {
    let p = newPage(i==0);
    if (innerHTML!=null) {p.innerHTML = innerHTML;}
    appendAtIndex(notebook, p, i);
    rescalePages(viewport.scale*viewport.width);
    refreshPageNumbers();
    recordState();
  }

  function rmPageAt(i) {
    if (i<notebook.children.length && i>0) {
      notebook.removeChild(notebook.children[i]);
      refreshPageNumbers();
      recordState();
    }
  }

  function refreshPageNumbers() {
    var i, pn, tmp;
    let pages = notebook.children;

    for (i=0;i<pages.length;i++) {
      pages[i].id = 'page ' + i;
    }

    for (i=1;i<pages.length;i++) {
      let h = pages[i].children[0].children;
      pn = h[h.length-1];
      let n = pages[i].id.split('page ')[1].toString();
      tmp = TeXBox(n, [viewport.width-25,viewport.height-15], 'var(--hrule)', 0.5);
      pn.outerHTML = tmp.outerHTML;
    }
  }

  function recordState() {
    var data = []
    let pages = notebook.children;
    for (var i=0;i<pages.length;i++) {
      data.push(pages[i].innerHTML);
    }

    if (at>=0) {at = idx;}
    
    const state = history[idx];
    if (state) {
      if (state.data == data) return;
    }

    at++;
    history[at] = {data};
    history.splice(at+1, NMAX-at-1);

    if (at == NMAX-1) {
      at = NMAX-2;
      history.splice(0,1);
    }

    idx = at;
  }

  function setState() {
    let tmp = history[idx].data;
    let n = tmp.length;
    let m = notebook.children.lengt;
    var i;
    for (i=0;i<m-n;i++) {notebook.removeChild(notebook.children[n+i]);}
    for (i=0;i<n;i++) {notebook.children[i].innerHTML = tmp[i];}
    for (i=0;i<n-m;i++) {addPageAt(m+i,tmp[i]);}
  }

  function getPreviousState() {
    if (idx > 0) {idx--;}
    setState();
  }

  function getNextState() {
    if (idx < at) {idx++;}
    setState();
  }

  function rescalePages(new_width) {
    viewport.scale = Math.round(new_width/viewport.width*10000)/10000;

    let pages = notebook.children;
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

  function getAspectRatio() {return viewport.width/viewport.height;}

  return {
    notebook,
    init() {
      history = [];
      at = -1;
      removeChildren(notebook);
      addPageAt(0);
    },
    setContent(html) {
      history = [];
      at = -1;
      removeChildren(notebook);
      notebook.innerHTML = html;
      recordState();
    },
    getContent() {return notebook.innerHTML;},
    getPage(i=0) {
      if (i<0) {return notebook.children[0];}
      return notebook.children[i];
    },
    addPageAt,
    rmPageAt,
    recordState,
    getPreviousState,
    getNextState,
    zoomPages(sign) {
      if (sign=='+') {
        rescalePages(viewport.scale*viewport.width*1.10);
      }
      else if (sign=='-') {
        rescalePages(viewport.scale*viewport.width/1.10);
      }
    },
    setCursorIcon(type = '') {
      notebook.classList.remove('eraser-cursor','move-cursor','laser-cursor');
      if (type != '') {
        notebook.classList.add(type);
      }
    },
    fit_width() {
      const css = getComputedStyle(notebook);
      let w = notebook.offsetWidth -
        utils.px2int(css.paddingLeft) - utils.px2int(css.paddingRight)*2;
      rescalePages(w);
    },
    fit_height() {
      const css = getComputedStyle(notebook);
      let h = notebook.offsetHeight -
        utils.px2int(css.paddingTop) - utils.px2int(css.paddingBottom);
      rescalePages(getAspectRatio() * h);
    },
    real_width() {
      let div = document.createElement('div');
      div.id = 'dpi';
      document.body.appendChild(div);
      let css = getComputedStyle(div);
      let w = px2float(css.width) * viewport.realwidth/ 10.0 * window.devicePixelRatio;
      document.body.removeChild(div);
      rescalePages(Math.round(w));
    },
    setCoverPageStyle(color, ig) {
      makeCoverPage(notebook.children[0], color, ig);
    },
    setBackgrounStyle(i, ruling, bgcolor) {
      setBackgroundLayer(notebook.children[i], ruling, bgcolor);
    }
  }
}

function getScale() {return viewport.scale;}

exports.Notebook = Notebook;
exports.getScale = getScale;
