class LagLine extends BaseLine {

  constructor(...args) {
    super( ...args );

    this.pointThreshold = 50;
    this.maxPoints = 200;

    this.targets = [];
    this.ang = 0;

    this.color = {
      dark: "rgba(51,64,87, .5)",
      dark2: "rgba(51,64,87, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "rgba(255,0,0,.8)",
      dark2: "rgba(255,0,0, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
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


  draw( f=this.form ) {

    this.ang += Const.one_degree;

    if (this.targets.length > 3 && this.points.length > 10) {
      for (var t = 0; t < this.targets.length; t++) {

        var d = this.targets[t].$subtract( this.points[t+1] );
        var d2 = this.points[t].$subtract( this.points[t+1] );
        this.targets[t].subtract( d2.multiply( 0.11 ) );
      }

      f.stroke( this.getColor() ).fill( false );
      //f.dottedLine( this.points );

      //f.stroke( this.getColor("color2") ).fill( false );
      f.zigZagLine( this.targets );

    }

  }
}