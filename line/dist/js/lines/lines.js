"use strict";

var _get = function get(_x84, _x85, _x86) { var _again = true; _function: while (_again) { var object = _x84, property = _x85, receiver = _x86; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x84 = parent; _x85 = property; _x86 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
      var distRatio = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

      if (last) {
        var ln = new Line(last).to(curr);
        var dr1 = distRatio != null ? distRatio : 1;
        var dr2 = distRatio != null ? 1 - distRatio : 1;
        return { p1: ln.getPerpendicular(t, dist * dr1).p1, p2: ln.getPerpendicular(t, dist * dr2, true).p1 };
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
      var maxDist = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      var last = null;

      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        if (maxDist > 0) dist = Math.min(dist, maxDist);
        var normal = this._getSegmentNormal(last, vec, dist);
        last = vec.clone();

        // draw normal lines
        this.line(new Line(normal.p1).to(normal.p2));
      }
    }
  }, {
    key: "arcLine",
    value: function arcLine(pts) {
      var distRatio = arguments.length <= 1 || arguments[1] === undefined ? 0.5 : arguments[1];
      var maxDist = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      var repeats = arguments.length <= 3 || arguments[3] === undefined ? 7 : arguments[3];
      var startAngle = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

      var last = null;

      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        if (maxDist > 0) dist = Math.min(dist, maxDist);

        // draw normal lines
        if (last != null) {

          var gap = dist / 3;
          var r = Math.PI / 8;

          for (var n = 1; n < repeats; n++) {
            var offset = n / 10 + 2 * i / pts.length + startAngle;
            var circle = new Circle(vec.$subtract(last).divide(2).add(last)).setRadius(gap * n + gap);
            var d = n % 2 == 0 ? offset : -offset;
            d *= i * Const.one_degree;
            this.arc(circle, d, d + r);
          }
        }

        last = vec.clone();
        //this.line( new Line(normal.p1).to(normal.p2));
      }
    }
  }, {
    key: "zigZagLine",
    value: function zigZagLine(pts) {
      var distRatio = arguments.length <= 1 || arguments[1] === undefined ? 0.5 : arguments[1];
      var maxDist = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      var last = null;
      var zz = [];

      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        if (maxDist > 0) dist = Math.min(dist, maxDist);

        if (!last) last = vec.clone();
        var ln = new Line(last).to(vec);
        zz.push(ln.getPerpendicular(0, dist, i % 2 === 0).p1);

        last = vec.clone();
      }

      this.polygon(new Curve().to(zz).catmullRom(5), false, false);
    }
  }, {
    key: "restatedLine",
    value: function restatedLine(pts) {

      var c1 = [];
      var c2 = [];
      var c3 = [];

      for (var i = 0; i < pts.length; i++) {
        if (i % 3 === 0) {
          c1.push(pts[i]);
        } else if (i % 3 === 1) {
          c2.push(pts[i]);
        } else {
          c3.push(pts[i]);
        }
      }
      this.polygon(new Curve().to(c1).cardinal(5, 0.6), false, false);
      this.polygon(new Curve().to(c2).cardinal(5, 0.45), false, false);
      this.polygon(new Curve().to(c3).bspline(5), false, false);
    }
  }, {
    key: "hatchingLine",
    value: function hatchingLine(pts) {
      var gap = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

      var ps1 = [];
      var ps2 = [];
      var ps3 = [];

      for (var i = 0; i < pts.length; i++) {
        var d1 = i % gap;
        var d2 = i % (gap * 2);
        var d3 = i % (gap * 3);
        if (ps1[d1] && ps2[d2] && ps3[d3]) {
          this.curve(new Curve().to([ps3[d3], ps2[d2], ps1[d1], pts[i]]).bspline(10));
        }

        ps3[d3] = ps2[d2];
        ps2[d2] = ps1[d1];
        ps1[d1] = pts[i];
      }
    }
  }, {
    key: "innerLine",
    value: function innerLine(pts) {
      var nums = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];
      var distRatio = arguments.length <= 2 || arguments[2] === undefined ? 0.5 : arguments[2];
      var smoothSteps = arguments.length <= 3 || arguments[3] === undefined ? 3 : arguments[3];
      var maxDist = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

      var last = null;
      var normals = [];
      var distSteps = [];

      // init normal arrays
      for (var n = 0; n < nums; n++) {
        normals[n] = [];
      }

      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        if (maxDist > 0) dist = Math.min(dist, maxDist);
        dist = this._smooth(distSteps, dist, smoothSteps);

        var normal = this._getSegmentNormal(last, vec, dist);
        last = vec.clone();

        var subs = new Line(normal.p1).to(normal.p2).subpoints(nums);
        for (n = 0; n < nums; n++) {
          normals[n].push(subs[n]);
        }
      }

      for (n = 0; n < nums; n++) {
        this.polygon(normals[n], false, false);
      }
    }
  }, {
    key: "innerWiggleLine",
    value: function innerWiggleLine(pts) {
      var nums = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];
      var thickness = arguments.length <= 2 || arguments[2] === undefined ? 100 : arguments[2];
      var wiggle = arguments.length <= 3 || arguments[3] === undefined ? { angle: 0, step: 0.01 } : arguments[3];
      var distRatio = arguments.length <= 4 || arguments[4] === undefined ? 0.5 : arguments[4];
      var smoothSteps = arguments.length <= 5 || arguments[5] === undefined ? 3 : arguments[5];
      var maxDist = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

      var last = null;
      var normals = [];
      var distSteps = [];

      // init normal arrays
      for (var n = 0; n < nums; n++) {
        normals[n] = [];
      }

      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        if (maxDist > 0) dist = Math.min(dist, maxDist);
        dist = thickness - Math.max(10, Math.min(thickness, dist));
        dist = this._smooth(distSteps, dist, smoothSteps);

        var w = (Math.sin(wiggle.angle + wiggle.step * i) + 1) / 2;

        var normal = this._getSegmentNormal(last, vec, dist, 0.5, w);
        last = vec.clone();

        var subs = new Line(normal.p1).to(normal.p2).subpoints(nums);
        for (n = 0; n < nums; n++) {
          normals[n].push(subs[n]);
        }
      }

      for (n = 0; n < nums; n++) {
        this.polygon(normals[n], false, false);
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
      var maxDist = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

      var last = null;
      var lastNormal = { p1: false, p2: false };
      var distSteps = [];

      // go through each points
      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        if (maxDist > 0) dist = Math.min(dist, maxDist);
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
      var maxDist = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];
      var layers = arguments.length <= 7 || arguments[7] === undefined ? 15 : arguments[7];
      var magnify = arguments.length <= 8 || arguments[8] === undefined ? 3 : arguments[8];
      var curveSegments = arguments.length <= 9 || arguments[9] === undefined ? 0 : arguments[9];

      var last = null;
      var distSteps = [];

      // segment list keeps track of the points (a simplified convex hull)
      var segs = new SegmentList(layers);

      // go through each points
      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        if (maxDist > 0) dist = Math.min(dist, maxDist);
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
  }, {
    key: "noiseDashLine",
    value: function noiseDashLine(pts, noise) {
      var nf = arguments.length <= 2 || arguments[2] === undefined ? { a: 0, b: 0.005, c: 0.005 } : arguments[2];
      var flipSpeed = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var distRatio = arguments.length <= 4 || arguments[4] === undefined ? 0.5 : arguments[4];
      var smoothSteps = arguments.length <= 5 || arguments[5] === undefined ? 1 : arguments[5];
      var maxDist = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];
      var layers = arguments.length <= 7 || arguments[7] === undefined ? 15 : arguments[7];
      var magnify = arguments.length <= 8 || arguments[8] === undefined ? 3 : arguments[8];
      var curveSegments = arguments.length <= 9 || arguments[9] === undefined ? 0 : arguments[9];

      var last = null;
      var lastLayer = [];
      var olderLayer = [];
      var distSteps = [];

      // go through each points
      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        if (maxDist > 0) dist = Math.min(dist, maxDist);
        dist = flipSpeed > 0 ? flipSpeed - Math.min(flipSpeed, dist) : dist;
        dist = this._smooth(distSteps, dist, smoothSteps);

        // noise segments for each layer
        for (var n = 1; n < layers; n++) {

          var nfactors = nf.a + n * nf.b + i * nf.c;
          var ndist = this._getNoiseDistance(noise, nfactors, dist, n / layers, magnify);
          var normal = this._getSegmentNormal(last, vec, ndist, 0.5, distRatio);

          if (lastLayer[n] && (i + n) % 2 === 0) {
            var older = olderLayer[n] && Math.abs(i - n) % 3 == 0 ? olderLayer : lastLayer;

            this.line(new Line(older[n].p1).to(normal.p1));
            this.line(new Line(older[n].p2).to(normal.p2));

            olderLayer[n] = { p1: lastLayer[n].p1, p2: lastLayer[n].p2 };
          }

          lastLayer[n] = { p1: normal.p1, p2: normal.p2 };
        }

        last = vec.clone();
      }
    }
  }, {
    key: "noiseChopLine",
    value: function noiseChopLine(pts, noise) {
      var nf = arguments.length <= 2 || arguments[2] === undefined ? { a: 0, b: 0.005, c: 0.005 } : arguments[2];
      var flipSpeed = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var distRatio = arguments.length <= 4 || arguments[4] === undefined ? 0.5 : arguments[4];
      var smoothSteps = arguments.length <= 5 || arguments[5] === undefined ? 1 : arguments[5];
      var maxDist = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];
      var layers = arguments.length <= 7 || arguments[7] === undefined ? 15 : arguments[7];
      var magnify = arguments.length <= 8 || arguments[8] === undefined ? 3 : arguments[8];
      var curveSegments = arguments.length <= 9 || arguments[9] === undefined ? 0 : arguments[9];

      var last = null;
      var lastPt = [];
      var olderLayer = [];
      var distSteps = [];

      // go through each points
      for (var i = 0; i < pts.length; i++) {
        var vec = new Vector(pts[i]);

        // smooth distance
        var dist = this._getSegmentDistance(last, vec, i) * distRatio;
        if (maxDist > 0) dist = Math.min(dist, maxDist);
        dist = flipSpeed > 0 ? flipSpeed - Math.min(flipSpeed, dist) : dist;
        dist = this._smooth(distSteps, dist, smoothSteps);

        // noise segments for each layer
        for (var n = 1; n < layers; n++) {

          var nfactors = nf.a + n * nf.b + i * nf.c;
          var ndist = this._getNoiseDistance(noise, nfactors, dist, n / layers, magnify);
          var normal = this._getSegmentNormal(last, vec, ndist, 0.2, distRatio);
          var normal2 = this._getSegmentNormal(last, vec, ndist, 0.8, distRatio);

          if (lastPt[n]) {
            var chop = Math.floor(10 * ndist / dist);
            if (chop > 2) {
              this.line(new Line(lastPt[n].np1).to(normal2.p1));
              this.line(new Line(lastPt[n].p1).to(normal.p1));
            }
          }

          lastPt[n] = { p1: normal.p1.clone(), p2: normal.p2.clone(), np1: normal2.p1.clone(), np2: normal2.p2.clone() };
        }

        last = vec.clone();
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

    this.canvasSize = new Vector();
    this.pressed = false; // mouse pressed
    this.form = null;

    this.maxPoints = 200;
    this.maxTracePoints = 30;

    this.pointThreshold = 10;
    this.distanceThreshold = 200 * 200;

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

  _createClass(BaseLine, [{
    key: "init",
    value: function init(space) {
      var maxPoints = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.canvasSize.set(space.size);
      this.form = new MovingLineForm(space);
      if (maxPoints) this.maxPoints = maxPoints;
      return this;
    }
  }, {
    key: "getColor",
    value: function getColor() {
      var c = arguments.length <= 0 || arguments[0] === undefined ? "color" : arguments[0];

      if (!this.tracing) {
        return this[c].dark;
      } else {
        return this.counter % 2 === 0 ? this[c].dark2 : this[c].light2;
      }
    }

    /**
     * Space's animate callback. Override in subclass for additional features and drawing styles.
     */
  }, {
    key: "animate",
    value: function animate(time, fs, context) {
      this.counter++;
      this.draw();
    }
  }, {
    key: "trace",
    value: function trace(b) {
      this.tracing = b;
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke(this.getColor()).fill(false);
      f.curve(this.catmullRom(5), false);
    }

    /**
     * Trim points array if max point is reached. Override in subclass for additional features.
     */
  }, {
    key: "trim",
    value: function trim() {
      var m = this.tracing ? this.maxTracePoints : this.maxPoints;
      if (this.points.length > m) {
        this.disconnect(Math.floor(this.points.length / 100));
      }
    }
  }, {
    key: "glue",
    value: function glue(mag) {
      if (mag > this.distanceThreshold) {

        if (mag > this.distanceThreshold * 3) {
          this.points = [this.points.pop()];
          return;
        }
        var p2 = this.points.pop();
        var p1 = this.points.pop();
        var lns = new Line(p1).to(p2).subpoints(Math.floor(this.distanceThreshold / 5000));

        this.to(lns);
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
        this.glue(last);

        if (this.pressed) this.drag(x, y);
      }
    }

    /**
     * When dragging. Override in subclass for additional features.
     */
  }, {
    key: "drag",
    value: function drag(x, y) {
      this.tracing = true;
    }

    /**
     * When pencil is down. Override in subclass for additional features.
     */
  }, {
    key: "down",
    value: function down(x, y) {
      this.points = [];
      this.tracing = !this.tracing;
    }

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

    this.pointThreshold = 50;

    this.color = {
      dark: "#42dc8e",
      dark2: "rgba(66,220,142, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }

  _createClass(DottedLine, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.fill(this.getColor()).stroke(false);
      f.dottedLine(this.points, 3, 3, 0.5);
    }
  }]);

  return DottedLine;
})(BaseLine);

var InterpolatedLine = (function (_BaseLine2) {
  _inherits(InterpolatedLine, _BaseLine2);

  function InterpolatedLine() {
    _classCallCheck(this, InterpolatedLine);

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    _get(Object.getPrototypeOf(InterpolatedLine.prototype), "constructor", this).apply(this, args);

    this.pointThreshold = 50;
    this.maxPoints = 200;

    this.steps = 5;
    this._counter = 0;
    this.direction = 1;

    this.color = {
      dark: "rgba(51,64,87, .5)",
      dark2: "rgba(51,64,87, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "rgba(255,0,0,.8)",
      dark2: "rgba(255,0,0, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }

  _createClass(InterpolatedLine, [{
    key: "down",
    value: function down(x, y) {
      this.points = [new Vector(x, y), new Vector(x, y), new Vector(x, y), new Vector(x, y)];
      this._counter = 0;
      this.tracing = !this.tracing;
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      if (this.points.length < 4 || !this.points[0]) return;

      // increment counter, and flip direction when reached the end
      this._counter += this.direction;
      if (this._counter >= this.points.length * this.steps - 4 || this._counter <= 0) this.direction *= -1;

      // find current index based on counter
      var currentIndex = Math.max(0, Math.min(this.points.length - 1, Math.floor(this._counter / this.steps)));

      // control points based on index
      var curve = new Curve().to(this.points);
      var ctrls = curve.controlPoints(currentIndex);

      // calculate t
      var t = this._counter % this.steps / this.steps;
      var ts = [t, t * t, t * t * t];

      // current interpolated position on the curve
      var pos = ctrls ? curve.catmullRomPoint(ts, ctrls) : new Vector();

      // draw
      f.stroke(this.getColor()).fill(false);
      f.curve(curve.catmullRom(5), false);

      f.stroke(false).fill(this.getColor("color2"));
      f.point(pos, 2, true);
    }
  }]);

  return InterpolatedLine;
})(BaseLine);

var HatchingLine = (function (_BaseLine3) {
  _inherits(HatchingLine, _BaseLine3);

  function HatchingLine() {
    _classCallCheck(this, HatchingLine);

    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    _get(Object.getPrototypeOf(HatchingLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 150;

    this.pointThreshold = 20;

    this.color = {
      dark: "rgba(102,117,140, .5)",
      dark2: "rgba(102,117,140, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "rgba(0,10,30,.3)",
      dark2: "rgba(0,10,30,.1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }

  _createClass(HatchingLine, [{
    key: "maxDistance",
    value: function maxDistance() {
      var ratio = arguments.length <= 0 || arguments[0] === undefined ? 20 : arguments[0];

      return Math.min(this.canvasSize.x, this.canvasSize.y) / ratio;
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke(this.getColor()).fill(false);
      f.hatchingLine(this.points);
    }
  }]);

  return HatchingLine;
})(BaseLine);

var SpeedLine = (function (_BaseLine4) {
  _inherits(SpeedLine, _BaseLine4);

  function SpeedLine() {
    _classCallCheck(this, SpeedLine);

    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    _get(Object.getPrototypeOf(SpeedLine.prototype), "constructor", this).apply(this, args);

    this.color = {
      dark: "#374a58",
      dark2: "rgba(55,74,88, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "#95b1f9",
      dark2: "rgba(235,46,67, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
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
  }, {
    key: "maxDistance",
    value: function maxDistance() {
      var ratio = arguments.length <= 0 || arguments[0] === undefined ? 20 : arguments[0];

      return Math.min(this.canvasSize.x, this.canvasSize.y) / ratio;
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke(this.getColor()).fill(false);
      f.polygon(this.points, false);

      f.stroke(this.getColor("color2"));
      f.speedLine(this.points, 0.5, this.maxDistance());
    }
  }]);

  return SpeedLine;
})(BaseLine);

var ZigZagLine = (function (_SpeedLine) {
  _inherits(ZigZagLine, _SpeedLine);

  function ZigZagLine() {
    _classCallCheck(this, ZigZagLine);

    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    _get(Object.getPrototypeOf(ZigZagLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 150;

    this.pointThreshold = 50;

    this.color = {
      dark: "#66758c",
      dark2: "rgba(102,117,140, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "rgba(66,220,142, .5)",
      dark2: "rgba(66,220,142, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }

  _createClass(ZigZagLine, [{
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
  }, {
    key: "maxDistance",
    value: function maxDistance() {
      var ratio = arguments.length <= 0 || arguments[0] === undefined ? 20 : arguments[0];

      return Math.min(this.canvasSize.x, this.canvasSize.y) / ratio;
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke(false).fill(this.getColor("color2"));
      f.points(this.points, 1);
      f.stroke(this.getColor("color2")).fill(false).polygon(this.points, false);

      f.stroke(this.getColor()).fill(false);
      f.zigZagLine(this.points, 0.5, this.maxDistance());
    }
  }]);

  return ZigZagLine;
})(SpeedLine);

var RestatedLine = (function (_SpeedLine2) {
  _inherits(RestatedLine, _SpeedLine2);

  function RestatedLine() {
    _classCallCheck(this, RestatedLine);

    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    _get(Object.getPrototypeOf(RestatedLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 150;

    this.pointThreshold = 7 * 7;

    this.color = {
      dark: "rgba(102,117,140, .5)",
      dark2: "rgba(102,117,140, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "rgba(0,10,30,.3)",
      dark2: "rgba(0,10,30,.1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }

  _createClass(RestatedLine, [{
    key: "maxDistance",
    value: function maxDistance() {
      var ratio = arguments.length <= 0 || arguments[0] === undefined ? 20 : arguments[0];

      return Math.min(this.canvasSize.x, this.canvasSize.y) / ratio;
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke(this.getColor()).fill(false);
      f.curve(this.catmullRom(5), false);

      f.stroke(this.getColor("color2")).fill(false);
      f.restatedLine(this.points, 10, 0.2, 0.2);
    }
  }]);

  return RestatedLine;
})(SpeedLine);

var SpeedBrush = (function (_SpeedLine3) {
  _inherits(SpeedBrush, _SpeedLine3);

  function SpeedBrush() {
    _classCallCheck(this, SpeedBrush);

    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    _get(Object.getPrototypeOf(SpeedBrush.prototype), "constructor", this).apply(this, args);

    this._flip = 0;
    this.flipSpeed = 0;
    this.maxPoints = 100;

    this.color = {
      dark: "#95b1f9",
      dark2: "rgba(255,255,255, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .05)"
    };

    this.color2 = {
      dark: "rgba(51,64,87, .1)",
      dark2: "rgba(51,64,87, .05)",
      light: "#fff",
      light2: "rgba(255,255,255, .05)"
    };
  }

  _createClass(SpeedBrush, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke(false).fill(this.getColor("color2"));
      f.speedPolygon(this.points, this.flipSpeed, 0.5, 1, this.maxDistance());

      f.stroke(this.getColor("color2")).fill(false);
      f.speedLine(this.points);

      f.stroke(this.getColor()).fill(false);
      f.polygon(this.points, false);
      //this.form.curve( this.catmullRom(5) );
      //this.drawLine();
    }
  }, {
    key: "up",
    value: function up(x, y) {
      if (++this._flip % 2 === 0) {
        this.flipSpeed = this.flipSpeed > 0 ? 0 : 15;
      }
    }
  }]);

  return SpeedBrush;
})(SpeedLine);

var SmoothSpeedBrush = (function (_SpeedLine4) {
  _inherits(SmoothSpeedBrush, _SpeedLine4);

  function SmoothSpeedBrush() {
    _classCallCheck(this, SmoothSpeedBrush);

    for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }

    _get(Object.getPrototypeOf(SmoothSpeedBrush.prototype), "constructor", this).apply(this, args);

    this._flip = 0;
    this.flipSpeed = 0;
    this.maxPoints = 100;

    this.color = {
      dark: "#374a58",
      dark2: "rgba(55,74,88, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "rgba(0,0,0,.5)",
      dark2: "rgba(0,0,0, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }

  _createClass(SmoothSpeedBrush, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      // connect polygons
      f.stroke(false).fill(this.getColor());
      f.speedPolygon(this.points, 0, 0.5, 7, this.maxDistance());

      // draw regular path
      f.stroke(this.getColor("color2")).fill(false);
      f.polygon(this.points, false);
    }
  }, {
    key: "up",
    value: function up(x, y) {
      //if (++this._flip % 2 === 0) {
      //  this.flipSpeed = (this.flipSpeed > 0) ? 0 : 15;
      //}
    }
  }]);

  return SmoothSpeedBrush;
})(SpeedLine);

var InnerLine = (function (_SmoothSpeedBrush) {
  _inherits(InnerLine, _SmoothSpeedBrush);

  function InnerLine() {
    _classCallCheck(this, InnerLine);

    for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    _get(Object.getPrototypeOf(InnerLine.prototype), "constructor", this).apply(this, args);

    this.flipSpeed = 0;
    this.maxPoints = 100;

    this.color = {
      dark: "#ff2d5d",
      dark2: "rgba(255,45,93, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }

  _createClass(InnerLine, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      // connect polygons
      f.stroke(this.getColor()).fill(false);
      f.innerLine(this.points, 10, 1, 7);
    }
  }, {
    key: "up",
    value: function up() {}
  }]);

  return InnerLine;
})(SmoothSpeedBrush);

var WiggleLine = (function (_InnerLine) {
  _inherits(WiggleLine, _InnerLine);

  function WiggleLine() {
    _classCallCheck(this, WiggleLine);

    for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      args[_key12] = arguments[_key12];
    }

    _get(Object.getPrototypeOf(WiggleLine.prototype), "constructor", this).apply(this, args);

    this.flipSpeed = 0;
    this.maxPoints = 100;
    this.angle = 0;

    this.color = {
      dark: "rgba(0,0,0,0.25)",
      dark2: "rgba(0,0,0, .05)",
      light: "#fff",
      light2: "rgba(255,255,255, .05)"
    };
  }

  _createClass(WiggleLine, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      this.angle += Const.one_degree;

      // connect polygons
      f.stroke(this.getColor()).fill(false);
      f.innerWiggleLine(this.points, 20, 70, { angle: this.angle, step: Const.one_degree * 5 }, 1.5, 2);
    }
  }]);

  return WiggleLine;
})(InnerLine);

var NoiseLine = (function (_SpeedBrush) {
  _inherits(NoiseLine, _SpeedBrush);

  function NoiseLine() {
    _classCallCheck(this, NoiseLine);

    for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
      args[_key13] = arguments[_key13];
    }

    _get(Object.getPrototypeOf(NoiseLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 60;
    this.maxTracePoints = 20;

    this.noise = new Noise();

    // noise seed defines the styles
    this.seeds = [0.7642476900946349, 0.04564903723075986, 0.4202376299072057, 0.35483957454562187, 0.9071740123908967, 0.8731264418456703, 0.7436990102287382, 0.23965814616531134];

    this.seedIndex = 2;
    this.noise.seed(this.seeds[this.seedIndex]);

    this.pointThreshold = 20;
    this.flipSpeed = 0;

    // override color
    this.color = {
      dark: "rgba(0,0,0,.3)",
      dark2: "rgba(0,0,0,.05)",
      light: "#f3f5f9",
      light2: "rgba(243,245,249, 0)"
    };
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

      f.stroke(this.getColor()).fill(false);

      var distRatio = 1;
      var smooth = 3;
      var layers = 3;
      var magnify = 1;
      var curveSegments = 3;

      var noiseFactors = { a: 0, b: 0.01, c: 0.01 };
      f.noisePolygon(this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);
    }
  }, {
    key: "up",
    value: function up() {
      if (++this._flip % 2 === 0) {
        this.flipSpeed = this.flipSpeed > 0 ? 0 : 25;
      }
      this.seed();
    }
  }]);

  return NoiseLine;
})(SpeedBrush);

var NoiseBrush = (function (_SpeedBrush2) {
  _inherits(NoiseBrush, _SpeedBrush2);

  function NoiseBrush() {
    _classCallCheck(this, NoiseBrush);

    for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
      args[_key14] = arguments[_key14];
    }

    _get(Object.getPrototypeOf(NoiseBrush.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 50;
    this.maxTracePoints = 20;

    this.noise = new Noise();

    // noise seed defines the styles
    this.seeds = [0.7642476900946349, 0.04564903723075986, 0.4202376299072057, 0.35483957454562187, 0.9071740123908967, 0.8731264418456703, 0.7436990102287382, 0.23965814616531134];

    this.seedIndex = 2;
    this.noise.seed(this.seeds[this.seedIndex]);

    this.pointThreshold = 20;
    this.flipSpeed = 0;

    // override color
    this.color = {
      dark: "rgba(0,0,0,.6)",
      dark2: "rgba(0,0,0,.05)",
      light: "#f3f5f9",
      light2: "rgba(243,245,249, 0)"
    };
  }

  _createClass(NoiseBrush, [{
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

      f.stroke(false).fill(this.getColor());

      var distRatio = 0.5;
      var smooth = 3;
      var layers = 5;
      var magnify = 2;
      var curveSegments = 3;

      var noiseFactors = { a: 0, b: 0.01, c: 0.01 };
      f.noisePolygon(this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);
    }
  }, {
    key: "up",
    value: function up() {
      _get(Object.getPrototypeOf(NoiseBrush.prototype), "up", this).call(this);
      this.seed();
    }
  }]);

  return NoiseBrush;
})(SpeedBrush);

var SmoothNoiseLine = (function (_SpeedBrush3) {
  _inherits(SmoothNoiseLine, _SpeedBrush3);

  function SmoothNoiseLine() {
    _classCallCheck(this, SmoothNoiseLine);

    for (var _len15 = arguments.length, args = Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
      args[_key15] = arguments[_key15];
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

    this.color = {
      dark: "rgba(50,30,140, .3)",
      dark2: "rgba(50,30,140, .05)",
      light: "#fff",
      light2: "rgba(255,255,255, .05)"
    };
  }

  _createClass(SmoothNoiseLine, [{
    key: "seed",
    value: function seed() {
      this.noise = new Noise();
      this.seedIndex = this.seedIndex >= this.seeds.length - 1 ? 0 : this.seedIndex + 1;
      this.noise.seed(this.seeds[this.seedIndex]);
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      //f.fill( `rgba(255,255,255,${this.alpha})` ).stroke( `rgba(20,0,70,${this.alpha})` );

      f.fill(false).stroke(this.getColor());

      var distRatio = 1;
      var smooth = 4;
      var layers = 8;
      var magnify = 1.2;
      var curveSegments = 3;

      this.noiseProgress += 0.004;
      var noiseFactors = { a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
      f.noisePolygon(this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);
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

var NoiseDashLine = (function (_SpeedBrush4) {
  _inherits(NoiseDashLine, _SpeedBrush4);

  function NoiseDashLine() {
    _classCallCheck(this, NoiseDashLine);

    for (var _len16 = arguments.length, args = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
      args[_key16] = arguments[_key16];
    }

    _get(Object.getPrototypeOf(NoiseDashLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 50;

    this.noise = new Noise();
    this.noiseProgress = 0.01;

    // noise seed defines the styles
    this.seeds = [0.7642476900946349, 0.04564903723075986, 0.4202376299072057, 0.35483957454562187, 0.9071740123908967, 0.8731264418456703, 0.7436990102287382, 0.23965814616531134];

    this.seedIndex = 5;
    this.noise.seed(this.seeds[this.seedIndex]);

    this.noiseFactorIndex = 0.01;
    this.noiseFactorLayer = 0.03;
    this.alpha = 0.25;

    this.pointThreshold = 20;
    this.flipSpeed = 0;

    this.color = {
      dark: "rgba(20,10,0, .3)",
      dark2: "rgba(20,10,0, .05)",
      light: "#fff",
      light2: "rgba(255,255,255, .05)"
    };
  }

  _createClass(NoiseDashLine, [{
    key: "seed",
    value: function seed() {
      this.noise = new Noise();
      this.seedIndex = this.seedIndex >= this.seeds.length - 1 ? 0 : this.seedIndex + 1;
      this.noise.seed(this.seeds[this.seedIndex]);
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      //f.fill( `rgba(255,255,255,${this.alpha})` ).stroke( `rgba(20,0,70,${this.alpha})` );

      f.fill(false).stroke(this.getColor());

      var distRatio = (this.seedIndex + 1) / 5;
      var smooth = 4;
      var layers = 8;
      var magnify = 1.2;
      var curveSegments = 3;

      this.noiseProgress += 0.004;
      var noiseFactors = { a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
      f.noiseDashLine(this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);
    }
  }, {
    key: "up",
    value: function up() {
      _get(Object.getPrototypeOf(NoiseDashLine.prototype), "up", this).call(this);
      this.seed();

      this.noiseFactorIndex = Math.max(0.002, Math.random() / 10);
      this.noiseFactorLayer = Math.max(0.002, Math.random() / 10);
      this.alpha += 0.1;
      if (this.alpha > 0.7) this.alpha = 0.05;
    }
  }]);

  return NoiseDashLine;
})(SpeedBrush);

var NoiseChopLine = (function (_SpeedBrush5) {
  _inherits(NoiseChopLine, _SpeedBrush5);

  function NoiseChopLine() {
    _classCallCheck(this, NoiseChopLine);

    for (var _len17 = arguments.length, args = Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
      args[_key17] = arguments[_key17];
    }

    _get(Object.getPrototypeOf(NoiseChopLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 100;

    this.noise = new Noise();
    this.noiseProgress = 0.01;

    // noise seed defines the styles
    this.seeds = [0.7642476900946349, 0.04564903723075986, 0.4202376299072057, 0.35483957454562187, 0.9071740123908967, 0.8731264418456703, 0.7436990102287382, 0.23965814616531134];

    this.seedIndex = 5;
    this.noise.seed(this.seeds[this.seedIndex]);

    this.noiseFactorIndex = 0.01;
    this.noiseFactorLayer = 0.03;
    this.alpha = 0.25;

    this.pointThreshold = 20;
    this.flipSpeed = 0;

    this.color = {
      dark: "rgba(20,10,0, .3)",
      dark2: "rgba(20,10,0, .05)",
      light: "#fff",
      light2: "rgba(255,255,255, .05)"
    };
  }

  _createClass(NoiseChopLine, [{
    key: "seed",
    value: function seed() {
      this.noise = new Noise();
      this.seedIndex = this.seedIndex >= this.seeds.length - 1 ? 0 : this.seedIndex + 1;
      this.noise.seed(this.seeds[this.seedIndex]);
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.fill(false).stroke(this.getColor());

      var distRatio = 1;
      var smooth = 4;
      var layers = 5;
      var magnify = 1;
      var curveSegments = 3;

      this.noiseProgress -= 0.008;
      var noiseFactors = { a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
      f.noiseChopLine(this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);
    }
  }, {
    key: "up",
    value: function up() {
      _get(Object.getPrototypeOf(NoiseChopLine.prototype), "up", this).call(this);
      this.seed();

      this.noiseFactorIndex = Math.max(0.002, Math.random() / 10);
      this.noiseFactorLayer = Math.max(0.002, Math.random() / 10);
      this.alpha += 0.1;
      if (this.alpha > 0.7) this.alpha = 0.05;
    }
  }]);

  return NoiseChopLine;
})(SpeedBrush);

var LagLine = (function (_BaseLine5) {
  _inherits(LagLine, _BaseLine5);

  function LagLine() {
    _classCallCheck(this, LagLine);

    for (var _len18 = arguments.length, args = Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
      args[_key18] = arguments[_key18];
    }

    _get(Object.getPrototypeOf(LagLine.prototype), "constructor", this).apply(this, args);

    this.pointThreshold = 50;
    this.maxPoints = 200;

    this.targets = [];
    this.ang = 0;

    this.color = {
      dark: "rgba(51,64,87, .5)",
      dark2: "rgba(51,64,87, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "rgba(255,0,0,.8)",
      dark2: "rgba(255,0,0, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };
  }

  _createClass(LagLine, [{
    key: "trim",
    value: function trim() {
      _get(Object.getPrototypeOf(LagLine.prototype), "trim", this).call(this);
    }
  }, {
    key: "move",
    value: function move(x, y, z) {
      _get(Object.getPrototypeOf(LagLine.prototype), "move", this).call(this, x, y, z);
      this.targets = [];
      for (var i = 2; i < this.points.length - 2; i++) {
        this.targets[i - 2] = this.points[i - 2];
        //this.targets[i-2] = this.points[i-2].clone();
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      this.ang += Const.one_degree;

      if (this.targets.length > 3 && this.points.length > 10) {
        for (var t = 0; t < this.targets.length; t++) {

          var d = this.targets[t].$subtract(this.points[t + 1]);
          var d2 = this.points[t].$subtract(this.points[t + 1]);
          this.targets[t].subtract(d2.multiply(0.11));
        }

        f.stroke(this.getColor()).fill(false);
        //f.dottedLine( this.points );

        //f.stroke( this.getColor("color2") ).fill( false );
        f.zigZagLine(this.targets);
      }
    }
  }]);

  return LagLine;
})(BaseLine);

var ContinuousLine = (function (_NoiseLine) {
  _inherits(ContinuousLine, _NoiseLine);

  function ContinuousLine() {
    _classCallCheck(this, ContinuousLine);

    for (var _len19 = arguments.length, args = Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
      args[_key19] = arguments[_key19];
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

    for (var _len20 = arguments.length, args = Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
      args[_key20] = arguments[_key20];
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

    for (var _len21 = arguments.length, args = Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
      args[_key21] = arguments[_key21];
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

var ArcLine = (function (_BaseLine6) {
  _inherits(ArcLine, _BaseLine6);

  function ArcLine() {
    _classCallCheck(this, ArcLine);

    for (var _len22 = arguments.length, args = Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
      args[_key22] = arguments[_key22];
    }

    _get(Object.getPrototypeOf(ArcLine.prototype), "constructor", this).apply(this, args);

    this.color = {
      dark: "#374a58",
      dark2: "rgba(55,74,88, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.color2 = {
      dark: "#95b1f9",
      dark2: "rgba(149,177,249, .1)",
      light: "#fff",
      light2: "rgba(255,255,255, .1)"
    };

    this.ang = 0;
  }

  _createClass(ArcLine, [{
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
  }, {
    key: "maxDistance",
    value: function maxDistance() {
      var ratio = arguments.length <= 0 || arguments[0] === undefined ? 20 : arguments[0];

      return Math.min(this.canvasSize.x, this.canvasSize.y) / ratio;
    }
  }, {
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      f.stroke(this.getColor()).fill(false);
      f.polygon(this.points, false);

      f.stroke(this.getColor("color2"));
      f.arcLine(this.points, 0.5, this.maxDistance(), 7, this.ang += Const.one_degree / 10);
    }
  }]);

  return ArcLine;
})(BaseLine);