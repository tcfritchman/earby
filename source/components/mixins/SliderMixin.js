/* SliderMixin.js **************************************************
   Most of the logic for this slider interface is borrowed from
   the material-ui slider component code
   http://www.material-ui.com/#/components/slider
*******************************************************************/

var React = require('react');
var ReactDOM = require('react-dom');

var SliderMixin = {
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value !== undefined && !this.state.dragging) {
      this.setValue(nextProps.value);
    }
  },

  setValue: function(i) {
    /* calculate percentage */
    var percent = (i - this.props.min) / (this.props.max - this.props.min);
    if (isNaN(percent)) percent = 0;
    this.setState({
      value: i,
      percent: percent,
    });
  },

  setPercent: function(percent, callback) {
    var value = this._alignValue(this._percentToValue(percent));
    var min = this.props.min;
    var max = this.props.max;
    var alignedPercent = (value - min) / (max - min);
    if (this.state.value !== value) {
      this.setState({value: value, percent: alignedPercent}, callback);
    }
  },

  _alignValue: function(val) {
    var step = this.props.step;
    var min = this.props.min;
    var alignValue = Math.round((val - min) / step) * step + min;
    return parseFloat(alignValue.toFixed(5));
  },

  _getTrackLeft: function() {
    return ReactDOM.findDOMNode(this.refs.track).getBoundingClientRect().left;
  },

  _dragHandler: function(e) {
    var _this = this;
    if (this._dragRunning) {
      return;
    }
    this._dragRunning = true;
    requestAnimationFrame( function () {
      _this._onDragUpdate(e, e.clientX - _this._getTrackLeft() + _this.state.offset);
      _this._dragRunning = false;
    });
  },

  _dragEndHandler: function(e) {
    if (document) {
      document.removeEventListener('mousemove', this._dragHandler, false);
      document.removeEventListener('mouseup', this._dragEndHandler, false);
    }
    this._onDragStop(e);
  },

  _onMouseDown: function(e) {
    if (this.props.disabled) return;
    if (document) {
      document.addEventListener('mousemove', this._dragHandler, false);
      document.addEventListener('mouseup', this._dragEndHandler, false);
    }
    this._onDragStart(e);
  },

  _onMouseLeave: function() {
    this.setState({hovered: false});
  },

  _onMouseEnter: function() {
    this.setState({hovered: true});
  },

  _onDragStart: function(e) {
    var handleRect = ReactDOM.findDOMNode(this.refs.handle).getBoundingClientRect();
    this.setState({
      dragging: true,
      active: true,
      offset: ((handleRect.width / 2) - (handleRect.width / 2) - (e.clientX - handleRect.left))
    });
    if (this.props.onDragStart) this.props.onDragStart(e);
  },

  _onDragStop: function(e) {
    this.setState({
      dragging: false,
      active: true
    });
    if (this.props.onDragStop) this.props.onDragStop(e);
  },

  _onDragUpdate: function(e, pos) {
    if (!this.state.dragging) return;
    if (!this.props.disabled) this._dragX(e, pos);
  },

  _dragX: function (e, pos) {
    var max = ReactDOM.findDOMNode(this.refs.track).clientWidth;
    if (pos < 0) pos = 0; else if (pos > max) pos = max;
    this._updateWithChangeEvent(e, pos / max);
  },

  _updateWithChangeEvent: function(e, percent) {
    this.setPercent(percent, function() {
      if (this.props.onChange) this.props.onChange(e, this.state.value);
    });
  },

  _percentToValue: function(percent) {
    return percent * (this.props.max - this.props.min) + this.props.min;
  }
};

module.exports = SliderMixin;
