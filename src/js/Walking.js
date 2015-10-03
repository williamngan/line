
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};

var space = new CanvasSpace("demo", colors.b4 ).display();


function start() {


  var rs = [];
  var pad = 100;
  var h = 100;

  var app = new WalkSteps(50,0).to(300, (pad+h)*10);

  for (var i=0; i<10; i++) {
    rs.push( new Rectangle( 100, i*h + i*pad ).resizeTo( 200, h) );
  }

  app.init( space, new Rectangle(50,0).to(300,200), rs );

  space.add( app );
  space.bindMouse();
  space.play();
  space.stop(1000000);

}

start();