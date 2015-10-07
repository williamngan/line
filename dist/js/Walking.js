(function() {

  var roll = Roll.verticalScroller( "#wrapper", "#pane", ".step", 100 );
  var views = document.querySelectorAll( ".step" );
  var viewport = document.querySelector( "#wrapper" );
  views[0].className = "step curr";

  function track() {
    roll.on( "step", function ( curr, last ) {

      var currH = viewport.offsetHeight;
      console.log( currH );
      for (var i = 0; i < roll.steps.length; i++) {
        var cls = Roll.stepName( i, curr );
        views[i].className = "step " + cls;
        views[i].style.top = Roll.stepName( i, curr, -currH, currH, 0) +"px";
      }
    } );

    roll.on( "roll", function ( step, progress, total ) {
      var curr = (step >= 0) ? step : "(padding)";
      var str = "Step " + curr + " at " + Math.floor( progress * 100 ) + "% (total: " + total + ")";
      console.log( str );
      //document.querySelector( "#progress" ).textContent = str;
    } );
  }

  track();

  window.goto = function(index) {
    roll.scroll(index, viewport);
  };


  window.addEventListener("resize", function(evt) {
    var viewpane = document.querySelector( "#steps" );

    console.log( evt, this );
    var h = window.innerHeight / 2 +"px";
    viewport.style.height = h;
    viewpane.style.height = h;
    for (var i=0; i<views.length; i++) {
      views[i].style.height = h;
    }

    roll = Roll.verticalScroller( "#wrapper", "#pane", ".step", 100 );
    track();
  });


})();