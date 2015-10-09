"use strict";

(function () {
  var roll = Roll.verticalScroller("#wrapper", "#pane", ".step", 100);
  var views = document.querySelectorAll(".step");
  var viewport = document.querySelector("#wrapper");
  views[0].className = "step curr";

  var space = new CanvasSpace("demo", false).display();
  var line = new BaseLine().init(space);

  /**
   * Get query string
   * @param name
   * @returns {string}
   */
  function qs(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  /**
   * Load Line class
   * @param LineClass
   */
  function updateTo(LineClass) {
    var _temp = line.clone();
    space.remove(line);
    line = new LineClass().init(space);
    line.points = _temp.points;
    space.add(line);
  }

  /**
   * Track roll
   */
  function track() {
    roll.on("step", function (curr, last) {

      var currH = viewport.offsetHeight;
      for (var i = 0; i < roll.steps.length; i++) {
        var cls = Roll.stepName(i, curr);
        views[i].className = "step " + cls;
        views[i].style.top = Roll.stepName(i, curr, -currH, currH, 0) + "px";
      }

      if (curr != last && last >= 0) {
        var lineID = views[curr].getAttribute("id");
        var LineClass = window[lineID];
        if (LineClass) {
          updateTo(LineClass);
        } else {
          console.error(lineID + " is not a valid line");
        }
      }
    });

    roll.on("roll", function (step, progress, total) {
      var curr = step >= 0 ? step : "(padding)";
      var str = "Step " + curr + " at " + Math.floor(progress * 100) + "% (total: " + total + ")";

      /*
      line.points.map( (p) => {
        let d1 = Math.random()*space.size.x/30;
        let d2 = Math.random()*space.size.x/30;
        p.set( p.x+d1-d2, p.y );
      });
      */

      //document.querySelector( "#progress" ).textContent = str;
    });
  }

  function step(index) {
    roll.scroll(index, viewport);
  }

  space.add(line);
  space.bindMouse();
  space.play();
  space.stop(100000);

  track();

  /**
   * On resize
   */
  window.addEventListener("resize", function (evt) {
    var viewpane = document.querySelector("#steps");

    var h = window.innerHeight / 2 + "px";
    viewport.style.height = h;
    viewpane.style.height = h;
    for (var i = 0; i < views.length; i++) {
      views[i].style.height = h;
    }

    roll = Roll.verticalScroller("#wrapper", "#pane", ".step", 100);
    track();
  });

  // query string
  var qfile = qs("step");

  if (qfile) {
    if (qfile.indexOf("/") >= 0 || qfile.length > 3) qfile = "";
    var sid = parseInt(qfile);
    if (sid >= 0) step(sid);
  }
})();