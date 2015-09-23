class MovingLineForm extends Form {

  constructor(...args) {
    super(...args);
  }

  _getSegmentDistance( last, curr, index ) {
    return (last && curr) ? curr.distance( last ) : 0;
  }


  _getSegmentNormal( last, curr, index, dist, t=0.5 ) {
    if (last) {
      let ln = new Line( last ).to( curr );
      return {p1: ln.getPerpendicular( 0.5, dist ).p1, p2: ln.getPerpendicular( 0.5, dist, true ).p1 };
    } else {
      return {p1: curr.clone(), p2: curr.clone()};
    }
  }

  /**
   * Given an array of latest values, get the average value and update the array with fresh values
   * @param bufferList an array to hold the latest values
   * @param curr current value to add to array
   * @param max maxmium number of items in the array
   * @returns average number
   * @private
   */
  _smooth( bufferList, curr, max ) {
    bufferList.push( curr );
    if (bufferList.length > max) bufferList.shift();
    let avg = bufferList.reduce( (a,b) => a+b, 0);
    return avg/bufferList.length;
  }

  dottedLine( pts, subdivision=5, largeSize=2, smallSize=0.5 ) {
    this.points( pts, largeSize, true );

    var last = pts[0];
    for (var i=0; i<pts.length; i++) {
      let ln = new Line( pts[i] ).to( last );
      let lps = ln.subpoints(subdivision);
      this.points( lps, smallSize );
      last = new Vector(ln);
    }
  }


  speedLine( pts, distRatio=0.5 ) {

    var last = null;

    for (var i=0; i<pts.length; i++) {
      let vec = new Vector( pts[i] );

      let dist = this._getSegmentDistance( last, vec, i ) * distRatio;
      let normal = this._getSegmentNormal( last, vec, i, dist );
      last = vec.clone();

      // draw normal lines
      this.line( new Line(normal.p1).to(normal.p2));
    }
  }


  speedPolygon( pts, flipSpeed=0, distRatio=0.5, smoothSteps=1 ) {

    var last = null;
    var lastNormal = {p1: false, p2: false};
    var distSteps = [];

    for (var i=0; i<pts.length; i++) {
      let vec = new Vector( pts[i] );

      let dist = this._getSegmentDistance( last, vec, i ) * distRatio;
      dist = (flipSpeed > 0) ? flipSpeed - Math.min(flipSpeed, dist) : dist;
      dist = this._smooth(distSteps, dist, smoothSteps);

      let normal = this._getSegmentNormal( last, vec, i, dist );
      last = vec.clone();

      // draw normal lines
      this.polygon( [lastNormal.p1, lastNormal.p2, normal.p2, normal.p1] );
      lastNormal = normal;
    }
  }

}