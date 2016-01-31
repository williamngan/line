class NoiseBrush extends SpeedBrush {

  constructor(...args) {
    super( ...args );

    this.maxPoints = 50;
    this.maxTracePoints = 20;

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

    this.pointThreshold = 20;
    this.flipSpeed = 0;

    // override color
    this.color = {
      dark: "rgba(21,34,47,.65)",
      dark2: "rgba(21,34,47,.05)",
      light: "#f3f5f9",
      light2: "rgba(21,34,47, 0.05)"
    };

  }

  seed() {
    this.noise = new Noise();
    this.seedIndex = (this.seedIndex >= this.seeds.length-1) ? 0 : this.seedIndex+1;
    this.noise.seed( this.seedIndex );
  }


  draw( f=this.form ) {
    f.stroke( false ).fill( this.getColor() );

    let distRatio = 0.5;
    let smooth = 5;
    let layers = 5;
    let magnify = 2;
    let curveSegments = 3;

    let noiseFactors = {a: 0, b: 0.05, c: 0.007};
    f.noisePolygon( this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);
  }


  up() {
    super.up();
    this.seed();
  }
}