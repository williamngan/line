class WiggleLine extends SpeedBrush {

  constructor(...args) {
    super( ...args );

    this.maxPoints = 100;

  }

  drawSegments( last, curr, index) {

    if (last && curr) {

      let wiggle = (this.pressed) ? 25 : 8;

      let offset = Math.abs( Math.sin( index * wiggle * Const.deg_to_rad ) );

      let dist = curr.distance( last ) / this.speedRatio;
      dist = (this.flipSpeed) ? 10 - Math.min(10, dist) : dist;
      dist = (this.lastDist + dist) / 2;
      this.lastDist = dist;

      var ln = new Line(last).to(curr);
      var a = ln.getPerpendicular( 0.5, dist * offset );
      var b = ln.getPerpendicular( 0.5, dist * (1-offset), true );

      this.drawSpeed( index, dist, ln, a, b );
    }
  }


}