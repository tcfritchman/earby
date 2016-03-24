var React = require('react');
//var SimpleSlider = require('./SimpleSlider.react');
var PositionSlider = require('./PositionSlider.react');

var styles = {
  container: {
    margin: 20,
  },
  wavesurfer: {
    marginRight: 24,
    marginLeft: 24
  }
};

var WaveformUI = React.createClass({
  componentDidMount: function() {
    this.props.onMount();
  },
  calculateProgress: function() {
    if (this.props.duration === 0.0) {
      return 0;
    } else {
      return this.props.currentTime / this.props.duration;
    }
  },
  handlePositionSliderChange: function(e, value) {
    this.props.onPositionSliderChange(e, value);
  },
  handlePositionSliderDragStart: function() {
    this.props.onPositionSliderDragStart();
  },
  handlePositionSliderDragStop: function() {
    this.props.onPositionSliderDragStop();
  },
  render: function() {
    return (
      <div style={styles.container}>
        <div id="wavesurfer" style={styles.wavesurfer}></div>
        <PositionSlider
          handleHeight={48}
          handleWidth={48}
          onChange={this.handlePositionSliderChange}
          onDragStart={this.handlePositionSliderDragStart}
          onDragStop={this.handlePositionSliderDragStop}
          value={this.props.currentTime / this.props.duration || 0.0}
        />
      </div>
    );
  }
});

module.exports = WaveformUI;
