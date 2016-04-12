class InnerLine extends SmoothSpeedBrush {

  constructor(...args) {
    super(...args);

    this.flipSpeed = 0;
    this.maxPoints = 100;

    this.color = this.colors.black();
    this.color.dark2 = this.colors.grey(0.02).dark;
    this.color.light2 = this.colors.tint(0.02).dark;
  }

  draw( f=this.form ) {

    if (!this.shouldDraw()) return;

    f.stroke( this.getColor() ).fill( false );
    f.innerLine( this.points, 20, 1, 7 );
  }

  up() {

  }

}