var React = require('react');
var _ = require('underscore');
var SliderMixin = require('./mixins/SliderMixin');

var RegionSliderRight = React.createClass(_.extend(SliderMixin, {
  styles: {},

  contextTypes: {
    muiTheme: React.PropTypes.object.isRequired
  },

  componentWillMount: function() {
    this.styles =  {
      root: {
        userSelect: 'none',
        cursor: 'default',
        position: 'relative',
        marginBottom: 0,
        marginRight: 48,
        height: 0
      },
      track: {
        position: 'absolute',
        left: 24,
        width: '100%'
      },
      handle: { /* Top Left Triangle */
        width: 0,
      	height: 0,
      	borderTop: '24px solid ' + this.context.muiTheme.baseTheme.palette.primary3Color,
      	borderRight: '24px solid transparent',
        boxSizing: 'border-box',
        position: 'absolute',
        cursor: 'pointer',
        bottom: 0,
        left: '0%',
        overflow: 'visible'
      }
    };
  },

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
    this.styles.handle.left = percent * 100 + '%';
    return (
      <div style={this.styles.root}>
        <div ref="track" style={this.styles.track}>
          <div
            ref="handle"
            style={this.styles.handle}
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

module.exports = RegionSliderRight;
