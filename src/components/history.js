
var NMAX;
var history = [];
var idx;
var at;
var parent;

function reset(_parent, nmax=100) {
  parent = _parent;
  NMAX = nmax;
  history.splice(0, history.length);
  idx = 0;
  at = -1;
}

function setState() {
  let tmp = history[idx];
  parent.innerHTML = tmp.data;
}


function recordState() {
  const data = parent.innerHTML;

  const state = history[idx];
  if (state) {
    if (state.data == data) return;
  }

  at++;
  history[at] = {data};
  history.splice(at+1); // like allocation

  if (at > NMAX) {
    at = -1;
    history.splice(0,1);
  }

  idx = at;
}

function getPreviousState() {
  if (idx > 0) {
    idx--;
  }
  setState();
}

function getNextState() {
  if (idx < at) {
    idx++;
  }
  setState();
}

exports.reset = reset;
exports.getPreviousState = getPreviousState;
exports.getNextState = getNextState;
exports.recordState = recordState;
