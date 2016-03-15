/* Most of the logic for this slider interface is borrowed from
   the material-ui slider component code
   http://www.material-ui.com/#/components/slider
  */
var React = require('react');
var ReactDOM = require('react-dom');

var styles = {
  root: {
    userSelect: 'none',
    cursor: 'default',
    position: 'relative',
    marginBottom: 24
  },
  track: {
    position: 'absolute',
    left: 0,
    width: '100%',
  },
  handle: {
    boxSizing: 'border-box',
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: '0%',
    overflow: 'visible'
  },
  defaultHandleEl: {
    backgroundColor: 'black',
    width: 24,
    height: 24
  }
};

var SimpleSlider = React.createClass ({
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
      _this._onDragUpdate(e, e.clientX - _this._getTrackLeft());
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

  _percentToValue: function(percent) {
    return percent * (this.props.max - this.props.min) + this.props.min;
  },

  render: function() {
    var percent = this.state.percent;
    if (percent > 1) percent = 1; else if (percent <0) percent = 0;
    styles.handle.left = percent * 100 + '%';
    return (
      <div style={styles.root}>
        <div ref="track" style={styles.track}>
          <div
            style={styles.handle}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            onMouseDown={this._onMouseDown}
            onMouseEnter={this._onMouseEnter}
            onMouseLeave={this._onMouseLeave}
            onMouseUp={this._onMouseUp}
          >
          {this.props.handleEl || <div style={styles.defaultHandleEl}></div>}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SimpleSlider;
