import PDFDocument from 'pdfkit/js/pdfkit.standalone';
import blobStream from 'blob-stream';

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function px2float(px) {
  return parseFloat(px.replace(/px/,''))
}

export function exportPDF2(nb, dest) {
  var doc = new PDFDocument({size: "A4"});
  var stream = doc.pipe(blobStream());
  console.log(nb);
  var i, j, k;
  // loop over pages
  for (i=0;i<nb.children.length;i++) {
    let page = nb.children[i];
    if (i>0) {
      doc.addPage({size: "A4"});
    }

    // loop over layers [<g ...></g>]
    for (j=0;j<page.children.length;j++) {
      if (page.children[j].id.substring(0,5) == 'layer') {

        // loop over elements in layer
        for (k=0;k<page.children[j].children.length;k++) {
          let el = page.children[j].children[k];

          let tag = el.tagName.toLowerCase();
          let css = getComputedStyle(el);

          if (tag == 'rect') {
            if (css.stroke != "none") {
              doc.rect(el.getAttribute('x'), el.getAttribute('y'), el.getAttribute('width'), el.getAttribute('height'))
                .lineWidth(px2float(css.strokeWidth))
                .fillAndStroke(rgb2hex(css.fill),rgb2hex(css.stroke))
                .stroke();
            }
            else {
              doc.rect(el.getAttribute('x'), el.getAttribute('y'), el.getAttribute('width'), el.getAttribute('height'))
                .fill(rgb2hex(css.fill))
                .stroke();
            }
          }
          if (tag == 'path') {
            doc.path(el.getAttribute('d'))
              .lineWidth(px2float(css.strokeWidth))
              .lineCap(css.strokeLinecap)
              .strokeOpacity(css.opacity)

            if (css.fill != "none" && css.stroke != "none") {
              doc.fillAndStroke(rgb2hex(css.fill),rgb2hex(css.stroke))
            }
            else {
              if (css.fill != "none") {doc.fill(rgb2hex(css.fill))}
              if (css.stroke != "none") {doc.strokeColor(rgb2hex(css.stroke))}
            }
            doc.stroke();
          }

        }
      }
    }
  }

  doc.end();

  stream.on('finish', function() {
    const url = stream.toBlobURL('application/pdf');

    var a = document.createElement('a');
    a.download = dest;
    a.rel = 'noopener';
    a.href = url;

    a.click();
  });
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
  '--page': rgb2hex('rgb(240,230,180)'),
  'white': '#FFFFFF'
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

function bg2pdf(doc, bg) {
  let c = bg.color.replace(/var\((.*)\)/,'$1');
  console.log(c);
  // doc.rect(0,0,store.viewport.width,store.viewport.height)
  //   .fill(colorMap[c])
  //   .stroke()
}

export function exportPDF(notebook) {
  var doc = new PDFDocument({size: "A4"});
  var stream = doc.pipe(blobStream());

  var i, j;
  for (i=0;i<notebook.length;i++) {
    if (i>0) {
      doc.addPage({size: "A4"});

      bg2pdf(doc,notebook[i].background);
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
  }
  doc.end();

  return stream;
}