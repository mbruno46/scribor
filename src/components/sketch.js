const {newSVGNode} = require('./utils.js');
const {getScale} = require('./pages');
const history = require('./history.js');

const smoothing = 0.15;

function line (a, b) {
  var lenX = b[0] - a[0];
  var lenY = b[1] - a[1];
  return {
    length: Math.sqrt(Math.pow(lenX, 2) + Math.pow(lenY, 2)),
    angle: Math.atan2(lenY, lenX)
  }
}

function joint(current, prev, next, reverse) {
  var p = prev || current, n = next || current;
  var o = line(p, n)
  var angle = o.angle + (reverse ? Math.PI : 0)
  var length = o.length * smoothing;
  var x = current[0] + Math.cos(angle) * length
  var y = current[1] + Math.sin(angle) * length;
  return [x, y];
}

function bezier (point, i, a) {
  var cps = joint (a[i - 1], a[i - 2], point);
  var cpe = joint (point, a[i - 1], a[i + 1], true);
  return 'C '+cps[0]+','+cps[1]+' '+cpe[0]+','+cpe[1]+' '+point[0]+','+point[1];
}

function optimize (points, command) {
  var d = points.reduce(function(acc, point, i, a) {
    return i === 0 ? 'M '+ point[0] +','+ point[1] : acc +' '+ command(point, i, a);
  }, 0);
  return d;
}

function decimate(n, points) {
  var dec = [];
  dec[0] = points[0];
  for (var i = 0; i < points.length; i++) {
    if (i % n == 0) dec[dec.length] = points[i];
  }
  dec[dec.length] = points[points.length-1];
  return dec;
}

function distance(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy).toFixed(4); // to fixed
}


function Sketch() {
  var sketching = false;
  var strokes = [];
  var points = [];
  var previous = null;
  let ns = 'http://www.w3.org/2000/svg';
  var strokePoints;
  var page = null;
  var mode = 'pen';
  var color = ['var(--pen-color-blue)', 'var(--pen-color-orange)'];
  var size = 0.8;
  var path;

  function position(event) {
    var touches = event.touches;
    var rect = page.getBoundingClientRect();
    var scale = getScale();
    return {
      x: Math.round((touches ? touches[0].clientX : event.clientX) - rect.left)/scale,
      y: Math.round((touches ? touches[0].clientY : event.clientY) - rect.top)/scale,
      pressure: (touches ? touches[0].force : event.pressure || 0.5)
    }
  }

  function findLayer(name) {
    var i;
    for (i=0;i<page.children.length;i++) {
      if (page.children[i].id == 'layer-' + name) {
        return page.children[i];
      }
    }
    return null;
  }

  // function redraw () {
  //   let path = newSVGNode('path',{d: optimize(decimate(8, points), bezier)});
  //   var g;
  //
  //   if (mode == 'pen') {
  //     g = findLayer('pen');
  //     path.classList.add('strokes');
  //     path.setAttribute('stroke',color[0]);
  //     path.setAttribute('stroke-width',size);
  //   }
  //   else if (mode == 'highlighter') {
  //     g = findLayer('hlighter');
  //     path.classList.add('highlighter');
  //     path.setAttribute('stroke',color[1]);
  //     strokePoints.classList.remove('highlighter');
  //   }
  //   g.appendChild(path);
  //
  //   strokePoints.setAttribute('points', '');
  // }

  function beginDraw() {
    path = newSVGNode('path',{d: optimize(decimate(8, points), bezier)});
    var g;

    if (mode == 'pen') {
      g = findLayer('pen');
      path.classList.add('strokes');
      path.setAttribute('stroke',color[0]);
      path.setAttribute('stroke-width',size);
    }
    else if (mode == 'highlighter') {
      g = findLayer('hlighter');
      path.classList.add('highlighter');
      path.setAttribute('stroke',color[1]);
    }
    g.appendChild(path);
  }

  function erase(target) {
    let g = findLayer('pen');
    if (target.parentElement == g) {
      g.removeChild(target);
    }
    g = findLayer('hlighter');
    if (target.parentElement == g) {
      g.removeChild(target);
    }
  }

  function init(_page) {
    if (page == _page) {
      return;
    }

    page = _page;

    // var i;
    // for (i=0; i< page.children.length; i++) {
    //   if (page.children[i].id == 'points') {
    //     // strokePoints = page.children[i];
    //     break;
    //   }
    // }
  }

  return {
    setMode(_mode) {
      mode = _mode;
    },
    getMode() {
      return mode;
    },
    setColor(_color, i=0) {
      color[i] = _color;
    },
    setSize(_size) {
      size = _size;
    },
    start(event) {
      event.preventDefault();
      // prevents drawing if right click
      if (event.which == 3) {return;}

      event = event || event.originalEvent || window.event;
      let p = event.target.parentElement.parentElement
      if (p.id.substring(0,4) != 'page') {
        return;
      }

      init(p);
      sketching = true;

      // no need to collect stroke points
      if (mode=='eraser' || mode=='select') {
        return;
      }

      let pointer = position(event);
      var stroke = {
        x: pointer.x,
        y: pointer.y,
        delta: 0,
        pressure: pointer.pressure
      };

      points   = [[pointer.x, pointer.y]];
      strokes  = [stroke];
      previous = stroke;
      beginDraw();
    },
    move(event) {
      event = event || event.originalEvent || window.event;
      if(!sketching) {
        return;
      }
      event.preventDefault();

      if (mode=='select') {
        return;
      }

      if (mode=='eraser') {
        erase(event.target);
        return;
      }

      let pointer = position(event);
      var stroke = {
        x: pointer.x,
        y: pointer.y,
        delta: previous.delta + distance(previous, event),
        pressure: pointer.pressure
      };
      previous = stroke;
      strokes.push(stroke);
      points.push([pointer.x, pointer.y]);

      path.setAttribute('d',optimize(decimate(6, points), bezier));
    },
    end(event) {
      event = event || event.originalEvent || window.event;
      if(!sketching) {
        return;
      }
      event.preventDefault();
      sketching = false;

      if (mode=='pen' || mode=='highlighter') {
        path.setAttribute('d',optimize(decimate(6, points), bezier));
      }
      if (mode!=select) {
        history.recordState();
      }
    },
    getFocusPage() {
      let fp = page.id;
      return parseInt(fp.substring(5));
    },
    setFocusPage(p) {
      init(p);
    }

  }
}

exports.Sketch = Sketch;
