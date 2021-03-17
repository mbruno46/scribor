const {newSVGNode, flattenSVG} = require('./utils.js');
const {getScale} = require('./notebook.js');

const smoothing = 0.20;

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


function Smoother(_n, first) {
  var points = [first]
  var cache = [first]
  var n=_n;

  function smear_cache() {
    let m = [0,0];
    for (var i=0;i<cache.length;i++) {
      m[0] += cache[i][0];
      m[1] += cache[i][1];
    }
    m[0] /= n;
    m[1] /= n;
    return m;
  }

  return {
    addPoint(p) {
      if (cache.length<n) {
        cache[cache.length] = p;
        return false;
      }
      else {
        points[points.length] = smear_cache();
        cache = [];
        cache[0] = p;
        return true;
      }
    },
    getPoints() {
      return points.concat(cache);
    },
    finalizePoints() {
      if (cache.length<n) {
        points[points.length] = cache[cache.length-1];
      }
      else {
        points[points.length] = smear_cache();
      }
      return points;
    }
  }
}


function distance(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy).toFixed(4); // to fixed
}



function Sketch(_nb) {
  var sketching = false;
  var strokes = [];
  var points = [];
  var previous = null;
  var strokePoints;
  var page = null;
  var nb = _nb;
  var mode = 'pen';
  var color = ['var(--pen-color-blue)', 'var(--pen-color-orange)'];
  var size = 0.8;
  var path;
  var selbox;
  var selection = [];
  var selection_layers = [];
  var moveto;
  var smoother = null;
  var clipboard = [];

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
    path = newSVGNode('path',{d: optimize(smoother.getPoints(), bezier)});
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
    selection_layers = [];
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
    for (var i=0;i<selection_layers.length;i++) {
      _select(findPageChild(selection_layers[i]));
    }

    for (var i=0;i<selection.length;i++) {
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
          if (selection.indexOf(g.children[i]) == -1) {
            selection.push(g.children[i]);
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
      selection[i].setAttribute('d', temp[0].getAttribute('d'));
    }
  }

  function fillClipboard(remove = false) {
    clipboard = [];
    for (var i=0;i<selection.length;i++) {
      clipboard.push({layer: selection[i].parentElement.id,
        node: selection[i].cloneNode(true)});
      if (remove) {
        selection[i].parentElement.removeChild(selection[i]);
      }
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
    setMode(_mode,args=null) {
      mode = _mode;
      if (mode!='move') {
        resetSelection();
      }
      if (mode=='select') {
        selection_layers = args.split(' ');
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

      if (mode == 'select') {
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

      if (mode=='pen' || mode=='highlighter') {
        var stroke = {
          x: pointer.x,
          y: pointer.y,
          delta: 0,
          pressure: pointer.pressure
        };

        points   = [[pointer.x, pointer.y]];
        strokes  = [stroke];
        previous = stroke;
        if (smoother==null) {smoother = Smoother(4, [pointer.x, pointer.y]);}
        beginDraw();
      }
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

      if (mode=='select') {
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

      if (mode=='pen' || mode=='highlighter') {
        var stroke = {
          x: pointer.x,
          y: pointer.y,
          delta: previous.delta + distance(previous, event),
          pressure: pointer.pressure
        };
        previous = stroke;
        strokes.push(stroke);
        points.push([pointer.x, pointer.y]);
        if (smoother.addPoint([pointer.x, pointer.y])) {
          path.setAttribute('d',optimize(smoother.getPoints(), bezier));
        }
      }
    },
    end(event) {
      event = event || event.originalEvent || window.event;
      if(!sketching) {
        return;
      }
      event.preventDefault();
      sketching = false;

      if (mode=='pen' || mode=='highlighter') {
        // path.setAttribute('d',optimize(decimate(3, points), bezier));
        path.setAttribute('d',optimize(smoother.finalizePoints(), bezier));
        smoother = null;
        nb.recordState();
      }

      if (mode=='eraser') {nb.recordState();}

      if (mode == 'select') {
        SelectElements();
        return;
      }

      if (mode=='move') {
        for (var i=0;i<selection.length;i++) {
          selection[i].classList.remove('selected');
        }
        nb.recordState();
        for (var i=0;i<selection.length;i++) {
          selection[i].classList.add('selected');
        }
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
    getSelectedLayers() {
      return selection_layers;
    },
    appendSVG(svg, layer) {
      let g = findPageChild(layer);
      g.appendChild(svg);
      nb.recordState();
      resetSelection();
      svg.classList.add('selected');
      selection = [svg];
      selection_layers = [layer];
    },
    cutSelection() {
      fillClipboard(true);
      resetSelection();
    },
    copySelection() {
      fillClipboard(false);
      resetSelection();
    },
    pasteSelection() {
      resetSelection();
      for (var i=0;i<clipboard.length;i++) {
        let node = clipboard[i].node.cloneNode(true);
        let g = findPageChild(clipboard[i].layer);
        g.appendChild(node);
        node.classList.add('selected');
        selection[selection.length] = node;
        if (selection_layers.indexOf(clipboard[i].layer) < 0) {
          selection_layers[selection_layers.length] = clipboard[i].layer;
        }
      }
    }

  }
}

exports.Sketch = Sketch;
