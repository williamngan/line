/**
 * Created by William on 3/14/2016.
 */

var space = new CanvasSpace( "cover", false ).display();
space.refresh( false );

var form = new Form( space );

//// 2. Create Elements
var world = new ParticleSystem(); // a system to track the particles
space.add( world );

var mouse = new Particle(); // speckles to gravitate toward the mouse, which has a larger mass
mouse.mass = 200;


function NoiseDashLineBrush() {
  NoiseDashLine.call( this, arguments );
}
Util.extend( NoiseDashLineBrush, NoiseDashLine );


NoiseDashLineBrush.prototype.draw = function( f ) {

  if (!f) f = this.form;

  if (!this.shouldDraw()) return;

  f.fill( false ).stroke( this.getColor() );

  let distRatio = (this.points.length < this.maxPoints/2) ? this.seedIndex/6 + 0.2 : (this.seedIndex+Math.random()+Math.random())/4 ;
  let smooth = 3;
  let layers = 8;
  let magnify = 2;
  let curveSegments = 1;
  let flatness = 0.87;

  this.noiseProgress +=  0.008;
  let noiseFactors = {a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
  f.noiseDashLine( this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments, flatness);

};

var blue = 0;
var red = 0;

var darkcolor = {
  dark: "rgba(0,0,0,.01)",
  dark2: "rgba(0,0,0,.01)",
  light: "rgba(0,0,0,.01)",
  ligh2: "rgba(0,0,0,.01)"
};

var lightcolor = {
  dark: "rgba(255,255,255,.01)",
  dark2: "rgba(255,255,255,.01)",
  light: "rgba(255,255,255,.01)",
  ligh2: "rgba(255,255,255,.01)"
};

var line = new NoiseDashLineBrush().init( space );

line.noInput = true;
line.distanceThreshold = 50*50;
line.trace( true );
line.setColor( darkcolor, darkcolor );
space.add( line );

var line2 = new NoiseChopLine().init( space );
line2.noInput = true;
line2.distanceThreshold = 50*50;
line2.trace( true );
line2.setColor( lightcolor, lightcolor );

var line3 = new InterpolatedLine().init( space );
line3.noInput = true;
line3.distanceThreshold = 50*50;
line3.trace( true );
line3.setColor( lightcolor, lightcolor );

var lineB = line3;
space.add( lineB );




// A Speckle is a kind of Particle
function Speckle() {
  Particle.call( this, arguments );
  this.mass = 1;
}
Util.extend( Speckle, Particle );

// animate this speckle
Speckle.prototype.animate = function( time, frame, ctx ) {
  this.play(time, frame);
  form.point( this, 1);
  if (this.x < 0 || this.x > space.size.x || this.y < 0) {
    world.remove( this );
  }
};

// Particle use RK4 to integrate by default. Here we change it to Euler which is faster but less accurate.
Speckle.prototype.integrate = function(t, dt) {
  return this.integrateEuler(t, dt);
};

// calculate the forces
Speckle.prototype.forces = function( state, t ) {
  var brownian = new Vector( (Math.random()-Math.random())/7, (Math.random()-Math.random())/7 ); // random
  var g = Particle.force_gravitation( state, t, this, mouse ); // mouse gravity
  return {force: brownian.add(g.force)};
};

var a = new Speckle(space.size.x/2, space.size.y/2);
world.add( a );


var ang = Const.one_degree;

function orbit() {
  ang += Const.one_degree*1.2;
  mouse.set( Math.cos(ang) * 60 + a.x, Math.sin(ang) * 60 + a.y );
}



function checkBounds() {
  if (a.x <= 0 || a.x >= space.size.x || a.y <= 0 || a.y >= space.size.y ) {
    world.remove(a);
    a = new Speckle( space.size.x*Math.random(), space.size.x*Math.random() );

    world.add( a );

    darkcolor.dark2 = "rgba("+Math.floor(Math.random()*20)+",0, 0,0.02)";
    darkcolor.light2 = "rgba(0,0,"+Math.floor(Math.random()*80)+",0.02)";

    lightcolor.dark2 = "rgba(220, "+Math.floor(Math.random()*40+210)+","+Math.floor(Math.random()*50+180)+",0.04)";
    lightcolor.light2 = "rgba(220, "+Math.floor(Math.random()*40+210)+","+Math.floor(Math.random()*50+180)+",0.02)";

    if (Math.random() < 0.5) {

      space.remove( lineB );
      lineB = line3;
      space.add( lineB );
    } else {
      space.remove( lineB );
      lineB = line2;
      space.add( lineB );
    }


    if (Math.random() < 0.25) {
      lineB.setColor( darkcolor, darkcolor );
      line.setColor( lightcolor, lightcolor );
    } else {
      line.setColor( darkcolor, darkcolor );
      lineB.setColor( lightcolor, lightcolor );
    }

  }
}

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // fill background
    //form.fill("rgba(0,0,0,0.05)");
    //form.rect( new Pair().to(space.size) );

    // fill speckles
    form.fill( "rgba(255,255,200,.1)" );

    checkBounds();
    orbit();

    form.fill(false).stroke();
    lineB.move( a.x, a.y );
    line.move(mouse.x, mouse.y);
    //form.fill("#eee").point( mouse, 5);

  },
  onMouseAction: function(type, x, y, evt) {

  }
});


// 4. Start playing
space.bindMouse();
space.play();
//space.stop(10000);