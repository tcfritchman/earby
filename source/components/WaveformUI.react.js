var React = require('react');
//var PositionSlider = require('./PositionSlider.react');
var SimpleSlider = require('./SimpleSlider.react');

var WaveformUI = React.createClass({
  componentDidMount: function() {
    this.props.onMount();
  },
  render: function() {
    return (
      <div>
        <div id="wavesurfer"></div>
        <SimpleSlider />
      </div>
    );
  }
});

module.exports = WaveformUI;
