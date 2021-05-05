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

export function loadImage(file) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  console.log(file)
  
  const images = store.notebook[store.pages.focus].images;

  reader.onloadend = function() {
    let n = images.length;
    images[n-1].blob = new Blob([reader.result], {type: file.type});
    images[n-1].url = URL.createObjectURL(images[n-1].blob);
    images[n-1].x = 0;
    images[n-1].y = 0;
    images[n-1].width = 200;
    images[n-1].height = 200;
  };
}

export default {
  saveNotebook,
  loadNotebook,
  loadImage,
  saveNotebookAsPDF
}