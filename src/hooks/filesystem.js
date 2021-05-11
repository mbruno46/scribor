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

function uint2buffer(i) {
  let out = new ArrayBuffer(4);
  let view = new Uint32Array(out);
  view[0] = i;
  return out;
}

function buffer2uint(b) {
  let out = new Uint32Array(b);
  return out[0];
}

export function saveNotebook(name) {
  let tmp = JSON.stringify(store.notebook, null, 2)
  var content = [uint2buffer(tmp.length), tmp];

  let i=0;
  let j=0;

  // despite async blob.arrayBuffer() this guarantees images are written with proper order
  function next() {
    let m = store.notebook.length;
    let n = store.notebook[i].images.length;
    
    if (j==n-1) {
      if (i==m-1) {return;}
      else {
        i++;
        j=0;
        next();
        return;
      }
    }

    store.notebook[i].images[j].blob.arrayBuffer().then(buffer => {
      content.push(uint2buffer(buffer.byteLength));
      content.push(buffer);

      j++;
      next();
    });

    return;
  }
  next();

  var debounce_saveBlob = _.debounce(function(content,name) {
    const blob = new Blob(content);
    saveBlob(blob, name);
  }, 400); //4secs

  debounce_saveBlob(content, name);
}


export function loadNotebook(file) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onloadend = function() {
    let res = reader.result;
    let len = buffer2uint(res.slice(0,4));
    const tmp = JSON.parse(new TextDecoder().decode(new Uint8Array(res.slice(4,4+len))));
    store.notebook.length = 0;
    tmp.forEach(page => {
      store.notebook.push(page);
    });
    
    let ofs = 4+len;
    store.notebook.forEach(page => {
      for (var i=0;i<page.images.length-1;i++) {
        len = buffer2uint(res.slice(ofs,ofs+4));
        let buf = res.slice(ofs+4,ofs+4+len);

        page.images[i].blob = new Blob([buf], {type: page.images[i].type});
        page.images[i].url = URL.createObjectURL(page.images[i].blob);

        ofs += 4+len;
      }
    });
    console.log(store)

    store.pages.focus = 0;
    store.pages.total = store.notebook.length;    
  }
}

export async function saveNotebookAsPDF(dest) {
  var stream = await exportPDF(store.notebook, store.viewport);

  stream.on('finish', function() {
    const url = stream.toBlobURL('application/pdf');

    var a = document.createElement('a');
    a.download = dest;
    a.rel = 'noopener';
    a.href = url;

    a.click();
  });
}

function getImageBBox(url) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = function() {
      let bbox = {
        width: this.width, 
        height: this.height, 
        ratio: this.height/this.width,
      };
      resolve(bbox);
    }
  
    img.src = url;  
  });
}

export function loadImage(file) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  
  const images = store.notebook[store.pages.focus].images;

  reader.onloadend = function() {
    let n = images.length;
    images[n-1].blob = new Blob([reader.result], {type: file.type});
    images[n-1].type = file.type;
    images[n-1].url = URL.createObjectURL(images[n-1].blob);

    images[n-1].x = 20;
    images[n-1].y = 20;

    getImageBBox(images[n-1].url).then(resolve => {
      images[n-1].ratio = resolve.ratio;
      images[n-1].width = (resolve.width > 250) ? 250 : resolve.width;
      images[n-1].height = Math.round(resolve.ratio * images[n-1].width);
  })

  };
}

export default {
  saveNotebook,
  loadNotebook,
  loadImage,
  saveNotebookAsPDF
}