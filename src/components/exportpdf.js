const fs = require('fs');
const PDFDocument = require('pdfkit');
// const PDFDocument = require('electron').remote.require('pdfkit');
const utils = require('./utils.js');


function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function exportPDF(nb, dest) {
  var doc = new PDFDocument({size: "A4"});
  doc.pipe(fs.createWriteStream(dest));

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
                .lineWidth(utils.px2float(css.strokeWidth))
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
              .lineWidth(utils.px2float(css.strokeWidth))
              .lineCap(css.strokeLinecap)
              .strokeOpacity(css.opacity)

            if (css.fill != "none") {
              doc.fillAndStroke(rgb2hex(css.fill),rgb2hex(css.stroke))
            } else {
              doc.strokeColor(rgb2hex(css.stroke))
            }
            doc.stroke();
          }

          // latex; we assume all paths inside
          if (tag == 'g' && el.hasAttribute('latex')) {
            for (var l=0;l<el.children.length;l++) {
              let p = el.children[l];
              console.log(p.getAttribute('d'));
              doc.path(p.getAttribute('d'))
                .fill(rgb2hex(css.fill))
            }
          }
        }
      }
    }
  }

  doc.end();
}

exports.exportPDF = exportPDF;
