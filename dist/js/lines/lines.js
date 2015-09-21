"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseLine = (function (_Curve) {
  _inherits(BaseLine, _Curve);

  function BaseLine() {
    _classCallCheck(this, BaseLine);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(BaseLine.prototype), "constructor", this).apply(this, args);

    this.pressed = false; // mouse pressed
    this.form = null;
    this.maxPoints = 50;
  }

  /**
   * Initiate it with a form
   * @param form Form instance
   * @param maxPoints optionally, set a maximum number of point on this line
   */

  _createClass(BaseLine, [{
    key: "init",
    value: function init(form) {
      var maxPoints = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.form = form;
      if (maxPoints) this.maxPoints = maxPoints;
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
      this.to(x, y);
      this.trim();
      if (this.pressed) this.drag(x, y);
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

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _get(Object.getPrototypeOf(DottedLine.prototype), "constructor", this).apply(this, args);
  }

  _createClass(DottedLine, [{
    key: "drawLine",
    value: function drawLine() {

      form.fill("rgba(0,0,0,.3").stroke(false);
      form.points(this.points, 2, true);

      var last = this.points[0];
      var count = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var p = _step.value;

          var ln = new Line(p).to(last);

          var pts = ln.subpoints(5);

          form.points(pts, 0.5);

          last = new Vector(ln);
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
    }
  }, {
    key: "animate",
    value: function animate(time, fps, context) {
      this.drawLine();
    }
  }]);

  return DottedLine;
})(BaseLine);

var SpeedLine = (function (_BaseLine2) {
  _inherits(SpeedLine, _BaseLine2);

  function SpeedLine() {
    _classCallCheck(this, SpeedLine);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    _get(Object.getPrototypeOf(SpeedLine.prototype), "constructor", this).apply(this, args);

    this.maxPoints = 5;
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
  }, {
    key: "drawSegments",
    value: function drawSegments(last, curr, index) {

      if (last && curr) {

        var dist = curr.distance(last) / this.speedRatio;

        var ln = new Line(last).to(curr);
        var a = ln.getPerpendicular(0.5, dist);
        var b = ln.getPerpendicular(0.5, dist, true);

        this.drawSpeed(index, dist, ln, a, b);
      }
    }
  }, {
    key: "drawSpeed",
    value: function drawSpeed(index, dist, line, seg1, seg2) {
      this.form.stroke("rgba(0,0,0,.4)").fill(false);
      this.form.point(this.points[index], 0.5);
      this.form.line(line);
      this.form.line(seg1);
      this.form.line(seg2);
    }
  }, {
    key: "drawLine",
    value: function drawLine() {

      var last = null;
      var count = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var p = _step2.value;

          var vec = new Vector(p);
          this.drawSegments(last, vec, count++);
          last = vec.clone();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "animate",
    value: function animate(time, fps, context) {
      //this.form.stroke("rgba(0,0,0,.4)");
      //this.form.curve( this.catmullRom(5) );
      this.drawLine();
    }
  }, {
    key: "trim",
    value: function trim() {
      if (this.points.length > this.maxPoints) {
        this.disconnect(Math.floor(this.points.length / 100));
      }
    }
  }, {
    key: "move",
    value: function move(x, y, z) {
      this.to(x, y);
      this.trim();
      if (this.pressed) this.drag(x, y);
    }
  }, {
    key: "drag",
    value: function drag(x, y) {}
  }, {
    key: "down",
    value: function down(x, y) {}
  }, {
    key: "up",
    value: function up(x, y) {}
  }]);

  return SpeedLine;
})(BaseLine);

var SpeedBrush = (function (_SpeedLine) {
  _inherits(SpeedBrush, _SpeedLine);

  function SpeedBrush() {
    _classCallCheck(this, SpeedBrush);

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    _get(Object.getPrototypeOf(SpeedBrush.prototype), "constructor", this).apply(this, args);

    this.lastDist = 1;
    this.lastSegments = { a: false, b: false };
    this.flipSpeed = false;

    this.maxPoints = 100;
  }

  _createClass(SpeedBrush, [{
    key: "drawSegments",
    value: function drawSegments(last, curr, index) {

      if (last && curr) {

        var dist = curr.distance(last) / this.speedRatio;
        dist = this.flipSpeed ? 10 - Math.min(10, dist) : dist;
        dist = (this.lastDist + dist) / 2;
        this.lastDist = dist;

        var ln = new Line(last).to(curr);
        var a = ln.getPerpendicular(0.5, dist);
        var b = ln.getPerpendicular(0.5, dist, true);

        this.drawSpeed(index, dist, ln, a, b);
      }
    }
  }, {
    key: "drawSpeed",
    value: function drawSpeed(index, dist, line, seg1, seg2) {

      if (index > 1) {

        if (!this.flipSpeed) {
          this.form.stroke("rgba(0,0,0,.2)");
          this.form.line(line);
          this.form.stroke("rgba(0,0,0,.2)").fill("rgba(0,0,0,.6)");
        } else {
          this.form.stroke("#222").fill("#222");
        }

        this.form.polygon([this.lastSegments.a, this.lastSegments.b, seg2.p1, seg1.p1]);
      }
      //this.form.line( seg1 );
      //this.form.line( seg2 )

      this.lastSegments = { a: seg1.p1.clone(), b: seg2.p1.clone() };
    }
  }, {
    key: "up",
    value: function up(x, y) {
      this.flipSpeed = !this.flipSpeed;
    }
  }]);

  return SpeedBrush;
})(SpeedLine);

var WiggleLine = (function (_SpeedBrush) {
  _inherits(WiggleLine, _SpeedBrush);

  function WiggleLine() {
    _classCallCheck(this, WiggleLine);

    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
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