(function() {
  var roll = Roll.verticalScroller( "#wrapper", "#pane", ".step", 100 );
  var views = document.querySelectorAll( ".step" );
  var viewport = document.querySelector( "#wrapper" );
  var message = document.querySelector( "#message" );
  var pages = document.querySelector( "#pages" );

  var msgTimeout = -1;
  var slowFPS = false;

  views[0].className = "step curr";

  var space = new CanvasSpace("demo", false ).display();
  var line = new InterpolatedLine().init( space );

  var isTracing = false;



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
  function updateTo( LineClass ) {
    var _temp = line.clone();
    space.remove( line );
    line = new LineClass().init( space );
    line.points = _temp.points;
    line.trace( isTracing ); // sync tracing state
    space.add( line );
  }

  function _paginate( curr ) {

    var pgs = pages.querySelectorAll("a");
    for (var i=0; i<pgs.length; i++) {
      pgs[i].className = (i===curr) ? "selected" : "";
      pgs[i].textContent = (i===curr) ? (i+1)+"" : "\u2022";
    }
  }

  /**
   * Track roll
   */
  function track() {
    roll.on( "step", function ( curr, last ) {

      var currH = viewport.offsetHeight;
      for (var i = 0; i < roll.steps.length; i++) {
        var cls = Roll.stepName( i, curr );
        views[i].className = "step " + cls;
        views[i].style.top = Roll.stepName( i, curr, -currH, currH, 0 ) + "px";
      }

      if (curr != last && last >= 0) {
        var lineID = views[curr].getAttribute("id");
        var LineClass = window[lineID];
        if (LineClass) {
          updateTo(LineClass);
        } else {
          console.error( lineID + " is not a valid line");
        }
      }

      _paginate(curr);

    } );

    roll.on( "roll", function ( step, progress, total ) {
      var curr = (step >= 0) ? step : "(padding)";
      var str = "Step " + curr + " at " + Math.floor( progress * 100 ) + "% (total: " + total + ")";
    } );
  }

  // go to a step
  function step( index ) {
    roll.scroll( index, viewport );
  }

  function showMessage( msg, time ) {
    message.className = "show";
    message.textContent = msg;
    slowFPS = true;
    setTimeout( function() {
      message.className = "";
      slowFPS = false;
    }, time);
  }


  // Toggle between moving and drawing
  space.bindCanvas( "mouseup", function(evt) {
    isTracing = !isTracing;
    space.refresh( !isTracing );
    line.trace( isTracing );

    showMessage( ((isTracing) ? "Drawing Mode" : "Walking Mode"), 2500 );
  });

  // Track mouse
  space.bindMouse();

  // Add animated elements
  space.add( line );
  space.add( {
    animate: function (time, fs) {
      if ( time>5000 && 1000/fs < 19 && !slowFPS) {
        clearTimeout(msgTimeout);
        showMessage( "Slow? A smaller browser window may improve speed.", 5000 );
      }
    }
  });

  space.play();
  track();


  /**
   * On resize
   */
  window.addEventListener( "resize", function ( evt ) {
    var viewpane = document.querySelector( "#steps" );

    var h = window.innerHeight + "px";
    viewport.style.height = h;
    viewpane.style.height = h;
    for (var i = 0; i < views.length; i++) {
      views[i].style.height = h;
    }

    roll = Roll.verticalScroller( "#wrapper", "#pane", ".step", 100 );
    track();

    message.className = "";
  } );


  // query string
  var qfile = qs("step");

  if (qfile) {
    if (qfile.indexOf( "/" ) >= 0 || qfile.length > 3) qfile = "";
    var sid = parseInt( qfile);
    if (sid >= 0) step( sid );

  }


  for (var i=0; i<views.length; i++) {
    var pg = document.createElement("a");
    pg.setAttribute("data-id", i);
    pg.textContent = "\u2022";
    if (i===0) {
      pg.textContent = "1";
      pg.className = "selected";
    }
    pages.appendChild(pg);
    pg.addEventListener("mouseup", function( evt ) {
      var pid = parseInt( evt.target.getAttribute("data-id") );
      step( pid );
      return false;
    });
  }
})();