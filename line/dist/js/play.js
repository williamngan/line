"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x7, _x8, _x9) { var _again = true; _function: while (_again) { var object = _x7, property = _x8, receiver = _x9; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x7 = parent; _x8 = property; _x9 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GrowLineBrush = (function (_GrowLine) {
  _inherits(GrowLineBrush, _GrowLine);

  function GrowLineBrush() {
    _classCallCheck(this, GrowLineBrush);

    _get(Object.getPrototypeOf(GrowLineBrush.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(GrowLineBrush, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      if (!this.shouldDraw()) return;
      f.stroke(this.getColor()).fill(false);
      f.growLine(this.points, this.lastPoints, 7);
    }
  }]);

  return GrowLineBrush;
})(GrowLine);

var JaggedLineBrush = (function (_JaggedLine) {
  _inherits(JaggedLineBrush, _JaggedLine);

  function JaggedLineBrush() {
    _classCallCheck(this, JaggedLineBrush);

    _get(Object.getPrototypeOf(JaggedLineBrush.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(JaggedLineBrush, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      if (!this.shouldDraw()) return;

      f.stroke(this.getColor());
      f.jaggedLine(this.points, this.lastPoints, 10, 4);
    }
  }]);

  return JaggedLineBrush;
})(JaggedLine);

var InnerLineBrush = (function (_InnerLine) {
  _inherits(InnerLineBrush, _InnerLine);

  function InnerLineBrush() {
    _classCallCheck(this, InnerLineBrush);

    _get(Object.getPrototypeOf(InnerLineBrush.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(InnerLineBrush, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      if (!this.shouldDraw()) return;

      f.stroke(this.getColor()).fill(false);
      f.innerLine(this.points, 20, 2, 7);
    }
  }]);

  return InnerLineBrush;
})(InnerLine);

var DottedLineBrush = (function (_DottedLine) {
  _inherits(DottedLineBrush, _DottedLine);

  function DottedLineBrush() {
    _classCallCheck(this, DottedLineBrush);

    _get(Object.getPrototypeOf(DottedLineBrush.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(DottedLineBrush, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      if (!this.shouldDraw()) return;

      f.fill(this.getColor()).stroke(false);
      f.dottedLine(this.points, 3, 1, 0.5);
    }
  }]);

  return DottedLineBrush;
})(DottedLine);

var ZigZagLineBrush = (function (_ZigZagLine) {
  _inherits(ZigZagLineBrush, _ZigZagLine);

  function ZigZagLineBrush() {
    _classCallCheck(this, ZigZagLineBrush);

    _get(Object.getPrototypeOf(ZigZagLineBrush.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ZigZagLineBrush, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      if (!this.shouldDraw() || Math.random() < 0.5) return;

      this.maxTracePoints = 1 + Math.floor(Math.random() * 8);

      var swidth = this.tracing ? 1 : 2;
      f.stroke("rgba(0,0,0,.3)", swidth).fill(false);
      f.zigZagLine(this.points, Math.random() / 3, this.maxDistance(10));
    }
  }]);

  return ZigZagLineBrush;
})(ZigZagLine);

var SmoothNoiseLineBrush = (function (_SmoothNoiseLine) {
  _inherits(SmoothNoiseLineBrush, _SmoothNoiseLine);

  function SmoothNoiseLineBrush() {
    _classCallCheck(this, SmoothNoiseLineBrush);

    _get(Object.getPrototypeOf(SmoothNoiseLineBrush.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(SmoothNoiseLineBrush, [{
    key: "draw",
    value: function draw() {
      var f = arguments.length <= 0 || arguments[0] === undefined ? this.form : arguments[0];

      if (!this.shouldDraw()) return;

      var strokeWidth = this.tracing ? 0.5 : 1;
      f.stroke(this.getColor(), strokeWidth).fill(this.getColor("color2"));

      var distRatio = 2.5;
      var smooth = 5;
      var layers = Math.floor(Math.random() * 3) + 3;
      var magnify = 1;
      var curveSegments = 3;

      this.noiseProgress += 0.003;
      var noiseFactors = { a: this.noiseProgress, b: this.noiseFactorIndex, c: this.noiseFactorLayer };
      f.noisePolygon(this.points, this.noise, noiseFactors, this.flipSpeed, distRatio, smooth, this.maxDistance(), layers, magnify, curveSegments);
    }
  }]);

  return SmoothNoiseLineBrush;
})(SmoothNoiseLine);

(function () {

  var space = new CanvasSpace("playCanvas", false).display("#playground");
  var buffer = new CanvasSpace("bufferCanvas", false).display("#buffer");
  var line = new NoiseDashLine().init(space);

  space.refresh(false);

  var currentBrush = "SmoothNoiseLineBrush";

  var brushes = document.querySelectorAll(".brush");
  for (var i = 0; i < brushes.length; i++) {
    brushes[i].addEventListener("click", function (evt) {
      currentBrush = evt.target.getAttribute("data-id") || currentBrush;
    });
  }

  function penDown(evt) {

    updateTo(window[currentBrush]);
    line.trace(true);
  }

  function penUp(evt) {
    //buffer.ctx.drawImage( space.space, 0, 0);

    line.points = [];
    line.trace(false);
    space.remove(line);
    //space.refresh( true );
  }

  space.bindCanvas("mousedown", penDown);
  space.bindCanvas("touchstart", penDown);

  space.bindCanvas("mouseup", penUp);
  space.bindCanvas("mouseleave", penUp);
  space.bindCanvas("mouseout", penUp);
  space.bindCanvas("touchend", penUp);

  space.bindMouse();
  space.play();
  space.stop(100000);

  /**
   * Load Line class
   * @param LineClass
   */
  function updateTo(LineClass) {

    var _temp = line.clone();
    space.remove(line);
    line = new LineClass().init(space);
    line.setColor({
      dark: "rgba(0,0,0,.08)",
      dark2: "rgba(0,0,0,.02)",
      light: "rgba(0,0,0,.02)",
      ligh2: "rgba(0,0,0,.02)"
    }, {
      dark: "rgba(0,0,0,.01)",
      dark2: "rgba(0,0,0,.01)",
      light: "rgba(0,0,0,.01)",
      ligh2: "rgba(0,0,0,.01)"
    });
    if (LineClass === InnerLineBrush) {
      line.setColor({
        dark: "rgba(0,0,0,.01)",
        dark2: "rgba(0,0,0,.01)",
        light: "rgba(0,0,0,.01)",
        ligh2: "rgba(90,90,90,.01)"
      });
    }

    line.points = _temp.points;
    line.maxPoints = 20;

    line.down = function (x, y) {
      this.points = [];
      this.to(x, y);
    };

    space.add(line);
  }
})();