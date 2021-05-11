import pointertools from './pointertools'
import history from '@/hooks/history'

export default function Drag() {
  var moving;
  var moveto = {x0:0, y0:0, x:0, y:0, dx:0, dy:0};
  var t;

  function start(e) {
    if (!pointertools.safedown(e)) {return;}

    moving = true;
    let p = pointertools.position(e);
    moveto.x0 = p.x;
    moveto.y0 = p.y;
    moveto.x = p.x;
    moveto.y = p.y;

    t = pointertools.safetargets(e);
  }

  function move(e, callback) {
    if (!moving) {return}
    let p = pointertools.safemove(e);
    moveto.dx = p.x - moveto.x;
    moveto.dy = p.y - moveto.y;
    moveto.x = p.x;
    moveto.y = p.y;
    callback();
  }

  function end(e) {
    if (!moving) {return}
    e.preventDefault();
    history.checkpoint();
    moving=false;
    moveto = {x0:0, y0:0, x:0, y:0, dx:0, dy:0};
    t = []
  }

  function shift() {return {dx: moveto.dx, dy: moveto.dy}}

  function targets() {return t;}

  return {
    start,
    move,
    end,
    shift,
    targets
  }
}
