import store from './store'
import { toRaw } from 'vue'

const layers = ['penstrokes','highlighterstrokes','latex'];
const NMAX = 20;

function isEmpty(obj) {
  return obj.length === 0;
}

function History() {
  var at = 0;
  var history = [];
  var state = null;
  
  // before = {penstrokes: [3,4]}
  // after = {penstrokes: [{d:'..},{...}]}
  function newState(page) {
    state = {
      page,
      before: {},
      after: {}
    };
    layers.forEach(key => {
      state.before[key] = [];
      state.after[key] = [];
    });
  }

  function save(beforeafter, data) {
    layers.forEach(key => {
      data[key].sort().forEach(element => {
        let clone = Object.assign({}, toRaw(store[key].value[element]));
        state[beforeafter][key].push( [element, clone] )
      })
    })
  }

  function setState(undo) {
    let s = history[at];
    store.pages.focus = s.page;
    console.log(history);

    layers.forEach(key => {
      if (undo) {
        if (!isEmpty(s.after[key])) {
          s.after[key].slice().reverse().forEach(element => {
            let idx = element[0];
            store[key].value.splice(idx,1);
          });
        }

        if (!isEmpty(s.before[key])) {
          s.before[key].forEach(element => {
            let idx = element[0];
            store[key].value.splice(idx,0,element[1]);
          });
        }
      } else {
        if (!isEmpty(s.before[key])) {
          s.before[key].slice().reverse().forEach(element => {
            let idx = element[0];
            store[key].value.splice(idx,1);
          });
        }

        if (!isEmpty(s.after[key])) {
          s.after[key].forEach(element => {
            let idx = element[0];
            store[key].value.splice(idx,0,element[1]);
          });
        }
      }
    });
  }

  return {
    saveState(...args) {
      var after = args[0];
      var data = {};
      layers.forEach(key => {
        let i = args.indexOf(key)
        if (i > -1) {
          data[key] = args[i+1];
        } else {
          data[key] = [];
        }
      });

      if (state==null) {newState(store.pages.focus);}
      save((after) ? 'after' : 'before', data);

      if (after) {
        history.splice(at, history.length-at, state);
        at++;

        if (at==NMAX) {
          at=NMAX-1;
          history.splice(0,1);
        }

        state = null;
      }
    },
    previousState() {
      if (at==0) {return;}
      at--;
      setState(true);
    },
    nextState() {
      if (at==history.length) {return;}
      setState(false);
      at++;
    }
  }
}

var history = History();

export default history;
