const {fireUpdate} = require('./popup.js');

var url = 'https://raw.githubusercontent.com/mbruno46/scribor/main/package.json';
var release = 'https://github.com/mbruno46/scribor/releases';

function convertVersion(v) {
  var _v = v.split('.');
  return parseInt(_v[0])*100 + parseInt(_v[1])*10 + parseInt(_v[2]);
}

function checkVersion(v) {
  var nv;
  cv = convertVersion(v);
  // nv = convertVersion(vv);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      let nv = convertVersion(data.version);
      if (nv > cv) {
        console.log('new version available');
        fireUpdate(v, data.version, release);
      }
    });
}

exports.checkVersion = checkVersion;
