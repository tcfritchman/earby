var React = require('react');
var IconButton = require('material-ui/lib/icon-button');
var AvPlay = require('material-ui/lib/svg-icons/av/play-circle-outline');
var AvPause = require('material-ui/lib/svg-icons/av/pause-circle-outline');
var AvFastForward = require('material-ui/lib/svg-icons/av/fast-forward');
var AvFastRewind = require('material-ui/lib/svg-icons/av/fast-rewind');
var AvSkipNext = require('material-ui/lib/svg-icons/av/skip-next');
var AvSkipPrevious = require('material-ui/lib/svg-icons/av/skip-previous');
var AvLoop = require('material-ui/lib/svg-icons/av/loop');
var AvSlowMotion = require('material-ui/lib/svg-icons/av/slow-motion-video');

var PlayButton = React.createClass({
  render: function() {
    if (this.props.playing) {
      return (
        <IconButton
          onClick={this.props.onClick}
          style={this.props.style}
          iconStyle={this.props.iconStyle}
          disabled={this.props.loading}>
          <AvPause
            viewBox={this.props.viewBox}
          />
        </IconButton>
      );
    } else {
      return (
        <IconButton
          onClick={this.props.onClick}
          style={this.props.style}
          iconStyle={this.props.iconStyle}
          disabled={this.props.loading}>
          <AvPlay
            viewBox={this.props.viewBox}
          />
        </IconButton>
      );
    }
  }
});

var Transport = React.createClass({
  styles: {
    root: {
    },
    upperButtonGroup: {
      margin: '0 auto'
    },
    lowerButtonGroup: {
      width: 96,
      display: 'block',
      margin: '0 auto'
    },
    playButton: {
      right: 0,
      top: 24
    },
    playButtonIcon: {
      position: 'relative',
      right: 12,
      bottom: 12,
      width: 48,
      height: 48,
    }
  },

  render: function() {
    return (
      <div style={this.styles.root}>
        <div style={this.styles.upperButtonGroup}>
          <IconButton
            onTouchTap={this.props.onPrevRegionClick}
            disabled={this.props.loading}>
            <AvSkipPrevious />
          </IconButton>
          <PlayButton
            style={this.styles.playButton}
            iconStyle={this.styles.playButtonIcon}
            onClick={this.props.onPlayClick}
            playing={this.props.playing}
            loading={this.props.loading}
            viewBox={'0 0 24 24'}
          />
          <IconButton
            onTouchTap={this.props.onNextRegionClick}
            disabled={this.props.loading}>
            <AvSkipNext />
          </IconButton>
        </div>
        <div style={this.styles.lowerButtonGroup}>
          <IconButton
            onClick={this.props.onLoopClick}
            disabled={this.props.loading}>
            <AvLoop />
          </IconButton>
          <IconButton
            onClick={this.props.onSlowClick}
            disabled={this.props.loading}>
            <AvSlowMotion />
          </IconButton>
        </div>
      </div>
    );
  }
});

module.exports = Transport;
