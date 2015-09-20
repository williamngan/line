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
      var maxPoints = arguments.length <= 1 || arguments[1] === undefined ? 50 : arguments[1];

      this.form = form;
      this.maxPoints = maxPoints;
    }

    /**
     * Space's animate callback. Override in subclass for additional features and drawing styles.
     */
  }, {
    key: "animate",
    value: function animate(time, fps, context) {
      this.form.stroke("rgba(0,0,0,.4)");
      this.form.curve(this.catmullRom(5));
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
      } else if (type == "up" || type == "out") {
        this.pressed = false;
        this.up(x, y);
      }
    }
  }]);

  return BaseLine;
})(Curve);