const svgpath = require('svgpath');

let ns = "http://www.w3.org/2000/svg";

function pointerEventListener (events, el, handler, add = true, options = false) {
  if (typeof events === 'string'){
    var s = events.split(/[\s,;]+/);
    events = s;
  }

  var pointer, touch, mspointer, cmd, types;

  pointer = window.PointerEvent;
  mspointer = window.MSPointerEvent;
  touch = !pointer && !mspointer && window.TouchEvent;
  cmd = (add) ? el.addEventListener : el.removeEventListener;

  types = {
    pointer : { over: 'pointerover', down: 'pointerdown', move: 'pointermove', up: 'pointerup', leave: 'pointerleave' },
    mouse :   { over: 'mouseover', down: 'mousedown', move: 'mousemove', up: 'mouseup', leave: 'mouseleave' },
    touch :   { over: 'touchstart', down: 'touchstart', move: 'touchmove', up: 'touchend', leave: 'touchcancel' },
    MSPointer:{ over: 'MSPointerOver', down: 'MSPointerDown', move: 'MSPointerMove', up: 'MSPointerUp', leave: 'MSPointerLeave' }
  }

  events.forEach(function(event) {
    cmd(types['pointer'][event], handler, options);
    if (mspointer) {
      cmd(types['MSPointer'][event], handler, options);
    }
    else if (touch){
      cmd(types['touch'][event], handler, options);
    }
    else if (!pointer && !mspointer) {
      cmd(types['mouse'][event], handler, options);
    }
  });

  function init(){
    console.log(events, el, handler, add, options, pointer, touch, mspointer, cmd, types)
  }

  return {
    add: init,
    remove: init
  }
};

function newSVGNode(type, attrs) {
  el = document.createElementNS(ns, type);
  for (var a in attrs) {
    el.setAttributeNS(null, a.replace(/[A-Z]/g, function(m, a, o, s) {
      return "-" + m.toLowerCase();
    }), attrs[a]);
  }
  return el
}

function px2int(str) {
  return parseInt(str.substring(0,str.lastIndexOf('px')));
}
function px2float(str) {
  return parseFloat(str.substring(0,str.lastIndexOf('px')));
}

function RectAsPath(x,y,w,h,rx,ry) {
  let r = x+w;
  let b = y+h;
  d = `M ${x+rx},${y}`
  d+= `L ${r-rx},${y}`
  d+= `Q ${r},${y},${r},${y+ry}`
  d+= `L ${r},${y + h - ry}`
  d+= `Q ${r},${b},${r-ry},${b}`
  d+= `L ${x+rx},${b}`
  d+= `Q ${x},${b},${x},${b-ry}`
  d+= `L ${x},${y+ry}`
  d+= `Q ${x},${y},${x+rx},${y}`
  d+= 'Z'
  return d;
}

function flattenSVG(input, trafos = []) {
  let t = input.getAttribute('transform');
  if (t) {
    trafos.push(t);
  }

  let tag = input.tagName.toLowerCase();
  var out;
  if (tag=='g') {
    out = flattenSVGGroup(input, trafos);
  }
  else if (tag=='path') {
    out = flattenSVGPath(input, trafos);
  }
  else if (tag=='rect') {
    out = flattenSVGPath(Rect2Path(input), trafos);
  }

  if (t) {
    trafos.pop();
  }
  return out;

  function flattenSVGGroup(g, trafos) {
    var newchildren = [];

    for (var i=0;i<g.children.length;i++) {
      newchildren.push.apply(newchildren, flattenSVG(g.children[i], trafos));
    }

    return newchildren;
  }

  function flattenSVGPath(path, trafos) {
    var d = path.getAttribute('d');
    for (var i=trafos.length-1;i>=0;i--) {
      let _d = svgpath(d).transform(trafos[i]).round(10).toString();
      d = _d;
    }

    let newpath = newSVGNode('path',{d: svgpath(d).round(4).toString()});
    return [newpath];
  }

  function Rect2Path(r) {
    var x = r.getAttribute('x');
    var y = r.getAttribute('y');
    var w = r.getAttribute('width');
    var h = r.getAttribute('height');

    var d;
    d = `M ${x},${y}`
    d+= `h ${w}`
    d+= `v ${h}`
    d+= `h -${w}`
    d+= `v -${h}`
    d+= `Z`

    return newSVGNode('path',{d: d});
  }
}

function removeChildren(p) {
  while (p.hasChildNodes()) {
    p.removeChild(p.firstElementChild);
  }
}

function appendAtIndex(parent, child, index) {
  if (!index) index = 0
  if (index >= parent.children.length) {
    parent.appendChild(child)
  } else {
    parent.insertBefore(child, parent.children[index])
  }
}

exports.pointerEventListener = pointerEventListener;
exports.newSVGNode = newSVGNode;
exports.px2int = px2int;
exports.px2float = px2float;
exports.flattenSVG = flattenSVG;
exports.RectAsPath = RectAsPath;
exports.removeChildren = removeChildren;
exports.appendAtIndex = appendAtIndex;
