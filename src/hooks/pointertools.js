import _ from 'lodash'

var scale = 1.0;
var page;

function setScale(s) {
  scale = s;
}

function init(p) {page=p;}

function position(event) {
  var touches = event.touches;
  let box = page.getBoundingClientRect()
  return {
    x: Math.round((touches ? touches[0].clientX : event.clientX) - box.left)/scale,
    y: Math.round((touches ? touches[0].clientY : event.clientY) - box.top)/scale,
    pressure: (touches ? touches[0].force : event.pressure || 0.5)
  }
}

function pointerEventListener(events, el, handler, add = true, options = false) {
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

export function layer(start, move, end) {
  var throttled_move = _.throttle(move, 16);

  function on(p) {
    pointerEventListener('down', p, start, true);
    pointerEventListener('move', p, throttled_move, true);
    pointerEventListener('up leave', p, end, true);
  }

  function off(p) {
    pointerEventListener('down', p, start, false);
    pointerEventListener('move', p, throttled_move, false);
    pointerEventListener('up leave', document, end, false);
  }

  return {
    on,
    off
  }
}

export default {
  layer,
  position,
  init,
  setScale
}