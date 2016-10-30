"use strict";

require('./styles/index.scss');

var superagent = require('superagent');
var logoPath = require('./goatass.svg');

superagent.get(logoPath).end(function (err, res) {
  var wrapper = document.getElementById('js-goatassImg');
  wrapper.innerHTML = res.text;
  var gsap = require('gsap');
  var ass = document.getElementById("ass");
  gsap.TweenMax.to(ass, 1.6, {
    rotation: 360,
    ease: 'linear',
    transformOrigin: "center center",
    repeat: -1,
    repeatDelay: 0,
    yoyo: false,
  });
  gsap.TweenMax.to(ass, 0.4, {
    scale: 0.9,
    transformOrigin: "center center",
    repeat: -1,
    repeatDelay: 0,
    yoyo: true,
  });
});
