import store from './store'
import { toRaw } from 'vue'

const layers = ['penstrokes','highlighterstrokes'];
const NMAX = 20;

function History() {
  var at = 0;
  var history = [];

  // data = {penstrokes: [3,4]}
  function State(page, data) {
    var s = {
      page,
      add: store.mode!='eraser',
      penstrokes: [],
      highlighterstrokes: []
    }

    layers.forEach(key => {
      data[key].forEach(element => {
        s[key].push( toRaw(store[key].value[element]) )
      })
    })

    return s;
  }

  function setState(dir) {
    let s = history[at];
    let rm = Boolean((s.add + dir) % 2);
    store.pages.focus = s.page;
    layers.forEach(key => {
      s[key].forEach(element => {
        if (rm) {
          let idx = store[key].value.indexOf(element);
          store[key].value.splice(idx,1);
        } else {
          store[key].value.splice(store[key].value.length-2, 0, element);
        }
      });
    })
  }

  return {
    saveState(...args) {
      var data = {};
      layers.forEach(key => {
        let i = args.indexOf(key)
        if (i > -1) {
          data[key] = args[i+1];
        } else {
          data[key] = [];
        }
      });

      let s = State(store.pages.focus, data);
      history.splice(at, history.length-at, s);
      at++;

      if (at==NMAX) {
        at=NMAX-1;
        history.splice(0,1);
      }
    },
    previousState() {
      if (at==0) {return;}
      at--;
      setState(false);
    },
    nextState() {
      if (at==history.length) {return;}
      setState(true);
      at++;
    }
  }
}

var history = History();

export default history;
