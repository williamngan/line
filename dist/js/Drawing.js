"use strict";

var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};

var space = new CanvasSpace("demo", false).display();

// Load file

function qs(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function start(App) {
  if (App) {
    var app = new App().init(space);

    space.refresh(false);
    //space.ctx.globalCompositeOperation = "destination-over";

    space.add(app);
    space.bindMouse();
    space.play();
    space.stop(100000);
  }
}

var qfile = qs("name");

if (qfile) {
  if (qfile.indexOf("/") >= 0 || qfile.split(".").length > 2) qfile = "";

  /*
  let src = document.createElement('script');
  src.setAttribute("type", "text/javascript");
  src.setAttribute("id", "src");
  src.setAttribute("src", "./dist/js/lines/" + qfile + ".js");
    if (src) document.querySelector("body").appendChild( src );
  src.onload = function () {
    console.log( "starting "+qfile);
    start( window[qfile] );
  };
  */

  var link = document.createElement("a");
  link.setAttribute("href", "https://github.com/williamngan/pg/blob/master/src/js/lines/" + qfile + ".js");
  link.setAttribute("target", "_blank");
  link.textContent = "View source code.";

  start(window[qfile]);
}