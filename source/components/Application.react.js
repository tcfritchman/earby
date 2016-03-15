var React = require('react');
var Transport = require('./Transport.react');
var WaveformUI = require('./WaveformUI.react');
var AppToolbar = require('./AppToolbar.react');
//var WaveSurfer = require('../wavesurfer');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var RawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
var AppBar = require('material-ui/lib/app-bar');
var Toggle = require('material-ui/lib/toggle');

var Application = React.createClass({

  //the key passed through context must be called "muiTheme"
  childContextTypes : {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getMuiTheme(RawTheme),
    };
  },
  getInitialState: function() {
    return {
      playing: false,
      paused: false,
      finished: false,
      looping: false,
      currentRegion: null,
      regions: []
    };
  },
  createWaveSurfer: function() {
    try {
        this.props.wavesurfer = WaveSurfer.create({
          container: '#wavesurfer',
          waveColor: 'black'
        });
    } catch(e) {
        console.log(e);
        return;
    }
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
  handleAddRegionClick: function() {
    var regionOptions = {
      start: this.props.wavesurfer.getCurrentTime(),

    };
    var newRegion = this.props.wavesurfer
      .addRegion(regionOptions);
    this.state.currentRegion = newRegion;
    this.state.regions.push(newRegion);
    newRegion.data = {title: 'Region ' + newRegion.id};
  },
  handleSetRegionEndClick: function() {
    this.state.currentRegion.update({
      end: this.props.wavesurfer.getCurrentTime()
    });
  },
  render: function() {
    return (
      <div>
        <AppBar title="earby" />
        <AppToolbar
          onAddRegionClick={this.handleAddRegionClick}
          onSetRegionEndClick={this.handleSetRegionEndClick}
          regions={this.state.regions}
        />
        <WaveformUI onMount={this.createWaveSurfer}></WaveformUI>
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
