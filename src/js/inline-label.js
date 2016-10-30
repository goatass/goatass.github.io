"use strict";

var wrapper = document.getElementById('js-inlineLabel');
wrapper.addEventListener('click', function(eve) {
  document.getElementById('js-inlineLabel-input').focus();
  wrapper.classList.add('externalLabel');
}, false);
