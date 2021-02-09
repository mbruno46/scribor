
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
  let s = create('span', null, {width: '40%', paddingLeft: '8px', textAlign: 'center'}, text);
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

function firePreferences() {
  var div, el;
  var children = [];

  children.push(create('span', null, {
    minWidth: '100%',textAlign: 'center',
    padding: '8px', borderBottom: '1px solid var(--border)'
  }, 'Preferences'));

  div = addEntry('Cover page style');
  el = create('select',{name: 'cover-style'});
  el.appendChild(create('option',{value: 'cyan'},null,'Cyan'));
  el.appendChild(create('option',{value: 'orange'},null,'Orange'));
  el.appendChild(create('option',{value: 'yellow'},null,'Yellow'));
  div.appendChild(el);
  children.push(div);

  div = addEntry('Ruling style');
  let c1 = create('input',{type: 'checkbox', name: 'Rules'});
  div.appendChild(c1);
  div.appendChild(create('label',null,null,'Rules'));
  let c2 = create('input',{type: 'checkbox', name: 'Grid'});
  div.appendChild(c2);
  div.appendChild(create('label',null,null,'Grid'));
  children.push(div);

  let [popup, ok] = firePopup(children);
}

function fireLatexEditor(createLatex) {

  let t = create('span', null, {
    minWidth: '100%',textAlign: 'center',
    padding: '8px', borderBottom: '1px solid var(--border)'
  }, 'LaTeX');

  let editor = create('textarea', {value: '', rows: 2, cols: 40}, {
    width: '100%', padding: '8px', border: '1px solid var(--border)'});

  return new Promise(function(resolve, reject) {
    let [popup, cancel, ok] = firePopup([t, editor]);

    cancel.onclick = ev => {
      document.body.removeChild(popup);
      resolve("done");
    }

    ok.onclick = ev => {
      createLatex(editor.value);
      document.body.removeChild(popup);
      resolve("done");
    }
  });
}

exports.firePreferences = firePreferences;
exports.fireLatexEditor = fireLatexEditor;
