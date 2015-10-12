class SpeedBrush extends SpeedLine {

  constructor(...args) {
    super(...args);

    this._flip = 0;
    this.flipSpeed = 0;
    this.maxPoints = 100;


    this.color = {
      dark: "rgba(255,255,255, .8)",
      dark2: "rgba(255,255,255, .05)",
      light: "#fff",
      light2: "rgba(255,255,255, .05)"
    };

    this.color2 = {
      dark: "rgba(255,45,93, .4)",
      dark2: "rgba(255,45,93, .05)",
      light: "#fff",
      light2: "rgba(255,255,255, .05)"
    };



  }


  draw( f=this.form ) {


    f.stroke( false ).fill( this.getColor("color2") );
    f.speedPolygon( this.points, this.flipSpeed, 0.5, 1, this.maxDistance() );

    f.stroke( this.getColor() ).fill(false);
    f.speedLine( this.points );

    f.stroke( this.getColor() ).fill(false);
    f.polygon( this.points, false );
    //this.form.curve( this.catmullRom(5) );
    //this.drawLine();
  }



  up(x, y) {
    if (++this._flip % 2 === 0) {
      this.flipSpeed = (this.flipSpeed > 0) ? 0 : 15;
    }
  }
}