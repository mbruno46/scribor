import store from '@/hooks/store'

export function saveNotebook(name) {
  var content = JSON.stringify(store.notebook,null,2);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

  var a = document.createElement('a');
  a.download = name;
  a.rel = 'noopener'
  a.href = URL.createObjectURL(blob);
  a.click();
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

export function saveAsPDF(name) {
  console.log(name);
}

export default {
  saveNotebook,
  loadNotebook,
  saveAsPDF
}