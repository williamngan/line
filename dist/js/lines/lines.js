"use strict";

var _get = function get(_x30, _x31, _x32) { var _again = true; _function: while (_again) { var object = _x30, property = _x31, receiver = _x32; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x30 = parent; _x31 = property; _x32 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SegmentList = (function () {
  function SegmentList() {
    var layers = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    _classCallCheck(this, SegmentList);

    this.layerCount = layers;
    this.layers = [];

    this.segmentCount = 0;
    this.reset();
  }

  _createClass(SegmentList, [{
    key: "reset",
    value: function reset() {
      for (var i = 0; i < this.layerCount; i++) {
        this.layers[i] = [[], []];
      }
      this.segmentCount = 0;
    }
  }, {
    key: "add",
    value: function add(i, p1, p2) {
      this.layers[i][0].push(p1);
      this.layers[i][1].unshift(p2);

      this.segmentCount++;
    }
  }, {
    key: "join",
    value: function join(which) {
      return this.layers[which][0].concat(this.layers[which][1]);
    }
  }]);

  return SegmentList;
})();

var MovingLineForm = (function (_Form) {
  _inherits(MovingLineForm, _Form);

  function MovingLineForm() {
    _classCallCheck(this, MovingLineForm);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(MovingLineForm.prototype), "constructor", this).apply(this, args);
  }

  _createClass(MovingLineForm, [{
    key: "_getSegmentDistance",
    value: function _getSegmentDistance(last, curr, index) {
      return last && curr ? curr.distance(last) : 0;
    }
  }, {
    key: "_getSegmentNormal",
    value: function _getSegmentNormal(last, curr, dist) {
      var t = arguments.length <= 3 || arguments[3] === undefined ? 0.5 : arguments[3];

      if (last) {
        var ln = new Line(last).to(curr);
        return { p1: ln.getPerpendicular(0.5, dist).p1, p2: ln.getPerpendicular(0.5, dist, true).p1 };
      } else {
        return { p1: curr.clone(), p2: curr.clone() };
      }
    }

    /**
     * Draw noise polygons
     * @param noise noise instance (seeded)
     * @param noiseIncrement noise value addition
     * @param dist thickness of brush
     * @param layerRatio a ratio based on current-layer / total-layers
     * @param magnify magnification ratio
     */
  }, {
    key: "_getNoiseDistance",
    value: function _getNoiseDistance(noise, noiseIncrement, dist, layerRatio) {
      var magnify = arguments.length <= 4 || arguments[4] === undefined ? 3 : arguments[4];

      // noise parameters
      var na = layerRatio;
      var nb = 1 - layerRatio;

      // get next noise
      var layerset = noise.simplex2d(na + noiseIncrement, nb + noiseIncrement);
      return dist * layerset * (0.5 + magnify * layerRatio);
    }

    /**
     * Given an array of latest values, get the average value and update the array with fresh values
     * @param bufferList an array to hold the latest values
     * @param curr current value to add to array
     * @param max maxmium number of items in the array
     * @returns average number
     * @private
     */
  }, {
    key: "_smooth",
    value: function _smooth(bufferList, curr, max) {
      bufferList.push(curr);
      if (bufferList.length > max) bufferList.shift();
      var avg = bufferList.reduce(function (a, b) {
        return a + b;
      }, 0);
      return avg / bufferList.length;
    }

    /**
     * Draw dotted lines
     * @param pts points list
     * @param subdivision how many extra dots per line segments
     * @param largeSize size of vertex
     * @param smallSize size of interpolated points
     */
  }, {
    key: "dottedLine",
    value: function dottedLine(pts) {
      var subdivision = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];
      var largeSize = arguments.length <= 2 || arguments[2] === undefined ? 2 : arguments[2];
      var smallSize = arguments.length <= 3 || arguments[3] === undefined ? 0.5 : arguments[3];

      this.points(pts, largeSize, true);

      var last = pts[0];
      for (var i = 0; i < pts.length; i++) {
        var ln = new Line(pts[i]).to(last);
        var lps = ln.subpoints(subdivision);
        this.points(lps, smallSize);
        last = new Vector(ln);
      }
    }

    /**
     * Draw polygons based on "speed
     * @param pts points list
     * @param distRatio distance ratio (0.5)
     */
  }, {
    key: "speedLine",
    value: function speedLine(pts) {
      var distRatio = arguments.length <= 1 || arguments[1] === undefined ? 0.5 : arguments[1];

      var last = null;

      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        var normal = this._getSegmentNormal(last, vec, dist);
        last = vec.clone();

        // draw normal lines
        this.line(new Line(normal.p1).to(normal.p2));
      }
    }

    /**
     * Draw polygons based on "speed
     * @param pts points list
     * @param flipSpeed flip thickness (0 or a value such as 10)
     * @param distRatio distance ratio (0.5)
     * @param smoothSteps number of steps per average
     */
  }, {
    key: "speedPolygon",
    value: function speedPolygon(pts) {
      var flipSpeed = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var distRatio = arguments.length <= 2 || arguments[2] === undefined ? 0.5 : arguments[2];
      var smoothSteps = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

      var last = null;
      var lastNormal = { p1: false, p2: false };
      var distSteps = [];

      // go through each points
      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        dist = flipSpeed > 0 ? flipSpeed - Math.min(flipSpeed, dist) : dist;
        dist = this._smooth(distSteps, dist, smoothSteps);

        var normal = this._getSegmentNormal(last, vec, dist);
        last = vec.clone();

        // draw polygon (quad)
        this.polygon([lastNormal.p1, lastNormal.p2, normal.p2, normal.p1]);
        lastNormal = normal;
      }
    }

    /**
     * Draw noise polygons
     * @param pts points list
     * @param noise noise instance (seeded)
     * @param nf noise factors { a: current noise value, b: noise scale for layer index, c: noise scale for point index }
     * @param flipSpeed flip thickness (0 or a value such as 10)
     * @param distRatio distance ratio (0.5)
     * @param smoothSteps number of steps per average
     * @param layers number of layers
     * @param magnify magnification ratio
     * @param curveSegments number of segments for curve, or 0 for no curve
     */
  }, {
    key: "noisePolygon",
    value: function noisePolygon(pts, noise) {
      var nf = arguments.length <= 2 || arguments[2] === undefined ? { a: 0, b: 0.005, c: 0.005 } : arguments[2];
      var flipSpeed = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var distRatio = arguments.length <= 4 || arguments[4] === undefined ? 0.5 : arguments[4];
      var smoothSteps = arguments.length <= 5 || arguments[5] === undefined ? 1 : arguments[5];
      var layers = arguments.length <= 6 || arguments[6] === undefined ? 15 : arguments[6];
      var magnify = arguments.length <= 7 || arguments[7] === undefined ? 3 : arguments[7];
      var curveSegments = arguments.length <= 8 || arguments[8] === undefined ? 0 : arguments[8];

      var last = null;
      var distSteps = [];

      // segment list keeps track of the points (a simplified convex hull)
      var segs = new SegmentList(layers);

      // go through each points
      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        dist = flipSpeed > 0 ? flipSpeed - Math.min(flipSpeed, dist) : dist;
        dist = this._smooth(distSteps, dist, smoothSteps);

        // noise segments for each layer
        for (var n = 1; n < layers; n++) {
          var nfactors = nf.a + n * nf.b + i * nf.c;
          var ndist = this._getNoiseDistance(noise, nfactors, dist, n / layers, magnify);
          var normal = this._getSegmentNormal(last, vec, ndist);
          segs.add(n, normal.p1, normal.p2);
        }

        last = vec.clone();
      }

      // draw layered polygons from segment list
      for (var n = 1; n < layers; n++) {
        var s = segs.join(n);
        var curve = new Curve().to(s);
        this.polygon(curveSegments > 0 ? curve.catmullRom(curveSegments) : curve.points);
      }
    }
  }]);

  return MovingLineForm;
})(Form);

var BaseLine = (function (_Curve) {
  _inherits(BaseLine, _Curve);

  function BaseLine() {
    _classCallCheck(this, BaseLine);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _get(Object.getPrototypeOf(BaseLine.prototype), "constructor", this).apply(this, args);

    this.pressed = false; // mouse pressed
    this.form = null;
    this.maxPoints = 50;
    this.pointThreshold = 10;
  }

  /**
   * Initiate it with a form
   * @param form Form instance
   * @param maxPoints optionally, set a maximum number of point on this line
   */

  _createClass(BaseLine, [{
    key: "init",
    value: function init(space) {
      var maxPoints = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.form = new MovingLineForm(space);
      if (maxPoints) this.maxPoints = maxPoints;
      return this;
    }

    /**
     * Space's animate callback. Override in subclass for additional features and drawing styles.
     */
  }, {
    key: "animate",
    value: function animate(time, fps, context) {
      this.draw();
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke("rgba(0,0,0,.4)").fill(false);
      f.curve(this.catmullRom(5), false);
    }

    /**
     * Trim points array if max point is reached. Override in subclass for additional features.
     */
  }, {
    key: "trim",
    value: function trim() {
      if (this.points.length > this.maxPoints) {
        this.disconnect(Math.floor(this.points.length / 100));
      }
    }

    /**
     * When moving. Override in subclass for additional features.
     */
  }, {
    key: "move",
    value: function move(x, y, z) {

      var last = new Vector(this.points[this.points.length - 1]).$subtract(x, y).magnitude(false);
      if (last > this.pointThreshold) {

        this.to(x, y);
        this.trim();
        if (this.pressed) this.drag(x, y);
      }
    }

    /**
     * When dragging. Override in subclass for additional features.
     */
  }, {
    key: "drag",
    value: function drag(x, y) {}

    /**
     * When pencil is down. Override in subclass for additional features.
     */
  }, {
    key: "down",
    value: function down(x, y) {}

    /**
     * When pencil is up. Override in subclass for additional features.
     */
  }, {
    key: "up",
    value: function up(x, y) {}

    /**
     * Space's bindMouse callback
     */
  }, {
    key: "onMouseAction",
    value: function onMouseAction(type, x, y, evt) {

      // when mouse move, add a point to the trail
      if (type == "move") {
        this.move(x, y);
      }

      // check whether mouse is down
      if (type == "down") {
        this.pressed = true;
        this.down(x, y);
      } else if (type == "up") {
        this.pressed = false;
        this.up(x, y);
      } else if (type == "out") {
        this.pressed = false;
      }
    }
  }]);

  return BaseLine;
})(Curve);

var DottedLine = (function (_BaseLine) {
  _inherits(DottedLine, _BaseLine);

  function DottedLine() {
    _classCallCheck(this, DottedLine);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _get(Object.getPrototypeOf(DottedLine.prototype), "constructor", this).apply(this, args);
  }

  _createClass(DottedLine, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.fill("rgba(0,0,0,.3").stroke(false);
      f.dottedLine(this.points);
    }
  }]);

  return DottedLine;
})(BaseLine);

var SpeedLine = (function (_BaseLine2) {
  _inherits(SpeedLine, _BaseLine2);

  function SpeedLine() {
    _classCallCheck(this, SpeedLine);

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    _get(Object.getPrototypeOf(SpeedLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 50;
    this.speedRatio = 2;
  }

  _createClass(SpeedLine, [{
    key: "distances",
    value: function distances() {
      var last = null;
      this.points.map(function (p) {
        if (!last) return 0;
        var dist = p.distance(last);
        last = p.clone();
        return dist;
      });
    }

    /*
    drawSegments( last, curr, index) {
        if (last && curr) {
          let dist = curr.distance( last ) / this.speedRatio;
          var ln = new Line(last).to(curr);
        var a = ln.getPerpendicular( 0.5, dist );
        var b = ln.getPerpendicular( 0.5, dist, true );
          this.drawSpeed( index, dist, ln, a, b );
      }
    }
    
    drawSpeed( index, dist, line, seg1, seg2 ) {
      this.form.stroke("rgba(0,0,0,.4)").fill(false);
      this.form.point( this.points[index], 0.5);
      this.form.line( line );
      this.form.line( seg1 );
      this.form.line( seg2 )
    }
      drawLine() {
        var last = null;
      var count = 0;
      for (var p of this.points) {
        let vec = new Vector( p );
        this.drawSegments( last, vec, count++ );
        last = vec.clone();
      }
      }
    */

  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke("rgba(0,0,0,.4)").fill(false);
      // draw regular path
      f.polygon(this.points, false);
      f.speedLine(this.points);

      //this.form.curve( this.catmullRom(5) );
      //this.drawLine();
    }
  }]);

  return SpeedLine;
})(BaseLine);

var SpeedBrush = (function (_SpeedLine) {
  _inherits(SpeedBrush, _SpeedLine);

  function SpeedBrush() {
    _classCallCheck(this, SpeedBrush);

    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    _get(Object.getPrototypeOf(SpeedBrush.prototype), "constructor", this).apply(this, args);

    this.flipSpeed = 0;
    this.maxPoints = 100;
  }

  /*
  drawSegments( last, curr, index) {
      if (last && curr) {
        let dist = curr.distance( last ) / this.speedRatio;
      dist = (this.flipSpeed) ? 10 - Math.min(10, dist) : dist;
      dist = (this.lastDist + dist) / 2;
      this.lastDist = dist;
        var ln = new Line(last).to(curr);
      var a = ln.getPerpendicular( 0.5, dist );
      var b = ln.getPerpendicular( 0.5, dist, true );
        this.drawSpeed( index, dist, ln, a, b );
    }
  }
  
  drawSpeed( index, dist, line, seg1, seg2 ) {
      if (index > 1) {
        if (!this.flipSpeed) {
        this.form.stroke( "rgba(0,0,0,.2)" );
        this.form.line( line );
        this.form.stroke( "rgba(0,0,0,.2)" ).fill( "rgba(0,0,0,.6)" );
      } else {
        this.form.stroke( "#222" ).fill("#222");
      }
        this.form.polygon( [this.lastSegments.a, this.lastSegments.b, seg2.p1, seg1.p1] );
    }
    this.lastSegments = { a: seg1.p1.clone(), b: seg2.p1.clone() };
  }
  */

  _createClass(SpeedBrush, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke("rgba(0,0,0,.2)").fill(false);
      // draw regular path
      f.polygon(this.points, false);

      f.stroke("rgba(0,0,0,.2)").fill("rgba(0,0,0,.6)");
      f.speedPolygon(this.points, this.flipSpeed, 0.5, 1);

      //this.form.curve( this.catmullRom(5) );
      //this.drawLine();
    }
  }, {
    key: "up",
    value: function up(x, y) {
      this.flipSpeed = this.flipSpeed > 0 ? 0 : 10;
    }
  }]);

  return SpeedBrush;
})(SpeedLine);

var SmoothSpeedBrush = (function (_SpeedLine2) {
  _inherits(SmoothSpeedBrush, _SpeedLine2);

  function SmoothSpeedBrush() {
    _classCallCheck(this, SmoothSpeedBrush);

    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    _get(Object.getPrototypeOf(SmoothSpeedBrush.prototype), "constructor", this).apply(this, args);

    this.flipSpeed = 0;
    this.maxPoints = 100;
  }

  _createClass(SmoothSpeedBrush, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      // draw regular path
      f.stroke("rgba(0,0,0,.2)").fill(false);
      f.polygon(this.points, false);

      // connect polygons
      f.stroke("rgba(0,0,0,.2)").fill("rgba(0,0,0,.6)");
      f.speedPolygon(this.points, this.flipSpeed, 0.5, 5);
    }
  }, {
    key: "up",
    value: function up(x, y) {
      this.flipSpeed = this.flipSpeed > 0 ? 0 : 10;
    }
  }]);

  return SmoothSpeedBrush;
})(SpeedLine);

var WiggleLine = (function (_SpeedBrush) {
  _inherits(WiggleLine, _SpeedBrush);

  function WiggleLine() {
    _classCallCheck(this, WiggleLine);

    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    _get(Object.getPrototypeOf(WiggleLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 100;
  }

  _createClass(WiggleLine, [{
    key: "drawSegments",
    value: function drawSegments(last, curr, index) {

      if (last && curr) {

        var wiggle = this.pressed ? 25 : 8;

        var offset = Math.abs(Math.sin(index * wiggle * Const.deg_to_rad));

        var dist = curr.distance(last) / this.speedRatio;
        dist = this.flipSpeed ? 10 - Math.min(10, dist) : dist;
        dist = (this.lastDist + dist) / 2;
        this.lastDist = dist;

        var ln = new Line(last).to(curr);
        var a = ln.getPerpendicular(0.5, dist * offset);
        var b = ln.getPerpendicular(0.5, dist * (1 - offset), true);

        this.drawSpeed(index, dist, ln, a, b);
      }
    }
  }]);

  return WiggleLine;
})(SpeedBrush);

var NoiseLine = (function (_SpeedBrush2) {
  _inherits(NoiseLine, _SpeedBrush2);

  function NoiseLine() {
    _classCallCheck(this, NoiseLine);

    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    _get(Object.getPrototypeOf(NoiseLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 50;

    this.noise = new Noise();

    // noise seed defines the styles
    this.seeds = [0.7642476900946349, 0.04564903723075986, 0.4202376299072057, 0.35483957454562187, 0.9071740123908967, 0.8731264418456703, 0.7436990102287382, 0.23965814616531134];

    this.seedIndex = 2;
    this.noise.seed(this.seeds[this.seedIndex]);

    this.pointThreshold = 20;
    this.flipSpeed = 0;
  }

  _createClass(NoiseLine, [{
    key: "seed",
    value: function seed() {
      this.noise = new Noise();
      this.seedIndex = this.seedIndex >= this.seeds.length - 1 ? 0 : this.seedIndex + 1;
      this.noise.seed(this.seedIndex);
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke(false).fill("rgba(0,0,0,.6)");

      var distRatio = 0.5;
      var smooth = 3;
      var layers = 5;
      var magnify = 2;
      var curveSegments = 3;

      var noiseFactors = { a: 0, b: 0.01, c: 0.01 };
      f.noisePolygon(this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, layers, magnify, curveSegments);
    }
  }, {
    key: "up",
    value: function up() {
      _get(Object.getPrototypeOf(NoiseLine.prototype), "up", this).call(this);
      this.seed();
    }
  }]);

  return NoiseLine;
})(SpeedBrush);

var SmoothNoiseLine = (function (_SpeedBrush3) {
  _inherits(SmoothNoiseLine, _SpeedBrush3);

  function SmoothNoiseLine() {
    _classCallCheck(this, SmoothNoiseLine);

    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    _get(Object.getPrototypeOf(SmoothNoiseLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 50;

    this.noise = new Noise();
    this.noiseProgress = 0.01;

    // noise seed defines the styles
    this.seeds = [0.7642476900946349, 0.04564903723075986, 0.4202376299072057, 0.35483957454562187, 0.9071740123908967, 0.8731264418456703, 0.7436990102287382, 0.23965814616531134];

    this.seedIndex = 2;
    this.noise.seed(this.seeds[this.seedIndex]);

    this.noiseFactorIndex = 0.01;
    this.noiseFactorLayer = 0.03;
    this.alpha = 0.25;

    this.pointThreshold = 20;
    this.flipSpeed = 0;
  }

  _createClass(SmoothNoiseLine, [{
    key: "seed",
    value: function seed() {
      this.noise = new Noise();
      this.seedIndex = this.seedIndex >= this.seeds.length - 1 ? 0 : this.seedIndex + 1;
      this.noise.seed(this.seedIndex);
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke(false).fill("rgba(20,0,70," + this.alpha + ")");

      var distRatio = 0.5;
      var smooth = 4;
      var layers = 12;
      var magnify = 2;
      var curveSegments = 3;

      this.noiseProgress += 0.002;
      var noiseFactors = { a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
      f.noisePolygon(this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, layers, magnify, curveSegments);
    }
  }, {
    key: "up",
    value: function up() {
      this.seed();

      this.noiseFactorIndex = Math.max(0.002, Math.random() / 10);
      this.noiseFactorLayer = Math.max(0.002, Math.random() / 10);
      this.alpha += 0.1;
      if (this.alpha > 0.7) this.alpha = 0.05;
    }
  }]);

  return SmoothNoiseLine;
})(SpeedBrush);

var ContinuousLine = (function (_NoiseLine) {
  _inherits(ContinuousLine, _NoiseLine);

  function ContinuousLine() {
    _classCallCheck(this, ContinuousLine);

    for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }

    _get(Object.getPrototypeOf(ContinuousLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 30;
    this.bounds = null;
    this.splitLines = [];
  }

  _createClass(ContinuousLine, [{
    key: "onSpaceResize",
    value: function onSpaceResize(w, h, evt) {
      this.bounds = new Rectangle(0, 0).to(w, h);
    }

    /**
     * Move the split lines
     * @param pts
     * @private
     */
  }, {
    key: "_continuous",
    value: function _continuous(pts) {
      var d1 = pts.$getAt(1).$subtract(pts.getAt(0));
      pts.disconnect(0);
      pts.to(pts.$getAt(pts.points.length - 1).$add(d1));
    }

    /**
     * Check if the split line is out of bound
     * @param pts
     * @private
     */
  }, {
    key: "_checkBounds",
    value: function _checkBounds(pts) {
      if (!this.bounds || pts.points.length === 0) return;

      var count = -1;
      for (var i = pts.points.length - 1; i >= 0; i--) {
        if (!this.bounds.withinBounds(pts.points[i])) {
          count = i;
        }
      }

      if (count >= 0) {
        pts.disconnect(pts.points.length - count);
      }
    }

    /**
     * Trim and create new split line
     */
  }, {
    key: "trim",
    value: function trim() {
      if (this.points.length >= this.maxPoints) {
        var sp = new NoiseLine().to(this.clone().points);
        this.splitLines.push(sp);
        this.points = [];
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this = this;

      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      _get(Object.getPrototypeOf(ContinuousLine.prototype), "draw", this).call(this, f);

      // track split lines
      var clear = this.splitLines.map(function (sp, i) {
        sp.draw(f);
        _this._continuous(sp);
        _this._checkBounds(sp);
        return sp.points.length === 0 ? i : -1;
      });

      // clear empty split lines
      for (var i = 0; i < clear.length; i++) {
        if (clear[i] >= 0) this.splitLines.splice(clear[i], 1);
      }
    }
  }]);

  return ContinuousLine;
})(NoiseLine);

var StepperLine = (function (_NoiseLine2) {
  _inherits(StepperLine, _NoiseLine2);

  function StepperLine() {
    _classCallCheck(this, StepperLine);

    for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    _get(Object.getPrototypeOf(StepperLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 50;
    this.splitLines = [];
  }

  _createClass(StepperLine, [{
    key: "onSpaceResize",
    value: function onSpaceResize(w, h, evt) {

      this.splitLines = [];
      var dw = w / 9;
      for (var i = 0; i < 8; i++) {
        this.splitLines.push(new BaseLine().to(dw + dw * i, h / 2));
      }
    }

    /**
     * Move the split lines
     * @param pts
     * @private
     */
  }, {
    key: "_continuous",
    value: function _continuous(sp, pts) {
      var offset = arguments.length <= 2 || arguments[2] === undefined ? 5 : arguments[2];

      var ps = [];
      var pa = pts.slice(1, offset);
      var pb = pts.slice(offset);

      // double
      if (pb.length > 1 && pa.length > 1) {

        var ang = pb[pb.length - 1].angle(pb[pb.length - 2]);
        var ang2 = pa[1].angle(pa[0]);

        pb = pb.map(function (p) {
          return p.$subtract(pb[0]).add(sp.getAt(0));
        });
        pa = pa.map(function (p, i) {
          return p.$subtract(pa[0]).rotate2D(ang - ang2).add(pb[pb.length - 1]);
        });
        ps = pb.concat(pa);

        // single
      } else if (pa.length < 2) {
          ps = pb.map(function (p) {
            return p.$subtract(pb[0]).add(sp.getAt(0));
          });
        } else if (pb.length < 2) {
          ps = pa.map(function (p) {
            return p.$subtract(pa[0]).add(sp.getAt(0));
          });
        }

      for (var i = 0; i < ps.length; i++) {
        sp.setAt(i + 1, ps[i]);
      }
    }

    /**
     * Trim and create new split line
     */
  }, {
    key: "trim",
    value: function trim() {
      if (this.points.length > this.maxPoints) {
        this.disconnect(Math.floor(this.points.length / 100));
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this2 = this;

      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      _get(Object.getPrototypeOf(StepperLine.prototype), "draw", this).call(this, f);

      var pts = this.$op("subtract", this.$getAt(0)).toArray();

      // track split lines
      this.splitLines.map(function (sp, i) {
        sp.draw(f);
        _this2._continuous(sp, pts, Math.floor(i * pts.length / _this2.splitLines.length));
      });
    }
  }]);

  return StepperLine;
})(NoiseLine);

var ReflectLine = (function (_NoiseLine3) {
  _inherits(ReflectLine, _NoiseLine3);

  function ReflectLine() {
    _classCallCheck(this, ReflectLine);

    for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      args[_key12] = arguments[_key12];
    }

    _get(Object.getPrototypeOf(ReflectLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 20;
    this.splitLines = [];
    this.radian = 0;
    this.offset = 20;
  }

  _createClass(ReflectLine, [{
    key: "onSpaceResize",
    value: function onSpaceResize(w, h, evt) {

      this.splitLines = [];
      this.cutLines = [];

      var dw = w / 10;
      var dw2 = dw / 2;
      var dh = h / 10;
      var dh2 = dh / 2;

      this.offset = w / 20;
      for (var i = 0; i < 10; i++) {
        this.cutLines.push(new Line(dw2 + dw * i, 0).to(dw2 + dw * i, h));
        this.splitLines.push(new SmoothSpeedBrush());
      }

      for (var i = 0; i < 10; i++) {
        this.cutLines.push(new Line(0, dh2 + dh * i).to(w, dh2 + dh * i));
        this.splitLines.push(new SmoothSpeedBrush());
      }
    }

    /**
     * Move the split lines
     * @param pts
     * @private
     */
  }, {
    key: "_continuous",
    value: function _continuous(cutline, index, form) {
      var _this3 = this;

      this.points.map(function (p, i) {
        _this3.splitLines[index].setAt(i, p.clone().reflect2D(cutline));
      });

      this.splitLines[index].draw(form);
    }

    /**
     * Trim and create new split line
     */
  }, {
    key: "trim",
    value: function trim() {
      if (this.points.length > this.maxPoints) {
        this.disconnect(Math.floor(this.points.length / 100));
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this4 = this;

      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      this.radian += Const.one_degree / 5;

      _get(Object.getPrototypeOf(ReflectLine.prototype), "draw", this).call(this, f);

      // track split lines
      this.cutLines.map(function (cut, i) {

        var c, di;
        var offset = _this4.offset * Math.sin(_this4.radian * (i + 1) / 10);
        if (i < 10) {
          di = i % Math.floor(_this4.cutLines.length / 2) + 1;
          c = new Line(cut.$add(offset * di, 0)).to(cut.p1.$add(-offset * di, 0));
        } else {
          di = (i - 10) % Math.floor(_this4.cutLines.length / 2) + 1;
          c = new Line(cut.$add(0, offset * di)).to(cut.p1.$add(0, -offset * di));
        }
        f.stroke("#fff").line(c);

        _this4._continuous(c, i, f);
      });
    }
  }]);

  return ReflectLine;
})(NoiseLine);