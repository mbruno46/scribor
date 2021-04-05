import store from '@/hooks/store'
import _ from 'lodash'

export function saveNotebook(name) {
  var content = JSON.stringify(store.notebook,null,2);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

  var a = document.createElement('a');
  a.download = name;
  a.rel = 'noopener'
  a.href = URL.createObjectURL(blob);
  _.debounce(a.click(),0);
  _.debounce(URL.revokeObjectURL(blob), 4000); //4secs
}

export function loadNotebook(file) {
  console.log(file);
  const reader = new FileReader();
  reader.readAsText(file,"UTF-8");

  reader.onloadend = function() {
    const tmp = JSON.parse(reader.result);
    store.notebook.length = 0;
    tmp.forEach(page => {
      store.notebook.push(page);
    })
    store.pages.focus = 0;
    store.pages.total = store.notebook.length;
  };
}

export function saveAsPDF(name) {
  console.log(name);
}

export default {
  saveNotebook,
  loadNotebook,
  saveAsPDF
}