import _ from 'lodash'
import store from '@/hooks/store'

var page;

function init(p) {page=p;}

function position(event) {
  var touches = event.touches;
  let box = page.getBoundingClientRect();
  var scale = store.viewport.scale;
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

  function on() {
    pointerEventListener('down', page, start, true);
    pointerEventListener('move', page, throttled_move, true);
    pointerEventListener('up leave', document, end, true);
  }

  function off() {
    pointerEventListener('down', page, start, false);
    pointerEventListener('move', page, throttled_move, false);
    pointerEventListener('up leave', document, end, false);
  }

  return {
    on,
    off
  }
}

export function safedown(e) {
  // prevents drawing if right click
  if (e.which == 3) {return;}

  e = e || e.originalEvent || window.event;
  if (e.target.parentElement.parentElement.id!="page") {return false;}

  // mobile/tablet: if two fingers does not start event
  var touches = e.touches;
  let ntouches = touches ? touches.length : 1;
  if (ntouches > 1) {return false;}

  e.preventDefault();
  return true;
}

export function safemove(e) {
  e.preventDefault();
  let p = position(e);
  return p;
}

export default {
  layer,
  position,
  init,
  safedown,
  safemove
}