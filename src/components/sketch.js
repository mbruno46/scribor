const {newSVGNode, flattenSVG} = require('./utils.js');
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
  var selbox;
  var selection = []
  var moveto;

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

  function findPageChild(id) {
    var i;
    for (i=0;i<page.children.length;i++) {
      if (page.children[i].id == id) {
        return page.children[i];
      }
    }
    return null;
  }

  function beginDraw() {
    path = newSVGNode('path',{d: optimize(decimate(8, points), bezier)});
    var g;

    if (mode == 'pen') {
      g = findPageChild('layer-pen');
      path.classList.add('strokes');
      path.setAttribute('stroke',color[0]);
      path.setAttribute('stroke-width',size);
    }
    else if (mode == 'highlighter') {
      g = findPageChild('layer-hlighter');
      path.classList.add('highlighter');
      path.setAttribute('stroke',color[1]);
    }
    g.appendChild(path);
  }

  function resetSelection() {
    var i;
    for (i=0;i<selection.length;i++) {
      selection[i].classList.remove('selected');
    }
    selection = [];
    selbox = {x: 0, y: 0, width: 0, height: 0};
    drawSelection();
  };

  function drawSelection() {
    let el = findPageChild('selection-box');
    el.setAttribute('x',selbox.x);
    el.setAttribute('y',selbox.y);
    el.setAttribute('width',selbox.width);
    el.setAttribute('height',selbox.height);
  }

  function SelectElements() {
    if (mode=='select') {
      _select(findPageChild('layer-pen'));
      _select(findPageChild('layer-hlighter'));
    }
    if (mode=='select-latex') {
      _select(findPageChild('layer-latex'));
    }

    var i;
    for (i=0;i<selection.length;i++) {
      selection[i].classList.add('selected');
    }

    selbox = {x: 0, y: 0, width: 0, height: 0};
    drawSelection();

    function _select(g) {
      var i;
      for (i=0;i<g.children.length;i++) {
        let bbox = g.children[i].getBBox();
        if (bbox.x>=selbox.x && bbox.y>=selbox.y &&
          (bbox.width+bbox.x)<=(selbox.width+selbox.x) &&
          (bbox.height+bbox.y)<=(selbox.height+selbox.y)) {
          if (mode == 'select' && selection.indexOf(g.children[i]) == -1) {
            selection.push(g.children[i]);
          }
          if (mode == 'select-latex') {
            for (var j=0;j<g.children[i].children.length;j++) {
              if (selection.indexOf(g.children[i].children[j]) == -1) {
                selection.push(g.children[i].children[j]);
              }
            }
          }
        }
      }
    }
  }

  function moveSelection() {
    let dx = moveto.x - moveto.x0;
    let dy = moveto.y - moveto.y0;
    var i;
    for (i=0;i<selection.length;i++) {
      let temp = flattenSVG(selection[i], ['translate(' + dx + ',' + dy + ')']);
      // let d = shiftSVGPath(selection[i].getAttribute('d'),dx,dy);
      selection[i].setAttribute('d', temp[0].getAttribute('d'));
    }
  }

  function erase(target) {
    var layers = ['layer-pen','layer-hlighter','layer-latex'];
    for (var i=0;i<layers.length;i++) {
      let g = findPageChild(layers[i]);
      if (target.parentElement == g) {
        g.removeChild(target);
        break;
      }
      if (target.parentElement.parentElement == g) {
        g.removeChild(target.parentElement);
        break;
      }
    }
    return;
  }

  function init(_page) {
    if (page == _page) {
      return;
    }

    page = _page;
  }

  return {
    setMode(_mode) {
      mode = _mode;
      if (mode!='move') {
        resetSelection();
      }
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
      let pointer = position(event);

      // no need to collect points
      if (mode=='eraser') {
        return;
      }

      if (mode == 'move') {
        moveto = {x0: pointer.x, y0: pointer.y};
        return;
      }

      if (mode == 'select'||mode == 'select-latex') {
        selbox = {
          x0: pointer.x,
          y0: pointer.y,
          x: 0,
          y: 0,
          width: 0,
          height: 0
        };
        drawSelection();
        return;
      }

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

      if (mode=='eraser') {
        erase(event.target);
        return;
      }

      let pointer = position(event);

      if (mode=='select'||mode == 'select-latex') {
        selbox = {
          x0: selbox.x0,
          y0: selbox.y0,
          x: (pointer.x > selbox.x0) ? selbox.x0 : pointer.x,
          y: (pointer.y > selbox.y0) ? selbox.y0 : pointer.y,
          width: Math.abs(pointer.x-selbox.x0),
          height: Math.abs(pointer.y-selbox.y0)
        };
        drawSelection();
        return;
      }

      if (mode=='move') {
        moveto.x = pointer.x;
        moveto.y = pointer.y;
        moveSelection();
        moveto.x0 = pointer.x;
        moveto.y0 = pointer.y;
        return;
      }

      var stroke = {
        x: pointer.x,
        y: pointer.y,
        delta: previous.delta + distance(previous, event),
        pressure: pointer.pressure
      };
      previous = stroke;
      strokes.push(stroke);
      points.push([pointer.x, pointer.y]);

      path.setAttribute('d',optimize(decimate(3, points), bezier));
    },
    end(event) {
      event = event || event.originalEvent || window.event;
      if(!sketching) {
        return;
      }
      event.preventDefault();
      sketching = false;

      if (mode=='pen' || mode=='highlighter') {
        path.setAttribute('d',optimize(decimate(4, points), bezier));
      }

      if (mode == 'select' || mode == 'select-latex') {
        SelectElements();
        return;
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
    },
    getSelectedElements() {
      return selection;
    },
    appendSVG(svg, layer) {
      let g = findPageChild(layer);
      g.appendChild(svg);
      selection = [];
      for (var i=0;i<svg.children.length;i++) {
        selection.push(svg.children[i]);
      }
    }

  }
}

exports.Sketch = Sketch;
