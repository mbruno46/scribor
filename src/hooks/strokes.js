import pointertools from './pointertools'
import { optimize, bezier, smoother } from './sketchtools'
// import store from './store'

export default function Stroke() {
  var s;
  var n;
  var drawing = false;
  var strokes;

  function init(_strokes) {
    strokes = _strokes;
  }

  function start(e) {
    e = e || e.originalEvent || window.event;
    if (e.target.parentElement.parentElement.id!="page") {return;}
    e.preventDefault();

    drawing = true;
    n = strokes.length;
    let p = pointertools.position(e);
    // strokes.push({d: `M ${p.x} ${p.y}`, color:'red', size: 2});
    strokes[n-1].d = `M ${p.x} ${p.y}`;
    s = smoother(2,[p.x, p.y]);

    console.log(e);
  }

  function move(e) {
    if (!drawing) {return;}

    e.preventDefault();
    let p = pointertools.position(e);
    s.addPoint([p.x,p.y]);
    strokes[n-1].d = optimize(s.getPoints(), bezier);
  }

  function end() {    
    if (drawing) {
      strokes[n-1].d = optimize(s.finalizePoints(), bezier);
      strokes.push({d:'', color: strokes[n-1].color, size: strokes[n-1].size});
    }
    s = null;
    drawing = false;
  }

  return {
    init,
    start,
    move,
    end
  }
}