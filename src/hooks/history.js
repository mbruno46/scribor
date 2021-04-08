import store from './store'
import { toRaw } from 'vue'

const layers = ['penstrokes','highlighterstrokes','latex'];
const NMAX = 20;

function History() {
  var at = 0;
  var history = [];

  // data = {penstrokes: [3,4]}
  function State(page, add, data) {
    var s = {
      page,
      add
    }

    layers.forEach(key => {
      s[key] = [];
      data[key].forEach(element => {
        let clone = Object.assign({}, toRaw(store[key].value[element]));
        s[key].push( [element, clone] )
      })
    })

    return s;
  }

  function setState(dir) {
    console.log(at,history)

    let s = history[at];
    let rm = Boolean((s.add + dir) % 2);
    store.pages.focus = s.page;
    layers.forEach(key => {
      s[key].forEach(element => {
        if (rm) {
          let idx = element[0];
          store[key].value.splice(idx,1);
        } else {
          store[key].value.splice(element[0], 0, element[1]);
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

      let s = State(store.pages.focus, args[0], data);
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
