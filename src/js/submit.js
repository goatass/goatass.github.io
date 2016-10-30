"use strict";

var superagent = require('superagent');
var api = 'https://hooks.zapier.com/hooks/catch/1763103/67gzqx/';
var button = document.getElementById('js-submit');
var form = document.getElementById('js-form');

form.addEventListener('submit', function (ev) {
  ev.preventDefault();
  button.setAttribute('disabled', true);
  var email = document.getElementById('js-inlineLabel-input').value;
  superagent.post(api)
  .type('form')
  .send({ email: email, date: new Date().toString() })
  .set('Accept', 'application/json')
  .end(function (err, res) {
    button.setAttribute('disabled', null);
    if (err || !res.ok) {
      alert('エラーが発生しました。もう一度送信してください。');
    } else {
      alert('送信完了しました');
    }
  });
}, false);
