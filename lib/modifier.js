"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Modifier = _react2.default.createClass({
  displayName: "Modifier",

  propTypes: {
    onKeyUp: _react2.default.PropTypes.func,
    onClick: _react2.default.PropTypes.func,
    active: _react2.default.PropTypes.bool,
    hex: _react2.default.PropTypes.string
  },

  render: function render() {
    return _react2.default.createElement("a", {
      onKeyUp: this.props.onKeyUp,
      onClick: this.props.onClick,
      className: this.props.active ? "modifier active" : "modifier",
      style: { background: this.props.hex }
    });
  }
});

module.exports = Modifier;