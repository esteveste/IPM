'use strict';
let a = ["h.gif","h2.gif","d.gif","d2.gif","d3.gif","d4.gif","d5.gif","f2.gif","f.gif","f3.gif","f4.gif","f5.gif","N.gif","s1.gif"];

function changeBackground(){
  document.getElementById("body").style.background = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8) ),url(${a[Math.floor(Math.random() * a.length)]})`;
  document.getElementById("body").style.backgroundRepeat= "no-repeat";
  document.getElementById("body").style.backgroundSize= "cover";
  setTimeout(changeBackground,7000);
}
changeBackground();
