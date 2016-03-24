var React = require('react');
var Transport = require('./Transport.react');
var WaveformUI = require('./WaveformUI.react');
var AppToolbar = require('./AppToolbar.react');
var AppMainMenu = require('./AppMainMenu.react');
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
      menuOpen: false,
      loading: false,
      loadProgress: 0.0,
      duration: 0.0,
      currentTime: 0.0,
      playing: false,
      paused: false,
      finished: false,
      looping: false,
      volume: 1.0,
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
    this.props.wavesurfer.on('ready', this.handleReady);
    this.props.wavesurfer.on('audioprocess', this.handleAudioprocess);
    this.props.wavesurfer.on('loading', this.handleLoading);
    this.props.wavesurfer.on('seek', this.handleSeek);
    this.props.wavesurfer.on('error', this.handleError);
    this.props.wavesurfer.load('example/getlucky.mp3');
  },

  /* Wavesurfer event handlers */
  handleReady: function() {
    this.setState({
      loading: false,
      duration: this.props.wavesurfer.getDuration()
    });
    // TODO: enable the ui.
  },
  handleAudioprocess: function(time) {
    this.setState({
      currentTime: time
    });
  },
  handleLoading: function(progress) {
    this.setState({
      loading: true,
      loadProgress: progress
    });
  },
  handleSeek: function(progress) {
    this.setState({
      currentTime: this.props.wavesurfer.getCurrentTime()
    });
  },
  handleError: function(err) {
    console.log(err);
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

  /* Menu Handlers */
  handleTapMenuButton: function() {
    (this.state.menuOpen ? this.closeMenu : this.openMenu)();
  },
  openMenu: function() {
    this.setState({menuOpen: true});
    console.log('open');
  },
  closeMenu: function() {
    this.setState({menuOpen: false});
    console.log('close');
  },

  /* Transport Handlers */
  handlePlayClick: function() {
    this.props.wavesurfer.playPause();
  },
  handleSkipBackClick: function() {
    this.props.wavesurfer.skipBackward();
  },
  handleSkipFwdClick: function() {
    this.props.wavesurfer.skipForward();
  },
  handlePositionSliderChange: function(e, value) {
    this.props.wavesurfer.seekTo(value);
  },
  handlePositionSliderDragStart: function() {
    this.props.wavesurfer.pause();
  },
  handlePositionSliderDragStop: function() {
    this.props.wavesurfer.play();
  },

  /* Region Control Handlers */
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
        <AppBar title="earby"
          onLeftIconButtonTouchTap={this.handleTapMenuButton} />
        <AppMainMenu
          open={this.state.menuOpen}
          setMenuOpen={this.openMenu}
          setMenuClosed={this.closeMenu}
        />
        <AppToolbar
          onAddRegionClick={this.handleAddRegionClick}
          onSetRegionEndClick={this.handleSetRegionEndClick}
          regions={this.state.regions}
        />
        <WaveformUI
          onMount={this.createWaveSurfer}
          loading={this.state.loading}
          loadProgress={this.state.loadProgress}
          duration={this.state.duration}
          currentTime={this.state.currentTime}
          onPositionSliderChange={this.handlePositionSliderChange}
          onPositionSliderDragStart={this.handlePositionSliderDragStart}
          onPositionSliderDragStop={this.handlePositionSliderDragStop}
        />
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
