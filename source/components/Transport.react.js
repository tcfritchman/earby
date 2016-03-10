var React = require('react');
var IconButton = require('material-ui/lib/icon-button');
var AvPlay = require('material-ui/lib/svg-icons/av/play-arrow');
var AvPause = require('material-ui/lib/svg-icons/av/pause');
var AvFastForward = require('material-ui/lib/svg-icons/av/fast-forward');
var AvFastRewind = require('material-ui/lib/svg-icons/av/fast-rewind');
var AvSkipNext = require('material-ui/lib/svg-icons/av/skip-next');
var AvSkipPrevious = require('material-ui/lib/svg-icons/av/skip-previous');
var AvLoop = require('material-ui/lib/svg-icons/av/loop');

var PlayButton = React.createClass({
  render: function() {
    if (this.props.playing) {
      return (
        <IconButton onClick={this.props.onClick}>
          <AvPause />
        </IconButton>
      );
    } else {
      return (
        <IconButton onClick={this.props.onClick}>
          <AvPlay />
        </IconButton>
      );
    }
  }
});

var Transport = React.createClass({
  render: function() {
    return (
      <div>
        <IconButton>
          <AvSkipPrevious />
        </IconButton>
        <IconButton onClick={this.props.onSkipBackClick}>
          <AvFastRewind />
        </IconButton>
        <PlayButton
          onClick={this.props.onPlayClick}
          playing={this.props.playing}
        />
        <IconButton>
          <AvLoop />
        </IconButton>
        <IconButton onClick={this.props.onSkipFwdClick}>
          <AvFastForward />
        </IconButton>
        <IconButton>
          <AvSkipNext />
        </IconButton>
      </div>
    );
  }
});

module.exports = Transport;
