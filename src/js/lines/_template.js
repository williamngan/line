class Line2 extends BaseLine {

  constructor( ...args ) {
    super( ...args );


  }


  animate( time, fps, context) {
    this.form.stroke("rgba(0,0,0,.4)");
    this.form.curve( this.catmullRom(5) );
  }


  trim() {
  }


  move(x, y, z) {
  }


  drag(x, y) {}


  down(x, y) {}


  up(x, y) {}


}
