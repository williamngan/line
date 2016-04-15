var space = new CanvasSpace( "cover", "#424855" ).display()
space.refresh( false );
space.clear("#424855");
space.ctx.lineCap = "round";

var form = new Form( space );


//// 2. Create Elements
var world = new ParticleSystem(); // a system to track the particles
space.add( world );

var follower = new Particle(); // particle gravitate toward the follower, which has a larger mass
follower.mass = 200;


// Custom Brush extending NoiseDashLine
function NoiseDashLineBrush() {
  NoiseDashLine.call( this, arguments );
  this.color = this.colors.black(.9);

  this._layer = 3 + Math.floor( Math.random()*5);
  this._mag = 0.5 + Math.random()*1.5;
  this._progress = Math.random()/100 + 0.002;
}
Util.extend( NoiseDashLineBrush, NoiseDashLine );

NoiseDashLineBrush.prototype.resetBrush = function() {
  this._layer = 3 + Math.floor( Math.random()*5);
  this._mag = 0.5 + Math.random()*1.5;
  this._progress = Math.random()/100 + 0.008;
};

NoiseDashLineBrush.prototype.draw = function( f ) {

  if (!f) f = this.form;

  if (!this.shouldDraw()) return;

  f.fill( false ).stroke( this.getColor() );

  var distRatio = (this.points.length < this.maxPoints/2) ? this.seedIndex/6 + 0.2 : (this.seedIndex+Math.random()+Math.random())/4 ;
  var smooth = 3;
  var layers = this._layer;
  var magnify = this._mag;
  var curveSegments = 1;
  var flatness = 0.57;

  this.noiseProgress +=  this._progress;
  var noiseFactors = {a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
  f.noiseDashLine( this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments, flatness);

};


// set up lines
var darkcolor = {
  dark: "rgba(0,0,10,.02)",
  dark2: "rgba(0,0,10,.02)",
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
line.resetBrush();
space.add( line );

var line2 = new NoiseChopLine().init( space );
line2.noInput = true;
line2.distanceThreshold = 50*50;
line2.trace( true );
line2.setColor( lightcolor, lightcolor );

var line3 = new GrowLine().init( space );
line3.noInput = true;
line3.distanceThreshold = 50*50;
line3.trace( true );
line3.setColor( lightcolor, lightcolor );

var lineB = line2;
space.add( lineB );



// A drawing Tip is a kind of Particle
var baseAge = 8000;

function Tip() {
  Particle.call( this, arguments );
  this.mass = 1;
  //baseAge -= 50;
  this.maxAge = Math.max( 2000, Math.random()*(10000 + baseAge) + 3000 + (baseAge/2) );
  this.age = 0;
}
Util.extend( Tip, Particle );

// animate this speckle
Tip.prototype.animate = function( time, frame, ctx ) {
  this.play(time, frame);
  this.age += frame;
};

// Particle use RK4 to integrate by default. Here we change it to Euler which is faster but less accurate.
Tip.prototype.integrate = function(t, dt) {
  return this.integrateEuler(t, dt);
};

// calculate the forces
Tip.prototype.forces = function( state, t ) {
  var brownian = new Vector( (Math.random()-Math.random())/7, (Math.random()-Math.random())/7 ); // random
  var g = Particle.force_gravitation( state, t, this, follower ); // follower gravity
  return {force: brownian.add(g.force)};
};

// Create a tip
var a = new Tip(space.size.x/2, space.size.y/2);
world.add( a );


// follower spins around the tip slowly
var ang = 0;
function orbit() {
  ang += Const.one_degree*1.2;
  follower.set( Math.cos(ang) * 60 + a.x, Math.sin(ang) * 60 + a.y );
}


// Redraw when out of bounds
function checkBounds() {

  var pxc = form.cc.getImageData(a.x, a.y, 1, 1).data;

  if (a.x <= 0 || a.x >= space.size.x || a.y <= 0 || a.y >= space.size.y || a.age >= a.maxAge || pxc[0] > 80 ) {
    world.remove(a);
    a = new Tip( space.size.x*Math.random(), space.size.x*Math.random() );

    world.add( a );

    darkcolor.dark2 = "rgba(0, 0, "+Math.floor(Math.random()*10+5)+", "+(Math.random()*0.015 + 0.01)+")";
    darkcolor.light2 = "rgba(0,0,0,0)";

    lightcolor.dark2 = "rgba(150, "+Math.floor(Math.random()*150+80)+","+Math.floor(Math.random()*180+50)+",0.02)";
    lightcolor.light2 = "rgba(0,0,0,0)";

    if (Math.random() < 0.3) {

      space.remove( lineB );
      lineB = line3;
      space.add( lineB );
    } else {
      space.remove( lineB );
      lineB = line2;
      space.add( lineB );
    }

    line.resetBrush();
  }
}

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    checkBounds();
    orbit();

    form.fill(false).stroke();
    lineB.move( a.x, a.y );
    line.move(follower.x, follower.y);

  }
});


// 4. Start playing
space.play();