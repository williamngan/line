class SegmentList {

  constructor( layers = 1) {
    this.layerCount = layers;
    this.layers = [];

    this.segmentCount = 0;
    this.reset();
  }


  reset() {
    for (var i=0; i<this.layerCount; i++) {
      this.layers[i] = [[], []];
    }
    this.segmentCount = 0;
  }


  add( i, p1, p2 ) {
    this.layers[i][0].push(p1);
    this.layers[i][1].unshift(p2);

    this.segmentCount++;
  }

  join( which ) {
    return this.layers[which][0].concat( this.layers[which][1] );
  }

}