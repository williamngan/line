"use strict";

var _get = function get(_x12, _x13, _x14) { var _again = true; _function: while (_again) { var object = _x12, property = _x13, receiver = _x14; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x12 = parent; _x13 = property; _x14 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
    value: function _getSegmentNormal(last, curr, index, dist) {
      var t = arguments.length <= 4 || arguments[4] === undefined ? 0.5 : arguments[4];

      if (last) {
        var ln = new Line(last).to(curr);
        return { p1: ln.getPerpendicular(0.5, dist).p1, p2: ln.getPerpendicular(0.5, dist, true).p1 };
      } else {
        return { p1: curr.clone(), p2: curr.clone() };
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
  }, {
    key: "speedLine",
    value: function speedLine(pts) {
      var distRatio = arguments.length <= 1 || arguments[1] === undefined ? 0.5 : arguments[1];

      var last = null;

      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        var normal = this._getSegmentNormal(last, vec, i, dist);
        last = vec.clone();

        // draw normal lines
        this.line(new Line(normal.p1).to(normal.p2));
      }
    }
  }, {
    key: "speedPolygon",
    value: function speedPolygon(pts) {
      var flipSpeed = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var distRatio = arguments.length <= 2 || arguments[2] === undefined ? 0.5 : arguments[2];
      var smoothSteps = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

      var last = null;
      var lastNormal = { p1: false, p2: false };
      var distSteps = [];

      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        dist = flipSpeed > 0 ? flipSpeed - Math.min(flipSpeed, dist) : dist;
        dist = this._smooth(distSteps, dist, smoothSteps);

        var normal = this._getSegmentNormal(last, vec, i, dist);
        last = vec.clone();

        // draw normal lines
        this.polygon([lastNormal.p1, lastNormal.p2, normal.p2, normal.p1]);
        lastNormal = normal;
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
      this.form.stroke("rgba(0,0,0,.4)").fill(false);
      this.form.polygon(this.points, false);
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
    key: "animate",
    value: function animate(time, fps, context) {
      this.form.fill("rgba(0,0,0,.3").stroke(false);
      this.form.dottedLine(this.points);
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
    key: "animate",
    value: function animate(time, fps, context) {
      this.form.stroke("rgba(0,0,0,.4)").fill(false);
      // draw regular path
      this.form.polygon(this.points, false);
      this.form.speedLine(this.points);

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
    key: "animate",
    value: function animate(time, fps, context) {
      this.form.stroke("rgba(0,0,0,.2)").fill(false);
      // draw regular path
      this.form.polygon(this.points, false);

      this.form.stroke("rgba(0,0,0,.2)").fill("rgba(0,0,0,.6)");
      this.form.speedPolygon(this.points, this.flipSpeed, 0.5, 1);

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
    key: "animate",
    value: function animate(time, fps, context) {

      // draw regular path
      this.form.stroke("rgba(0,0,0,.2)").fill(false);
      this.form.polygon(this.points, false);

      // connect polygons
      this.form.stroke("rgba(0,0,0,.2)").fill("rgba(0,0,0,.6)");
      this.form.speedPolygon(this.points, this.flipSpeed, 0.5, 5);
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
    this.seedIndex = 0;
    this.noise.seed(this.seeds[this.seedIndex]);
    this.noiseProgress = 0.01;

    this.pointThreshold = 20;
    this.layers = 15;
    this.flipSpeed = false;

    this.lastSegments = [];
  }

  _createClass(NoiseLine, [{
    key: "drawSegments",
    value: function drawSegments(last, curr, index) {

      if (last && curr) {

        // noise increment
        this.noiseProgress += 0.4;

        // find line and distance
        var dist = Math.max(3, curr.distance(last) / this.speedRatio);
        dist = this.flipSpeed ? 10 - Math.min(10, dist) : dist;
        dist = (this.lastDist + dist) / 2;
        this.lastDist = dist;

        var ln = new Line(last).to(curr);

        // draw noises
        for (var n = 1; n < this.layers; n++) {
          this.drawNoise(index, ln, dist, n);
        }
      }
    }
  }, {
    key: "drawNoise",
    value: function drawNoise(index, ln, dist, layer) {

      // noise parameters
      var ns = index / (this.maxPoints * 5);
      var na = layer / this.layers;
      var nb = (this.layers - layer) / this.layers;

      // get next noise
      var layerset = this.noise.perlin2d(ns + na / 1.2, ns + nb / 0.8);
      var ndist = dist * layerset * (0.5 + 3 * layer / this.layers);

      // polygon points
      var a = ln.getPerpendicular(0.5, ndist);
      var b = ln.getPerpendicular(0.5, ndist, true);

      if (index > 1) {
        this.form.stroke(false).fill("rgba(0,0,0,.12)");
        this.form.polygon([this.lastSegments[layer].a, this.lastSegments[layer].b, b.p1, a.p1]);
      }

      this.lastSegments[layer] = { a: a.p1.clone(), b: b.p1.clone() };

      return [a, b];
    }
  }, {
    key: "up",
    value: function up() {
      _get(Object.getPrototypeOf(NoiseLine.prototype), "up", this).call(this);

      // new seed
      this.seedIndex++;
      if (this.seedIndex > this.seeds.length - 1) this.seedIndex = 0;
      this.noise = new Noise();
      this.noise.seed(this.seedIndex);
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

    // noise seed defines the styles
    this.seeds = [0.7642476900946349, 0.04564903723075986, 0.4202376299072057, 0.35483957454562187, 0.9071740123908967, 0.8731264418456703, 0.7436990102287382, 0.23965814616531134];
    this.seedIndex = 2;
    this.noise.seed(this.seeds[this.seedIndex]);
    this.noiseProgress = 0.01;

    this.pointThreshold = 20;

    this.flipSpeed = false;

    this.lastSegments = [];
    this.lastDist = [];

    this.layers = 12;
    this.segs = new SegmentList(this.layers);
  }

  _createClass(SmoothNoiseLine, [{
    key: "avgDist",
    value: function avgDist(d) {
      var steps = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

      this.lastDist.push(d);
      if (this.lastDist.length > steps) this.lastDist.shift();
      return this.lastDist.reduce(function (a, b) {
        return a + b;
      }, 0) / this.lastDist.length;
    }
  }, {
    key: "getSegments",
    value: function getSegments(last, curr, index) {

      if (last && curr) {

        // noise increment
        this.noiseProgress += 0.4;

        // find line and distance
        var dist = Math.max(3, curr.distance(last) / this.speedRatio);
        dist = this.flipSpeed ? 10 - Math.min(10, dist) : dist;
        dist = this.avgDist(dist);

        var ln = new Line(last).to(curr);

        // draw noises
        for (var n = 0; n < this.layers; n++) {
          this.getNoisePoints(index, ln, dist, n);
        }
      }
    }
  }, {
    key: "getNoisePoints",
    value: function getNoisePoints(index, ln, dist, layer) {

      // noise parameters
      var ns = index / (this.maxPoints * 5);
      var na = layer / this.layers;
      var nb = (this.layers - layer) / this.layers;

      // get next noise
      var layerset = this.noise.perlin2d(ns + na / 1.2, ns + nb / 0.8);
      var ndist = dist * layerset * (0.5 + 3 * layer / this.layers);

      // polygon points
      var a = ln.getPerpendicular(0.5, ndist);
      var b = ln.getPerpendicular(0.5, ndist, true);

      this.segs.add(layer, a.p1.clone(), b.p1.clone());

      /*
      if (index > 1) {
        this.form.stroke( false ).fill( `rgba(0,0,0,.12)` );
        this.form.polygon( [this.lastSegments[layer].a, this.lastSegments[layer].b, b.p1, a.p1] );
      }
        this.lastSegments[layer] = { a: a.p1.clone(), b: b.p1.clone() };
        return [a, b];
      */
    }
  }, {
    key: "drawLine",
    value: function drawLine() {

      this.form.stroke(false).fill("rgba(0,0,0,.3)");

      this.segs.reset();

      var last = this.points[0] || new Vector();
      var count = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var p = _step.value;

          var vec = new Vector(p);
          this.getSegments(last, vec, count);
          last = vec.clone();
          count++;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      for (var i = 0; i < this.layers; i++) {
        var s = this.segs.join(i);
        var curve = new Curve().to(s);
        form.polygon(curve.catmullRom(3));
      }
    }
  }, {
    key: "up",
    value: function up() {
      _get(Object.getPrototypeOf(SmoothNoiseLine.prototype), "up", this).call(this);

      // new seed
      this.seedIndex++;
      if (this.seedIndex > this.seeds.length - 1) this.seedIndex = 0;
      this.noise = new Noise();
      this.noise.seed(this.seedIndex);
    }
  }]);

  return SmoothNoiseLine;
})(SpeedBrush);