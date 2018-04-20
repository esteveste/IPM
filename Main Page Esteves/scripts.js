var a = ["h.gif","h2.gif","d.gif","d2.gif"];
document.getElementById("body").style.background = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8) ),url(${a[Math.floor(Math.random() * 4)]})`;
document.getElementById("body").style.backgroundRepeat= "no-repeat";
document.getElementById("body").style.backgroundSize= "cover";
