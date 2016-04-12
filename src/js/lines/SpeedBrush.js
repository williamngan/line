class SpeedBrush extends SpeedLine {

  constructor(...args) {
    super(...args);

    this._flip = 0;
    this.flipSpeed = 0;
    this.maxPoints = 100;

    this.color = this.colors.tint();
    this.color.dark2 = "rgba(255,255,255,.3)";

    this.color2 = this.colors.black();

  }


  draw( f=this.form ) {

    f.stroke( false ).fill( this.getColor() );
    f.speedPolygon( this.points, 0, 0.5, 3, this.maxDistance(30) );

    f.stroke( this.getColor("color2") ).fill(false);
    f.speedLine( this.points );

    f.stroke( this.getColor("color2") ).fill(false);
    f.polygon( this.points, false );

  }

  up(x, y) {
    if (++this._flip % 2 === 0) {
      this.flipSpeed = (this.flipSpeed > 0) ? 0 : 15;
    }
  }
}