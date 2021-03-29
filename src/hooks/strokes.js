import pointertools from './pointertools'
import { optimize, bezier, smoother } from './sketchtools'

export default function initStroke(strokes) {
  var s;
  var n;
  var drawing = false;

  function start(e) {
    drawing = true;
    let p = pointertools.position(e);
    strokes.push({d: `M ${p.x} ${p.y}`, color:'red', size: 2});
    s = smoother(2,[p.x, p.y]);
  }

  function move(e) {
    if (!drawing) {return;}

    let p = pointertools.position(e);
    s.addPoint([p.x,p.y]);
    n = strokes.length;
    strokes[n-1].d = optimize(s.getPoints(), bezier);
  }

  function end() {
    n = strokes.length;
    strokes[n-1].d = optimize(s.finalizePoints(), bezier);
    s = null;
    drawing = false;
  }

  return {
    start,
    move,
    end
  }
}