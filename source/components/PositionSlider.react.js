// don't need this file
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');
var SliderMixin = require('./mixins/SliderMixin');
var PositionSliderHandle = require('./PositionSliderHandle.react');

var styles = {
  root: {
    userSelect: 'none',
    cursor: 'default',
    position: 'relative',
    marginBottom: 24,
    marginRight: 48
  },
  track: {
    position: 'absolute',
    left: 0,
    width: '100%'
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

var PositionSlider = React.createClass (

  _.extend(SliderMixin, {

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
              <PositionSliderHandle />
            </div>
          </div>
        </div>
      );
    }
  })
);

module.exports = PositionSlider ;
