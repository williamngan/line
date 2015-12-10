class ArcLine extends BaseLine {

  constructor( ...args ) {
    super( ...args );

    this.color = {
      dark: "#374a58",
      dark2: "rgba(55,74,88, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "#95b1f9",
      dark2: "rgba(149,177,249, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.ang = 0;
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

    f.stroke( this.getColor() ).fill(false);
    f.polygon( this.points, false );


    f.stroke( this.getColor("color2") );
    f.arcLine( this.points, 0.5, this.maxDistance(), 7, this.ang+=Const.one_degree/10 );


  }


}

