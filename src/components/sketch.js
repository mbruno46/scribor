const strokePoints = document.getElementById('points');
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
  return dec;
}

function distance(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy).toFixed(4); // to fixed
}


function Sketch(pad) {
  var sketching = false;
  var strokes = [];
  var points = [];
  var previous = null;
  let ns = 'http://www.w3.org/2000/svg';

  function position(event) {
    var touches = event.touches;
    var rect = pad.getBoundingClientRect();
    return {
      x: Math.round((touches ? touches[0].clientX : event.clientX) - rect.left),
      y: Math.round((touches ? touches[0].clientY : event.clientY) - rect.top),
      pressure: (touches ? touches[0].force : event.pressure || 0.5)
    }
  }

  function redraw () {
    var path = document.getElementById('path');
    if (!path) {
      var path = document.createElementNS(ns,'path');
    }
    var g = document.getElementById('g');
    if (!g) {
      g = document.createElementNS(ns, 'g');
    }
    console.log(g, path);

    pad.appendChild(g);
    g.classList.add('strokes');
    // create('g', pad, svgns, false, 'strokes');
    pad.setAttribute('viewBox', '0,0,'+ pad.getBoundingClientRect().width +','+ pad.getBoundingClientRect().height);
    path.setAttribute('d', optimize(decimate(6, points), bezier) );

    g.setAttribute('fill','none');
    g.setAttribute('stroke','currentColor');
    g.setAttribute('stroke-width', 3);
    g.appendChild(path);

    strokePoints.setAttribute('points', '');
  }

  return {
    start(event) {
      event.preventDefault();

      event = event || event.originalEvent || window.event;
      // let pad = (event.target || event.currentTarget);

      sketching = true;

      // start = Date.now();
      let pointer = position(event);
      var stroke = {
        x: pointer.x,
        y: pointer.y,
        // time: start,
        delta: 0,
        // elapsed: 0,
        pressure: pointer.pressure
      };
      points   = [[pointer.x, pointer.y]];
      strokes  = [stroke];
      previous = stroke;
    },
    draw(event) {
      event = event || event.originalEvent || window.event;
      if(!sketching) {
        return;
      }

      event.preventDefault();

      // var time = Date.now();
      // var elapsed = time - previous.time;

      let pointer = position(event);
      var stroke = {
        x: pointer.x,
        y: pointer.y,
        // time: time,
        delta: previous.delta + distance(previous, event),
        // elapsed: elapsed,
        pressure: pointer.pressure
      };
      previous = stroke;
      strokes.push(stroke);
      points.push([pointer.x, pointer.y]);
      // requestAF(draw);

      strokePoints.setAttribute('points', points);
    },
    end(event) {
      event = event || event.originalEvent || window.event;
      if(!sketching) {
        return;
      }
      event.preventDefault();

      console.log(strokes);
      // strokePoints.setAttribute('points', points);
      // var duration = (Date.now() - startTime) / 1000;
      var length = strokes[strokes.length - 1].delta;
      // requestAF(redraw);
      redraw();
      sketching = false;
    }

  }
}

exports.Sketch = Sketch;
