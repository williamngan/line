class NoiseDashLine extends SpeedBrush {

  constructor(...args) {
    super( ...args );

    this.maxPoints = 50;

    this.noise = new Noise();
    this.noiseProgress = 0.01;

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

    this.seedIndex = 5;
    this.noise.seed( this.seeds[this.seedIndex] );

    this.noiseFactorIndex = 0.01;
    this.noiseFactorLayer = 0.03;
    this.alpha = 0.25;

    this.pointThreshold = 20;
    this.flipSpeed = 0;

    this.color = this.colors.black(.7);
    this.color.dark2 = this.colors.black(.05).dark;
  }


  seed() {
    this.noise = new Noise();
    this.seedIndex = (this.seedIndex >= this.seeds.length-1) ? 0 : this.seedIndex+1;
    this.noise.seed( this.seeds[this.seedIndex] );
  }


  draw( f=this.form ) {

    f.fill( false ).stroke( this.getColor() );

    let distRatio = (this.seedIndex+1)/4;
    let smooth = 4;
    let layers = 8;
    let magnify = 1.25;
    let curveSegments = 1;

    this.noiseProgress += 0.003;
    let noiseFactors = {a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
    f.noiseDashLine( this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);
  }


  up() {
    super.up();
    this.seed();

    this.noiseFactorIndex = Math.max( 0.002, Math.random()/10 );
    this.noiseFactorLayer = Math.max( 0.002, Math.random()/10 );
    this.alpha += 0.1;
    if (this.alpha > 0.7) this.alpha = 0.05;
  }
}