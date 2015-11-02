class ZigZagLine extends SpeedLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 150;

    this.pointThreshold = 50;

    this.color = {
      dark: "#66758c",
      dark2: "rgba(102,117,140, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "#42dc8e",
      dark2: "rgba(66,220,142, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }

  distances() {
    var last = null;
    this.points.map( (p) => {
      if (!last) return 0;
      let dist = p.distance(last);
      last = p.clone();
      return dist;
    });
  }


  maxDistance(ratio=20) {
    return Math.min(this.canvasSize.x, this.canvasSize.y)/ratio;
  }


  draw( f=this.form ) {

    f.stroke(false).fill( this.getColor("color2") );
    f.points( this.points, 1);

    f.stroke( this.getColor() ).fill(false);
    f.zigZagLine( this.points, 0.5, this.maxDistance() );

  }


}

