const { shell } = require('electron')

function create(tag, attrs, styles, t) {
  let el = document.createElement(tag);
  for (var a in attrs) {
    el.setAttribute(a, attrs[a]);
  }
  for (var s in styles) {
    el.style[s] = styles[s];
  }
  if (t) {
    el.textContent = t;
  }
  return el;
}

function addEntry(text) {
  let div = create('div',null,{display: 'flex', margin: '4px 0 4px 0', alignItems: 'center'});
  let s = create('span', null, {width: '180px', paddingLeft: '8px', textAlign: 'center'}, text);
  div.appendChild(s);
  return div;
}

function firePopup(children) {
  let popup = document.createElement('div');
  popup.classList.add('pref-popup');
  document.body.appendChild(popup);

  for (var i=0;i<children.length;i++) {
    popup.appendChild(children[i]);
  }

  let btns = create('div',null,{textAlign: 'right', borderTop: '1px solid var(--border)'});

  let cancel = document.createElement('button');
  cancel.textContent = 'Cancel';
  cancel.style.margin = '4px'
  cancel.onclick = ev => {
    document.body.removeChild(popup);
  }
  btns.appendChild(cancel);

  let ok = document.createElement('button');
  ok.textContent = 'Apply';
  ok.style.margin = '4px';
  ok.onclick = ev => {
    document.body.removeChild(popup);
  }
  btns.appendChild(ok);

  popup.appendChild(btns);

  return [popup, cancel, ok];
}

function fireCoverPagePreferences(opts) {
  var div, el1, el2;
  var all = [];

  let t = create('span', null, {
    minWidth: '100%',textAlign: 'center',
    padding: '8px', borderBottom: '1px solid var(--border)'
  }, 'Preferences Cover Page');
  all.push(t);

  div = addEntry('Cover page style');
  el1 = create('select',{name: 'cover-style'});
  el1.appendChild(create('option',{value: ['var(--cover-page-blue)','yellow','red']},null,'Blue'));
  el1.appendChild(create('option',{value: ['var(--cover-page-green)','orange','purple']},null,'Green'));
  el1.appendChild(create('option',{value: ['var(--cover-page-red)','cyan','green']},null,'Red'));
  el1.value = opts.coverPageStyle;
  div.appendChild(el1);
  all.push(div);

  div = addEntry('Image');
  el2 = create('select',{name: 'image'});
  el2.appendChild(create('option',{value: 1},null,'Particle collision'));
  el2.appendChild(create('option',{value: 2},null,'Feynman diagram'));
  el2.appendChild(create('option',{value: 0},null,'None'));
  el2.value = opts.image;
  div.appendChild(el2);
  all.push(div);

  return new Promise(function(resolve, reject) {
    let [popup, cancel, ok] = firePopup(all);

    cancel.onclick = ev => {
      document.body.removeChild(popup);
      resolve("do-nothing");
    }

    ok.onclick = ev => {
      document.body.removeChild(popup);
      resolve({
        coverPageStyle: el1.value.split(','),
        image: el2.value,
      });
    }
  });
}

function firePagePreferences(opts) {
  var div1, div2, el1, el2;

  let t = create('span', null, {
    minWidth: '100%',textAlign: 'center',
    padding: '8px', borderBottom: '1px solid var(--border)'
  }, 'Preferences ' + 'Page ' + opts.idx);

  div1 = addEntry('Ruling style');
  el1 = create('select',{name: 'ruling'});
  el1.appendChild(create('option',{value: 'ruled'},null,'Ruled'));
  el1.appendChild(create('option',{value: 'grid'},null,'Grid'));
  el1.value = opts.ruling;
  div1.appendChild(el1);

  div2 = addEntry('Background color');
  el2 = create('select',{name: 'ruling'});
  el2.appendChild(create('option',{value: 'white'},null,'White'));
  el2.appendChild(create('option',{value: 'var(--page)'},null,'Yellow'));
  el2.value = opts.bgcolor;
  div2.appendChild(el2);

  return new Promise(function(resolve, reject) {
    let [popup, cancel, ok] = firePopup([t, div1, div2]);

    cancel.onclick = ev => {
      document.body.removeChild(popup);
      resolve("do-nothing");
    }

    ok.onclick = ev => {
      document.body.removeChild(popup);
      resolve({
        ruling: el1.value,
        bgcolor: el2.value,
      });
    }
  });
}

function fireLatexEditor(createLatex, text='', color='var(--pen-color-blue)', size=1.0) {

  let t = create('span', null, {
    minWidth: '100%',textAlign: 'center',
    padding: '8px', borderBottom: '1px solid var(--border)'
  }, 'LaTeX');

  let div1 = addEntry('Font color');
  let s = create('select',{name: 'latex-font-color'});
  s.appendChild(create('option',{value: 'var(--pen-color-blue)'},null,'Blue'));
  s.appendChild(create('option',{value: 'var(--pen-color-red)'},null,'Red'));
  s.appendChild(create('option',{value: 'black'},null,'Black'));
  s.value = color;
  div1.appendChild(s);

  let div2 = addEntry('Font size');
  let s2 = create('select',{name: 'latex-font-color'});
  s2.appendChild(create('option',{value: 1.0},null,'Medium'));
  s2.appendChild(create('option',{value: 2.0},null,'Large'));
  s2.appendChild(create('option',{value: 0.5},null,'Small'));
  s2.value = size;
  div2.appendChild(s2);

  let editor = create('textarea', {rows: 2, cols: 40}, {
    margin: '8px', border: '1px solid var(--border)'});
  editor.value = text;
  editor.focus();

  return new Promise(function(resolve, reject) {
    let [popup, cancel, ok] = firePopup([t, div1, div2, editor]);

    cancel.onclick = ev => {
      document.body.removeChild(popup);
      resolve("done");
    }

    ok.onclick = ev => {
      createLatex(editor.value, s.value, s2.value);
      document.body.removeChild(popup);
      resolve("done");
    }
  });
}

function fireUpdate(oldv, newv, url) {

  let t = create('span', null, {
    minWidth: '100%',textAlign: 'center',
    padding: '8px', borderBottom: '1px solid var(--border)'
  }, 'Updates avaiable');

  let div1 = addEntry('Current version');
  div1.appendChild(create('span', null, null, oldv));

  let div2 = addEntry('Available version');
  div2.appendChild(create('span', null, null, newv));

  return new Promise(function(resolve, reject) {
    let [popup, cancel, ok] = firePopup([t, div1, div2]);

    cancel.onclick = ev => {
      document.body.removeChild(popup);
      resolve("do-nothing");
    }

    ok.textContent = 'Download';
    ok.onclick = ev => {
      document.body.removeChild(popup);
      // fire browser
      shell.openExternal(url);
    }
  });
}
exports.fireCoverPagePreferences = fireCoverPagePreferences;
exports.firePagePreferences = firePagePreferences;
exports.fireLatexEditor = fireLatexEditor;
exports.fireUpdate = fireUpdate;
