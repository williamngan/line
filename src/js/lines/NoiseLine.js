class NoiseLine extends SpeedBrush {

  constructor(...args) {
    super( ...args );

    this.maxPoints = 50;

    this.noise = new Noise();

    // noise seed defines the styles
    this.seeds = [
      0.7642476900946349,
      0.04564903723075986,
      0.4202376299072057,
      0.35483957454562187,
      0.9071740123908967,
      0.8731264418456703,
      0.7436990102287382,
      0.23965814616531134
    ];
    this.seedIndex = 0;
    this.noise.seed( this.seeds[this.seedIndex] );
    this.noiseProgress = 0.01;

    this.pointThreshold = 20;
    this.layers = 15;
    this.flipSpeed = false;

    this.lastSegments = [];

  }

  drawSegments( last, curr, index) {

    if (last && curr) {

      // noise increment
      this.noiseProgress += 0.4;

      // find line and distance
      let dist = Math.max( 3, curr.distance( last ) / this.speedRatio );
      dist = (this.flipSpeed) ? 10 - Math.min(10, dist) : dist;
      dist = (this.lastDist + dist) / 2;
      this.lastDist = dist;

      var ln = new Line(last).to(curr);

      // draw noises
      for (var n=1; n<this.layers; n++) {
        this.drawNoise( index, ln, dist, n );
      }
    }
  }


  drawNoise( index, ln, dist, off ) {

    // noise parameters
    let ns = index/(this.maxPoints * 5);
    let na = off/this.layers;
    let nb = (this.layers-off)/this.layers;

    // get next noise
    let offset = this.noise.perlin2d( ns+na/1.2, ns+nb/0.8);
    let ndist = dist * offset * (0.5+3*off/this.layers)

    // polygon points
    var a = ln.getPerpendicular( 0.5, ndist );
    var b = ln.getPerpendicular( 0.5, ndist, true );

    if (index > 1) {
      this.form.stroke( false ).fill( `rgba(0,0,0,.12)` );
      this.form.polygon( [this.lastSegments[off].a, this.lastSegments[off].b, b.p1, a.p1] );
    }

    this.lastSegments[off] = { a: a.p1.clone(), b: b.p1.clone() };

    return [a, b];
  }


  up() {
    super.up();

    // new seed
    this.seedIndex++;
    if (this.seedIndex > this.seeds.length-1) this.seedIndex = 0;
    this.noise = new Noise();
    this.noise.seed( this.seedIndex );
  }
}