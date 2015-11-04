class HatchingLine extends BaseLine {

  constructor( ...args ) {
    super( ...args );

    this.maxPoints = 150;

    this.pointThreshold = 20;

    this.color = {
      dark: "rgba(102,117,140, .5)",
      dark2: "rgba(102,117,140, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "rgba(0,10,30,.3)",
      dark2: "rgba(0,10,30,.1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }


  maxDistance(ratio=20) {
    return Math.min(this.canvasSize.x, this.canvasSize.y)/ratio;
  }

  draw( f=this.form ) {

    f.stroke( this.getColor() ).fill(false);
    f.hatchingLine( this.points );

  }

}

