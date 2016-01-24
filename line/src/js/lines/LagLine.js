class LagLine extends BaseLine {

  constructor(...args) {
    super( ...args );

    this.pointThreshold = 20;
    this.maxPoints = 100;

    this.targets = [];
    this.ang = 0;

    this.color = {
      dark: "rgba(51,64,87, .5)",
      dark2: "rgba(51,64,87, .2)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "rgba(51,64,87, .2)",
      dark2: "rgba(255,255,255, .3)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.lastPoints = [];
    this.angle = 0;
  }

  trim() {
    super.trim();
  }

  move(x, y, z) {
    super.move(x, y, z);
    this.targets = [];
    for (var i=2; i<this.points.length-2; i++) {
      this.targets[i-2] = this.points[i-2];
      //this.targets[i-2] = this.points[i-2].clone();
    }
  }

  maxDistance(ratio=20) {
    return Math.min(this.canvasSize.x, this.canvasSize.y)/ratio;
  }

  draw( f=this.form ) {

    this.ang += Const.one_degree;

    if (this.targets.length > 3 && this.points.length > 10) {
      for (var t = 0; t < this.targets.length; t++) {
        var d2 = this.points[t].$subtract( this.points[t+1] );
        this.targets[t].subtract( d2.multiply( 0.11 ) );
      }


      this.angle += Const.one_degree;
      f.stroke( this.getColor("color2") ).fill( false );
      f.innerWiggleLine( this.points, 4, 50, {angle: this.angle, step: Const.one_degree*5 }, 1.5, 2 );

      f.stroke( this.getColor() ).fill( false );

      f.hatchingLine( this.targets );

      f.jaggedLine( this.points, this.lastPoints );
    }

  }
}