//
//  Load the packages needed for MathJax
//
const {mathjax} = require('mathjax-full/js/mathjax.js');
const {TeX} = require('mathjax-full/js/input/tex.js');
const {SVG} = require('mathjax-full/js/output/svg.js');
const {liteAdaptor} = require('mathjax-full/js/adaptors/liteAdaptor.js');
const {RegisterHTMLHandler} = require('mathjax-full/js/handlers/html.js');

const {AllPackages} = require('mathjax-full/js/input/tex/AllPackages.js');

const {flattenSVG} = require('./utils.js');

//
//  Create DOM adaptor and register it for HTML documents
//
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

//
//  Create input and output jax and a document using them on the content from the HTML file
//
const tex = new TeX({
  packages: AllPackages.sort().join(', ').split(/\s*,\s*/),
  inlineMath: [['$', '$'], ['\\(', '\\)']]
});
const svg = new SVG({fontCache: 'none'});
const html = mathjax.document('', {InputJax: tex, OutputJax: svg});


function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

export function TeXBox(latex,point,scale=1) {
  //
  //  Typeset the math from the command line
  //
  const node = html.convert(latex, {
    display: true, //displaystyle by default
    em: 16, //opts.em,
    ex: 8, //opts.ex,
    containerWidth: 80*16, //opts.width
  });

  var el = createElementFromHTML(adaptor.outerHTML(node));
  let _scale = scale * 0.025;
  let newpaths = flattenSVG(el.children[0].children[0], [`translate(${point[0]},${point[1]}) scale(${_scale} ${_scale})`]);

  var d = '';
  for (var i=0;i<newpaths.length;i++) {
    d += newpaths[i].getAttribute('d');
  }
  return d;
}

export default {
  TeXBox
}