var React = require('react');
var ReactDOM = require('react-dom');
var TempHandle = require('material-ui/lib/svg-icons/navigation/arrow-drop-up');

styles = {
  root: {},
  track: {},
  handle: {}
};

var PositionSlider  = React.createClass({
  getDefaultProps: function() {
    return {
      disabled: false,
      max: 1,
      min: 0,
      step: 0.0001,
    };
  },
  getInitialState: function() {
    var value = this.props.value;
    if (value === undefined) {
      value = this.props.min;
    }
    return {
      active: false,
      dragging: false,
      focused: false,
      hovered: false,
      value: value,
    };
  },

  setValue: function(i) {
    // calculate percentage
    var percent = (i - this.props.min) / (this.props.max - this.props.min);
    if (isNaN(percent)) percent = 0;
    // update state
    this.setState({
      value: i,
      percent: percent,
    });
  },

  setPercent: function(percent, callback) {
    var value = this._alignValue(this._percentToValue(percent));
    var min = this.props.min;
    var max = thix.props.max;
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
  _updateAnimationFrame: function(e) {
      this._onDragUpdate(e, e.clientX - this._getTrackLeft());
      this._dragRunning = false;
  },
  _dragHandler: function(e) {
    if (this._dragRunning) {
      return;
    }
    this._dragRunning = true;
    requestAnimationFrame(this._updateAnimationFrame(e));
  },
  _getTrackLeft: function() {
    return ReactDOM.findDOMNode(this.refs.track).getBoundingClientRect().left;
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
    this.setState({
      dragging: true,
      active: true
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

  render: function() {
    var percent = this.state.percent;
    if (percent > 1) percent = 1; else if (percent <0) percent = 0;
    styles.handle.left = percent * 100 + '%';
    return (
      <div style={styles.root}>
        <div
          style={styles.handle}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          onMouseDown={this._onMouseDown}
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
          onMouseUp={this._onMouseUp}
        >
          <TempHandle />
        </div>
      </div>
    );
  }
});

module.exports = PositionSlider ;
