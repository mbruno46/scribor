// https://github.com/szimek/signature_pad/blob/master/src/signature_pad.ts

import _ from 'lodash'
import store from '@/hooks/store'

var page;

function init(p) {page=p;}

function position(event) {
  var touches = event.targetTouches;
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

  var cmd, types; 
  //var pointer, touch, mspointer;

  // pointer = window.PointerEvent;
  // mspointer = window.MSPointerEvent;
  // touch = !pointer && !mspointer && window.TouchEvent;
  cmd = (add) ? el.addEventListener : el.removeEventListener;

  types = {
    pointer : { over: 'pointerover', down: 'pointerdown', move: 'pointermove', up: 'pointerup', leave: 'pointerleave' },
    // mouse :   { over: 'mouseover', down: 'mousedown', move: 'mousemove', up: 'mouseup', leave: 'mouseleave' },
    // touch :   { over: 'touchstart', down: 'touchstart', move: 'touchmove', up: 'touchend', leave: 'touchcancel' },
    // MSPointer:{ over: 'MSPointerOver', down: 'MSPointerDown', move: 'MSPointerMove', up: 'MSPointerUp', leave: 'MSPointerLeave' }
  }

  events.forEach(function(event) {
    cmd(types['pointer'][event], handler, options);
    // if (mspointer) {
    //   cmd(types['MSPointer'][event], handler, options);
    // }
    // else if (touch){
    //   cmd(types['touch'][event], handler, options);
    // }
    // else if (!pointer && !mspointer) {
    //   cmd(types['mouse'][event], handler, options);
    // }
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
  if (e.which == 3) {return false;}

  e = e || e.originalEvent || window.event;
  if (safetarget(e).parentElement.parentElement.id!="page") {
    return false;
  }

  // mobile/tablet: pen draws, touch not
  if (e.pointerType=='touch') {return false;}

  e.preventDefault();
  return true;
}

export function safemove(e) {
  e.preventDefault();
  let p = position(e);
  return p;
}

export function safetarget(e) {
  var touches = e.changedTouches;
  let x = (touches ? touches[0].clientX : e.clientX);
  let y = (touches ? touches[0].clientY : e.clientY);
  return document.elementFromPoint(x, y);
}

export default {
  layer,
  position,
  init,
  safedown,
  safemove,
  safetarget
}