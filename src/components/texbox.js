//
//  Load the packages needed for MathJax
//
const {mathjax} = require('mathjax-full/js/mathjax.js');
const {TeX} = require('mathjax-full/js/input/tex.js');
const {SVG} = require('mathjax-full/js/output/svg.js');
const {liteAdaptor} = require('mathjax-full/js/adaptors/liteAdaptor.js');
const {RegisterHTMLHandler} = require('mathjax-full/js/handlers/html.js');
const {AssistiveMmlHandler} = require('mathjax-full/js/a11y/assistive-mml.js');

const {AllPackages} = require('mathjax-full/js/input/tex/AllPackages.js');

const {newSVGNode, flattenSVG} = require('./utils.js');

const opts = {
  em: {
    default: 16,
    describe: 'em-size in pixels'
  },
  ex: {
    default: 8,
    describe: 'ex-size in pixels'
  },
  width: {
    default: 80 * 16,
    describe: 'width of container in pixels'
  },
};

//
//  Create DOM adaptor and register it for HTML documents
//
const adaptor = liteAdaptor();
const handler = RegisterHTMLHandler(adaptor);
// AssistiveMmlHandler(handler);

//
//  Create input and output jax and a document using them on the content from the HTML file
//
const tex = new TeX({packages: AllPackages.sort().join(', ').split(/\s*,\s*/)});
const svg = new SVG({fontCache: 'none'});
const html = mathjax.document('', {InputJax: tex, OutputJax: svg});


function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

function TeXBox(latex,color,scale=1) {
  //
  //  Typeset the math from the command line
  //
  const node = html.convert(latex, {
    display: false,
    em: 16, //opts.em,
    ex: 8, //opts.ex,
    containerWidth: 80, //opts.width
  });

  var el = createElementFromHTML(adaptor.outerHTML(node));
  // mjx-container.svg.g (stroke etcc).g(mml-data=math)
  scale *= 0.025;
  let newpaths = flattenSVG(el.children[0].children[0], [`translate(90,90) scale(${scale} ${scale})`]);

  var texbox = newSVGNode('g',{latex: latex, fill: color});
  for (var i=0;i<newpaths.length;i++) {
    texbox.appendChild(newpaths[i]);
  }

  return texbox;
}

exports.TeXBox = TeXBox;
