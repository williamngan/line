class Line2 extends BaseLine {

  constructor( ...args ) {
    super( ...args );


  }


  animate( time, fps, context) {
    this.form.stroke("rgba(0,0,0,.4)");
    this.form.curve( this.catmullRom(5) );
  }


  trim() {
    if (this.points.length > this.maxPoints ) {
      this.disconnect( Math.floor(this.points.length/100) );
    }
  }


  move(x, y, z) {
    this.to(x, y);
    this.trim();
    if (this.pressed) this.drag(x, y);
  }


  drag(x, y) {}


  down(x, y) {}


  up(x, y) {}


}
