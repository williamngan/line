class BaseLine extends Curve {

  constructor( ...args ) {
    super( ...args );

    this.canvasSize = new Vector();
    this.pressed = false; // mouse pressed
    this.form = null;

    this.maxPoints = 200;
    this.maxTracePoints = 30;

    this.pointThreshold = 10;
    this.distanceThreshold = 200*200;
    this.moveCount = 0;
    this.maxMoveCount = 10;

    this.colors = {
      "black": (a=0.8) => {return {
        dark: `rgba(51,64,87, ${a})`,
        dark2: "rgba(51,64,87, .1)",
        light: "#fff",
        light2: "rgba(255,255,255, .1)"
      }},
      "grey": (a=0.6) => {return {
        dark: `rgba(101,115,154, ${a})`,
        dark2: "rgba(101,115,154,.1)",
        light: "#fff",
        light2: "rgba(255,255,255, .1)"
      }},
      "tint": (a=0.5) => {return {
        dark: `rgba(230,235,242, ${a})`,
        dark2: "rgba(230,235,242, .1)",
        light: "#fff",
        light2: "rgba(255,255,255, .1)"
      }},
      "white": (a=0.8) => {return {
        dark: `rgba(255,255,255, ${a})`,
        dark2: "rgba(255,255,255, .2)",
        light: "#fff",
        light2: "rgba(255,255,255, .1)"
      }
    }};

    this.color = {
      dark: "#ff2d5d",
      dark2: "rgba(255,45,93, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.tracing = false;
    this.counter = 0;

  }

  /**
   * Initiate it with a form
   * @param form Form instance
   * @param maxPoints optionally, set a maximum number of point on this line
   */
  init( space, maxPoints=false ) {
    this.canvasSize.set( space.size );
    this.form = new MovingLineForm(space);
    if (maxPoints) this.maxPoints = maxPoints;
    return this;
  }


  getColor( c="color") {
    if (!this.tracing) {
      return this[c].dark;
    } else {
      return (this.counter%2===0) ? this[c].dark2 : this[c].light2;
    }
  }

  /**
   * Set line color
   * @param c { dark, dark2, light, light2 }
   * @param c2 { dark, dark2, light, light2 }
   */
  setColor( c, c2=null ) {
    this.color = c;
    if (c2) this.color2 = c2;
  }


  /**
   * Space's animate callback. Override in subclass for additional features and drawing styles.
   */
  animate( time, fs, context) {
    this.counter++;
    this.draw();
  }

  trace( b ) {
    this.tracing = b;
  }


  draw( f=this.form ) {
    f.stroke( this.getColor() ).fill(false);
    f.curve( this.catmullRom(5), false );
  }

  /**
   * Stop drawing shortly after mouse has stopped moving
   * @param threshold
   * @returns {boolean}
   */
  shouldDraw( threshold=-2 ) {
    if (!this.tracing) return true;
    if (this.moveCount > threshold) this.moveCount--;
    return (this.moveCount>threshold);
  }

  /**
   * Trim points array if max point is reached. Override in subclass for additional features.
   */
  trim() {
    var m = (this.tracing) ? this.maxTracePoints : this.maxPoints;
    if (this.points.length > m ) {
      this.disconnect( Math.floor(this.points.length/100) );
    }
  }

  glue(mag) {
    if ( mag > this.distanceThreshold && this.points.length > 1 ) {

      if (mag > this.distanceThreshold * 3) {
        this.points = [ this.points.pop() ];
        return;
      }

      let p2 = this.points.pop();
      let p1 = this.points.pop();

      console.log( p2, p1, this.distanceThreshold );
      let lns = new Line( p1 ).to( p2 ).subpoints( Math.floor(this.distanceThreshold/5000) );

      this.to( lns );
    }
  }

  /**
   * When moving. Override in subclass for additional features.
   */
  move(x, y, z) {

    var last = new Vector(this.points[this.points.length-1]).$subtract( x, y ).magnitude(false);
    if (last > this.pointThreshold) {

      this.to( x, y );
      this.trim();
      this.glue( last );

      if (this.pressed) this.drag( x, y );
    }

    if (this.moveCount < this.maxMoveCount) this.moveCount+=2;
  }


  /**
   * When dragging. Override in subclass for additional features.
   */
  drag(x, y) {
    this.tracing = true;
  }


  /**
   * When pencil is down. Override in subclass for additional features.
   */
  down(x, y) {
    this.points = [];
    this.tracing = !this.tracing;
  }


  /**
   * When pencil is up. Override in subclass for additional features.
   */
  up(x, y) {

  }

  _penAction( type, x, y ) {

    // when mouse move, add a point to the trail
    if (type == "move") {
      this.move(x,y);
    }

    // check whether mouse is down
    if (type == "down") {
      this.pressed = true;
      this.down(x, y)
    } else if (type == "up") {
      this.pressed = false;
      this.up(x, y);
    } else if ( type == "out") {
      this.pressed = false;
    }
  }

  /**
   * Space's bindMouse callback
   */
  onMouseAction( type, x, y, evt ) {
    this._penAction(type, x, y);
  }

  onTouchAction( type, px, py, evt ) {
    let touchPoints = this.form.space.touchesToPoints( evt );
    if (touchPoints && touchPoints.length > 0) this._penAction(type, touchPoints[0].x, touchPoints[0].y);
  }


}
