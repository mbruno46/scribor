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

exports.pointerEventListener = pointerEventListener;
