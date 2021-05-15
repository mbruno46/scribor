import PDFDocument from 'pdfkit/js/pdfkit.standalone';
import blobStream from 'blob-stream';
import store from '@/hooks/store'

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

const colorMap = {
  '--pen-color-yellow': '#FFFF33',
  '--pen-color-orange': '#FFA500',
  '--pen-color-green': '#98FB98',
  '--pen-color-blue': '#204d74',
  '--pen-color-red': '#ac3235',
  '--pen-color-cyan': '#b4e7f8',
  '--pen-color-black': '#00000',
  '--cover-page-blue': rgb2hex('rgb(41,104,207)'),
  '--cover-page-green': '#a0c97a',
  '--cover-page-red': '#db6f4b',
  '--vrule': rgb2hex('rgb(220,156,126)'),
  '--hrule': rgb2hex('rgb(160,190,200)'),
  '--page-yellow': rgb2hex('rgb(240,230,180)'),
  '--page-white': '#FFFFFF'
};

function stroke2pdf(doc,path,size=null,opacity='1') {
  if (path.d=='') {return;}
  let c = colorMap[`--pen-color-${path.color}`];

  doc.path(path.d)
    .lineWidth((size==null) ? path.size : size)
    .lineCap('round')
    .strokeColor(c)
    .strokeOpacity(opacity)

  doc.stroke()
}

function path2pdf(doc,path,stroke=null) {
  if (path.d=='') {return;}
  let c = colorMap[`--pen-color-${path.color}`];
  console.log(c);

  doc.path(path.d)

  if (stroke==null) {
    doc.fill(c)
  }
  
  doc.stroke()
}

async function img2pdf(doc, img) {
  let buffer = await img.blob.arrayBuffer();
  doc.image(buffer, img.x, img.y, {fit: [img.width, img.height+1]});
}


function bg2pdf(doc, bg, size, cover) {
  let key = ((cover) ? '--cover-page-' : '--page-') + bg.color;
  doc.rect(0,0,size.width,size.height)
    .fill(colorMap[key])
    .stroke();

  var i;
  for (i=0;i<bg.paths.length;i++) {
    let p = bg.paths[i];
    doc.path(p.d)
    .lineWidth(p.width)
    .fillAndStroke(p.fill,p.color)
    .stroke()
  }

  for (i=0;i<bg.rules.length;i++) {
    let r = bg.rules[i];
    doc.path(r.d)
    .lineWidth('0.4')
    .strokeColor(colorMap[`--${r.color}`])
    .stroke()
  }
}

export async function exportPDF(notebook, size) {
  var doc = new PDFDocument({size: "A4"});
  var stream = doc.pipe(blobStream());

  let pb = store.progressbar.value;
  pb.status = true;
  pb.value = 0;

  var i, j;
  for (i=0;i<notebook.length;i++) {
    if (i>0) {
      doc.addPage({size: "A4"});
    }
    bg2pdf(doc,notebook[i].background,size,i==0);

    let img = notebook[i].images;
    for (j=0;j<img.length-1;j++) {
      await img2pdf(doc, img[j]);
    }
    
    let ps = notebook[i].penstrokes;
    for (j=0;j<ps.length;j++) {
      stroke2pdf(doc,ps[j]);
    }

    let hs = notebook[i].highlighterstrokes;
    for (j=0;j<hs.length;j++) {
      stroke2pdf(doc, hs[j], '16', '0.7');
    }

    let l = notebook[i].latex;
    for (j=0;j<l.length;j++) {
      path2pdf(doc, l[j]);
    }

    pb.value = Math.round(i / notebook.length * 100);
  }
  pb.status = false;
  pb.value = 0;

  doc.end();

  return stream;
}