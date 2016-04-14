var React = require('react');
var _ = require('underscore');
var WaveformUI = require('./WaveformUI.react');
var AppToolbar = require('./AppToolbar.react');
var AppMainMenu = require('./AppMainMenu.react');
var EditRegionDialog = require('./EditRegionDialog.react');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var RawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
var AppBar = require('material-ui/lib/app-bar');
var Toggle = require('material-ui/lib/toggle');

var Application = React.createClass({

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
      editRegionDialogOpen: false,
      editingRegion: null,
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

  /* Wavesurfer event handlers
   ****************************/

  handleReady: function() {
    this.setState({
      loading: false,
      duration: this.props.wavesurfer.getDuration()
    });
    this.props.timeline = Object.create(WaveSurfer.Timeline);
    this.props.timeline.init({
      wavesurfer: this.props.wavesurfer,
      container: '#wavesurfer-timeline'
    });
    // TODO: enable the ui.
  },

  handleAudioprocess: function(time) {
    /* Update frequency of the currentTime state is limited for improved
    performance. For precise time values always reference the wavesurfer
    object directly. */
    if (Math.abs(time - this.state.currentTime) > 0.1) {
      this.setState({
        currentTime: time
      });
    }
  },

  handleLoading: function(progress) {
    this.setState({
      loading: true,
      loadProgress: progress
    });
  },

  handleSeek: function(progress) {
    console.log('seek');
    this.setState({
      currentTime: this.props.wavesurfer.getCurrentTime()
    });
  },

  handleError: function(err) {
    console.log(err);
  },

  handlePlay: function() {
    this.setState({
      playing: true,
      paused: false,
      finished: false
    });
  },

  handlePause: function() {
      this.setState({
        playing:false,
        paused: true,
      });
  },

  handleFinish: function() {
      this.setState({
        playing:false,
        paused: false,
        finished: true,
        currentTime: 0.0
      });
  },

  /* Main Menu Handlers
  *********************/

  handleTapMenuButton: function() {
    (this.state.menuOpen ? this.closeMenu : this.openMenu)();
  },

  openMenu: function() {
    this.setState({menuOpen: true});
  },

  closeMenu: function() {
    this.setState({menuOpen: false});
  },

  /* Transport Handlers
  ***********************/

  handlePlayClick: function() {
    if (this.state.playing) {
      this.props.wavesurfer.pause();
    } else {
      this.props.wavesurfer.play(this.state.currentTime);
    }
  },

  handleSkipBackClick: function() {
    this.props.wavesurfer.skipBackward();
  },

  handleSkipFwdClick: function() {
    this.props.wavesurfer.skipForward();
  },

  handleLoopClick: function() {
    if (this.state.currentRegion) {
      this.state.currentRegion.update({loop: !this.state.looping});
      this.setState({looping: !this.state.looping});
    }
  },

  handlePositionSliderChange: function(e, value) {
    var time = value * this.state.duration;
    this.setState({currentTime: time});
  },

  handlePositionSliderDragStart: function() {
    if (this.state.playing) {
      /* unsubscribe pause event to 'trick' app
         into thinking it's still playing */
      this.props.wavesurfer.un('pause');
      this.props.wavesurfer.pause();
      this.props.wavesurfer.on('pause', this.handlePause);
    }
  },

  handlePositionSliderDragStop: function() {
    if (this.state.playing) this.props.wavesurfer.play(this.state.currentTime);
  },

  /* Region Control Handlers
  ****************************/

  handleAddRegionClick: function() {
    var start = this.props.wavesurfer.getCurrentTime();
    var regionOptions = {start: start};
    var newRegion = this.props.wavesurfer.addRegion(regionOptions);

    newRegion.update({data: {title: 'Region ' + newRegion.id}});
    this.setState({currentRegion: newRegion});
    this.updateRegionState();
  },

  handleSetRegionEndClick: function() {
    this.state.currentRegion.update({end: this.props.wavesurfer.getCurrentTime()});
    this.updateRegionState();
  },

  handleRegionClick: function(region) {
    this.setState({
      currentRegion: region
    });
    this.props.wavesurfer.play(region.start);
  },

  handleRegionDeleteClick: function(region) {
    if (this.state.currentRegion && region.id === this.state.currentRegion.id) {
      this.setState({currentRegion: null});
    }
    region.remove();
    this.updateRegionState();
  },

  handleNextRegionClick: function() {
    var newRegion = this.cycleCurrentRegion(1);
    if (this.state.currentRegion) {
      this.props.wavesurfer.play(newRegion.start);
    }
  },

  handlePrevRegionClick: function() {
    var newRegion = this.cycleCurrentRegion(-1);
    if (this.state.currentRegion) {
      this.props.wavesurfer.play(newRegion.start);
    }
  },

  cycleCurrentRegion: function(val) {
    /* val must be 1 or -1 (to cycle forward or backward) */
    var numRegions = this.state.regions.length;
    if (numRegions === 0) return;

    var _this = this;

    var isCurrentRegion = function(region) {
        return region.id === _this.state.currentRegion.id;
    };
    var currentIndex = _.indexOf(
      this.state.regions,
       _.find(this.state.regions, isCurrentRegion)
    );
    var newIndex = currentIndex + val;
    if (newIndex < 0) {
      newIndex = numRegions - 1;
    } else if (newIndex >= numRegions) {
      newIndex = 0;
    }
    var newRegion = this.state.regions[newIndex];
    this.setState({currentRegion: newRegion});
    return newRegion;
  },

  handleRegionSliderLeftChange: function(e, value) {
    var reg = this.state.currentRegion;
    if (!reg) return;
    var time = value * this.state.duration;
    var options = {start: time};
    if (time > reg.end) {
      options.end = time;
    }
    reg.update(options);
  },

  handleRegionSliderRightChange: function(e, value) {
    var reg = this.state.currentRegion;
    if (!reg) return;
    var time = value * this.state.duration;
    var options = {end: time};
    if (time < reg.start) {
      options.start = time;
    }
    reg.update(options);
  },

  handleRegionSliderDragStop: function() {
    this.updateRegionState();
  },

  updateRegionState: function() {
    var stateChange = {
      regions:_.sortBy( _.values(this.props.wavesurfer.regions.list), function(region){
        return region.start;
      })
    };
    this.setState(stateChange);
  },

  /* Edit Region Dialog Handlers
  ****************************/
  handleRegionEditClick: function(region) {
    /* Use callback to ensure region gets set before dialog opens */
    this.setState({editingRegion: region}, this.openEditRegionDialog);
  },

  openEditRegionDialog: function() {
    this.setState({editRegionDialogOpen: true});
  },

  closeEditRegionDialog: function() {
    this.setState({editRegionDialogOpen: false});
  },


  render: function() {
    return (
      <div>
        <AppBar title="earby"
          onLeftIconButtonTouchTap={this.handleTapMenuButton}
        />
        <AppMainMenu
          open={this.state.menuOpen}
          setMenuOpen={this.openMenu}
          setMenuClosed={this.closeMenu}
        />
        <AppToolbar
          onAddRegionClick={this.handleAddRegionClick}
          onSetRegionEndClick={this.handleSetRegionEndClick}
          onRegionClick={this.handleRegionClick}
          onRegionEditClick={this.handleRegionEditClick}
          onRegionDeleteClick={this.handleRegionDeleteClick}
          regions={this.state.regions}
          playing={this.state.playing}
          onPlayClick={this.handlePlayClick}
          onLoopClick={this.handleLoopClick}
          onSkipFwdClick={this.handleSkipFwdClick}
          onSkipBackClick={this.handleSkipBackClick}
          onPrevRegionClick={this.handlePrevRegionClick}
          onNextRegionClick={this.handleNextRegionClick}
        />
        <WaveformUI
          onMount={this.createWaveSurfer}
          loading={this.state.loading}
          loadProgress={this.state.loadProgress}
          duration={this.state.duration}
          currentTime={this.state.currentTime}
          currentRegion={this.state.currentRegion}
          onPositionSliderChange={this.handlePositionSliderChange}
          onPositionSliderDragStart={this.handlePositionSliderDragStart}
          onPositionSliderDragStop={this.handlePositionSliderDragStop}
          onRegionSliderLeftChange={this.handleRegionSliderLeftChange}
          onRegionSliderRightChange={this.handleRegionSliderRightChange}
          onRegionSliderDragStop={this.handleRegionSliderDragStop}
        />
        <EditRegionDialog
          open={this.state.editRegionDialogOpen}
          onRequestClose={this.closeEditRegionDialog}
          region={this.state.editingRegion}
          duration={this.state.duration}
        />
      </div>
    );
  }
});

module.exports = Application;
