var React = require('react');
var PositionSlider = require('./PositionSlider.react');
var RegionSliderLeft = require('./RegionSliderLeft.react');
var RegionSliderRight = require('./RegionSliderRight.react');

var styles = {
  container: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 36
  },
  containerHidden: {
    visibility: 'hidden'
  },
  headerDiv: {
  },
  timeline: {
    position: 'relative',
    top: 24,
    left: 24
  },
  regionSliderDiv: {
  },
  regionSliderHidden: {
    display: 'none'
  },
  wavesurfer: {
    paddingTop: 24,
    marginRight: 24,
    marginLeft: 24
  }
};

var WaveformUI = React.createClass({
  componentDidMount: function() {
    this.props.onMount();
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

  handleRegionSliderLeftChange: function(e, value) {
    this.props.onRegionSliderLeftChange(e, value);
  },

  handleRegionSliderRightChange: function(e, value) {
    this.props.onRegionSliderRightChange(e, value);
  },

  handleRegionSliderDragStop: function() {
    this.props.onRegionSliderDragStop();
  },

  render: function() {
    var containerStyle = styles.container;
    var regionStart, regionEnd;
    var regionStyle = styles.regionSliderDiv;

    if (this.props.loading) {
      containerStyle = styles.containerHidden;
    }

    if (this.props.currentRegion) {
      regionStart = this.props.currentRegion.start;
      regionEnd   = this.props.currentRegion.end;
    } else {
      regionStart = 0.0;
      regionEnd   = 0.0;
      regionStyle = styles.regionSliderHidden;
    }

    return (
      <div style={containerStyle}>
        <div style={styles.headerDiv}>
          <div id="wavesurfer-timeline" style={styles.timeline}></div>
          <div style={regionStyle}>
            <RegionSliderLeft
              value={regionStart / this.props.duration}
              onChange={this.handleRegionSliderLeftChange}
              onDragStop={this.handleRegionSliderDragStop}
            />
            <RegionSliderRight
              value={regionEnd / this.props.duration}
              onChange={this.handleRegionSliderRightChange}
              onDragStop={this.handleRegionSliderDragStop}
            />
          </div>
        </div>
        <div id="wavesurfer" style={styles.wavesurfer}></div>
        <PositionSlider
          handleHeight={48}
          handleWidth={48}
          onChange={this.handlePositionSliderChange}
          onDragStart={this.handlePositionSliderDragStart}
          onDragStop={this.handlePositionSliderDragStop}
          value={(this.props.currentTime / this.props.duration) || 0.0}
        />
      </div>
    );
  }
});

module.exports = WaveformUI;
