var React = require('react');
var _ = require('underscore');
var SliderMixin = require('./mixins/SliderMixin');

var styles = {
  root: {
    userSelect: 'none',
    cursor: 'default',
    position: 'relative',
    marginBottom: 0,
    marginRight: 48,
    height: 24
  },
  track: {
    position: 'absolute',
    left: 0,
    width: '100%'
  },
  handle: { /* Top Right Triangle */
    width: 0,
  	height: 0,
  	borderTop: '24px solid black',
  	borderLeft: '24px solid transparent',
    boxSizing: 'border-box',
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: '0%',
    overflow: 'visible'
  },
};

var RegionSliderLeft = React.createClass(_.extend(SliderMixin, {
  getDefaultProps: function() {
    return {
      disabled: false,
      max: 1,
      min: 0,
      step: 0.0001,
      styles: {}
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
      offset: 24
    };
  },

  render: function() {
    var percent = this.state.percent;
    if (percent > 1) percent = 1; else if (percent <0) percent = 0;
    styles.handle.left = percent * 100 + '%';

    return (
      <div style={styles.root}>
        <div ref="track" style={styles.track}>
          <div
            ref="handle"
            style={styles.handle}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            onMouseDown={this._onMouseDown}
            onMouseEnter={this._onMouseEnter}
            onMouseLeave={this._onMouseLeave}
            onMouseUp={this._onMouseUp}
          >
          </div>
        </div>
      </div>
    );
  }

}));

module.exports = RegionSliderLeft;
