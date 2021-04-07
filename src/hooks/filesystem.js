import store from '@/hooks/store'
import _ from 'lodash'
import { exportPDF } from './exportpdf';

function saveBlob(blob, dest) {
  var a = document.createElement('a');
  a.download = dest;
  a.rel = 'noopener'
  a.href = URL.createObjectURL(blob);

  var debounce_click  = _.debounce(function() {
    a.click()
  },0);
  var debounce_revoke = _.debounce(function() {
    URL.revokeObjectURL(blob)
  }, 4000); //4secs

  debounce_click();
  debounce_revoke();
}

export function saveNotebook(name) {
  var content = JSON.stringify(store.notebook,null,2);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveBlob(blob, name);
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

export function saveNotebookAsPDF(dest) {
  var stream = exportPDF(store.notebook, store.viewport);

  stream.on('finish', function() {
    const url = stream.toBlobURL('application/pdf');

    var a = document.createElement('a');
    a.download = dest;
    a.rel = 'noopener';
    a.href = url;

    a.click();
  });
}

export default {
  saveNotebook,
  loadNotebook,
  saveNotebookAsPDF
}