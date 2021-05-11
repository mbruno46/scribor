import { toRaw } from 'vue'
import store from "./store";
import _ from 'lodash'

const layers = ['penstrokes','highlighterstrokes','latex'];
const NMAX = 20;

var at = -1;
var history = [];

function currentState() {
  var s = {
    page: store.pages.focus,
  };
  layers.forEach(key=>{
    s[key] = _.cloneDeep(toRaw(store[key].value));
  });
  return s;
}


export function checkpoint() {
  let s = currentState();

  at++;
  console.log('splice',at,history.length - at)
  history.splice(at, history.length - at, s)

  if (at==NMAX) {
    history.splice(0,1);
    at--;
  }
}

function setState() {
  let s = history[at];
  console.log(at, history);

  layers.forEach(key=>{
    store.notebook[s.page][key] = _.cloneDeep(s[key]);
  });

  store.pages.focus = s.page;
}

export function previousState() {
  if (at==0) {return;}
  at--;
  setState();
}

export function nextState() {
  if (at==history.length-1) {return;}
  at++;
  setState();
}

export default {
  previousState,
  nextState,
  checkpoint
}