var React = require('react');
var Transport = require('./Transport.react');
var Wavesurfer = require('./Wavesurfer.react');
var WaveSurfer = require('../wavesurfer.dev');

var Application = React.createClass({
  getInitialState: function() {
    return {
      playing: false,
      paused: false,
      finished: false,
      looping: false
    };
  },
  createWaveSurfer: function() {
    this.props.wavesurfer = WaveSurfer.create({
      container: '#wavesurfer',
      waveColor: 'black'
    });
    this.props.wavesurfer.on('finish', this.handleFinish);
    this.props.wavesurfer.on('play', this.handlePlay);
    this.props.wavesurfer.on('pause', this.handlePause);
    this.props.wavesurfer.load('example/getlucky.mp3');
  },
  handlePlay: function() {
    console.log('play');
    this.setState({
      playing: true,
      paused: false,
      finished: false
    });
  },
  handlePause: function() {
    console.log('pause');
      this.setState({
        playing:false,
        paused: true,
      });
  },
  handleFinish: function() {
    console.log('finished');
      this.setState({
        playing:false,
        paused: false,
        finished: true
      });
  },
  handlePlayClick: function() {
    this.props.wavesurfer.playPause();
  },
  handleSkipBackClick: function() {
    this.props.wavesurfer.skipBackward();
  },
  handleSkipFwdClick: function() {
    this.props.wavesurfer.skipForward();
  },
  render: function() {
    return (
      <div>
        <Wavesurfer onMount={this.createWaveSurfer}></Wavesurfer>
        <Transport
          playing={this.state.playing}
          onPlayClick={this.handlePlayClick}
          onSkipFwdClick={this.handleSkipFwdClick}
          onSkipBackClick={this.handleSkipBackClick}
        />
      </div>
    );
  }
});

module.exports = Application;
