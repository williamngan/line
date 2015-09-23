class SmoothNoiseLine extends SpeedBrush {

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
    this.seedIndex = 2;
    this.noise.seed( this.seeds[this.seedIndex] );
    this.noiseProgress = 0.01;

    this.pointThreshold = 20;

    this.flipSpeed = false;

    this.lastSegments = [];
    this.lastDist = [];


    this.layers = 12;
    this.segs = new SegmentList(this.layers);

  }

  avgDist( d, steps=3 ) {
    this.lastDist.push( d );
    if (this.lastDist.length > steps) this.lastDist.shift();
    return this.lastDist.reduce( (a,b) => a+b, 0) / this.lastDist.length;
  }

  getSegments( last, curr, index) {

    if (last && curr) {

      // noise increment
      this.noiseProgress += 0.4;

      // find line and distance
      let dist = Math.max( 3, curr.distance( last ) / this.speedRatio );
      dist = (this.flipSpeed) ? 10 - Math.min(10, dist) : dist;
      dist = this.avgDist(dist);

      var ln = new Line(last).to(curr);

      // draw noises
      for (var n=0; n<this.layers; n++) {
        this.getNoisePoints( index, ln, dist, n );
      }
    }
  }


  getNoisePoints( index, ln, dist, layer ) {

    // noise parameters
    let ns = index/(this.maxPoints * 5);
    let na = layer/this.layers;
    let nb = (this.layers-layer)/this.layers;

    // get next noise
    let layerset = this.noise.perlin2d( ns+na/1.2, ns+nb/0.8);
    let ndist = dist * layerset * (0.5+3*layer/this.layers);

    // polygon points
    var a = ln.getPerpendicular( 0.5, ndist );
    var b = ln.getPerpendicular( 0.5, ndist, true );

    this.segs.add( layer, a.p1.clone(), b.p1.clone() );


    /*
    if (index > 1) {
      this.form.stroke( false ).fill( `rgba(0,0,0,.12)` );
      this.form.polygon( [this.lastSegments[layer].a, this.lastSegments[layer].b, b.p1, a.p1] );
    }

    this.lastSegments[layer] = { a: a.p1.clone(), b: b.p1.clone() };

    return [a, b];
    */
  }



  drawLine() {

    this.form.stroke( false ).fill( `rgba(0,0,0,.3)` );

    this.segs.reset();

    var last = this.points[0] || new Vector();
    var count = 0;
    for (var p of this.points) {
      let vec = new Vector( p );
      this.getSegments( last, vec, count );
      last = vec.clone();
      count++;
    }

    for (var i=0; i<this.layers; i++) {
      var s = this.segs.join(i);
      var curve = new Curve().to( s );
      form.polygon( curve.catmullRom(3) );
    }
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