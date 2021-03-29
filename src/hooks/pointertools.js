var ofs = {left:0, top:0};
var scale = 1.0;

function setOfs(left,top) {
  ofs.left = left;
  ofs.top = top;
}

function setScale(s) {
  scale = s;
}

function position(event) {
  var touches = event.touches;
  return {
    x: Math.round((touches ? touches[0].clientX : event.clientX) - ofs.left)/scale,
    y: Math.round((touches ? touches[0].clientY : event.clientY) - ofs.top)/scale,
    pressure: (touches ? touches[0].force : event.pressure || 0.5)
  }
}

export function pointerEventListener(events, el, handler, add = true, options = false) {
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
}

export default {
  pointerEventListener,
  position,
  setOfs,
  setScale
}