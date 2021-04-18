import svgpath from 'svgpath'

export function newSVGNode(type, attrs) {
  let el = document.createElementNS("http://www.w3.org/2000/svg", type);
  for (var k in attrs) {el.setAttributeNS(null, k, attrs[k]);}
  return el
}


export function RectAsPath(x,y,w,h,rx,ry) {
  let r = x+w;
  let b = y+h;
  let d = `M ${x+rx},${y}`
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


export function flattenSVG(input, trafos = []) {
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

export function pathBBox(d) {
  let p = newSVGNode('path',{d: d});
  let pp = document.getElementById('page');
  pp.appendChild(p);
  let b = p.getBBox();
  pp.removeChild(p);
  return b;
}

export default {
  RectAsPath,
  newSVGNode,
  flattenSVG
}