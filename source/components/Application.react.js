var React = require('react');
var _ = require('underscore');
var getMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var AppBar = require('material-ui/lib/app-bar');
var Toggle = require('material-ui/lib/toggle');
var colorManipulator = require('material-ui/lib/utils/color-manipulator');
var LinearProgress = require('material-ui/lib/linear-progress');
var WaveformUI = require('./WaveformUI.react');
var AppToolbar = require('./AppToolbar.react');
var AppMainMenu = require('./AppMainMenu.react');
var EditRegionDialog = require('./EditRegionDialog.react');
var AppSidebar = require('./AppSidebar.react');
var FilePickerDialog = require('./FilePickerDialog.react');
var baseTheme = require('../styles/earbyBaseThemeDark');

var Application = React.createClass({
  childContextTypes : {
    muiTheme: React.PropTypes.object.isRequired
  },

  getChildContext: function() {
    return {muiTheme: getMuiTheme(baseTheme)};
  },

  getInitialState: function() {
    return {
      menuOpen: false,
      editRegionDialogOpen: false,
      filePickerDialogOpen: false,
      songTitle: "EarbyDemo.mp3",
      editingRegion: null,
      loading: true,
      loadProgress: 0.0,
      duration: 0.0,
      currentTime: 0.0,
      playing: false,
      paused: false,
      finished: false,
      looping: false,
      volume: 1.0,
      slow: false,
      slowRate: 0.75,
      currentRegion: null,
      regions: []
    };
  },

  createWaveSurfer: function() {
    try {
        this.wavesurfer = WaveSurfer.create({
          container: '#wavesurfer',
          waveColor: baseTheme.palette.wavePrimaryColor,
          progressColor: baseTheme.palette.waveSecondaryColor,
          hideScrollbar: true,
          interact: false
        });
    } catch(e) {
        console.log(e);
        return;
    }
    this.wavesurfer.on('finish', this.handleFinish);
    this.wavesurfer.on('play', this.handlePlay);
    this.wavesurfer.on('pause', this.handlePause);
    this.wavesurfer.on('ready', this.handleReady);
    this.wavesurfer.on('audioprocess', this.handleAudioprocess);
    this.wavesurfer.on('loading', this.handleLoading);
    this.wavesurfer.on('seek', this.handleSeek);
    this.wavesurfer.on('error', this.handleError);
    this.wavesurfer.load('example/EarbyDemo.mp3');
  },

  /* Wavesurfer event handlers
   ****************************/

  handleReady: function() {
    this.setState({
      loading: false,
      duration: this.wavesurfer.getDuration()
    });
    this.timeline = Object.create(WaveSurfer.Timeline);
    this.timeline.init({
      wavesurfer: this.wavesurfer,
      container: '#wavesurfer-timeline',
      primaryColor: baseTheme.palette.accent1Color,
      secondaryColor: baseTheme.palette.wavePrimaryColor,
      primaryFontColor: baseTheme.palette.textColor,
      secondaryFontColor: baseTheme.palette.alternateTextColor,
    });
    // TODO: enable the ui.
  },

  handleAudioprocess: function(time) {
    /* Update frequency of the currentTime state is limited for improved
    performance. For precise time values always reference the wavesurfer
    object directly. */
    if (Math.abs(time - this.state.currentTime) > 0.05) {
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
      currentTime: this.wavesurfer.getCurrentTime()
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

  handleLoadFileClick: function() {
    this.setState({
      filePickerDialogOpen: true,
      menuOpen: false
    });
  },

  closeFilePickerDialog: function() {
    this.setState({filePickerDialogOpen: false});
  },

  loadNewFile: function(file) {
    this.resetState();
    this.resetWavesurfer();
    try {
      this.wavesurfer.loadBlob(file);
      this.setState({songTitle: file.name});
    } catch (e) {
      // TODO: Add proper error message
      console.log(e);
    }
  },

  resetState: function() {
    this.setState({
      menuOpen: false,
      editRegionDialogOpen: false,
      filePickerDialogOpen: false,
      editingRegion: null,
      currentTime: 0.0,
      playing: false,
      paused: false,
      finished: false,
      looping: false,
      slow: false,
      currentRegion: null,
      regions: []
    });
  },

  resetWavesurfer: function() {
    try {
      this.wavesurfer.stop();
      this.wavesurfer.setPlaybackRate(1);
      this.wavesurfer.clearRegions();
    } catch (e) {
      // Continue anyway
    }
  },

  /* Transport Handlers
  ***********************/

  handlePlayClick: function() {
    if (this.state.playing) {
      this.wavesurfer.pause();
    } else {
      this.wavesurfer.play(this.state.currentTime);
    }
  },

  handleSkipBackClick: function() {
    this.wavesurfer.skipBackward();
  },

  handleSkipFwdClick: function() {
    this.wavesurfer.skipForward();
  },

  handleLoopClick: function() {
    if (this.state.currentRegion) {
      var _state = this.state;
      this.setState({looping: !this.state.looping}, function() {
        _state.currentRegion.update({loop: !_state.looping});
      });
    }
  },

  handleSlowClick: function() {
    if (this.state.slow) {
      this.setState({slow: false});
      this.wavesurfer.setPlaybackRate(1.0);
    } else {
      this.setState({slow: true});
      this.wavesurfer.setPlaybackRate(0.5);
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
      this.wavesurfer.un('pause');
      this.wavesurfer.pause();
      this.wavesurfer.on('pause', this.handlePause);
    }
  },

  handlePositionSliderDragStop: function() {
    if (this.state.playing) this.wavesurfer.play(this.state.currentTime);
  },

  /* Region Control Handlers
  ****************************/

  handleAddRegionClick: function() {
    var start = this.wavesurfer.getCurrentTime();
    var regionOptions = {
      start: start,
      drag: true,
      resize: false,
      color: colorManipulator.fade(baseTheme.palette.primary3Color, 0.4)
    };
    var newRegion = this.wavesurfer.addRegion(regionOptions);

    newRegion.update({data: {title: ''}});
    this.setState({currentRegion: newRegion});
    this.updateRegionState();
  },

  handleSetRegionEndClick: function() {
    this.state.currentRegion.update({end: this.wavesurfer.getCurrentTime()});
    this.updateRegionState();
  },

  handleRegionClick: function(region) {
    this.wavesurfer.play(region.start);
    this.setState({currentRegion: region}, this.updateRegionState);
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
      this.wavesurfer.play(newRegion.start);
    }
  },

  handlePrevRegionClick: function() {
    var newRegion = this.cycleCurrentRegion(-1);
    if (this.state.currentRegion) {
      this.wavesurfer.play(newRegion.start);
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
    this.setState({currentRegion: newRegion}, this.updateRegionState);
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
    _state = this.state;

    var regionList = _.sortBy( _.values(this.wavesurfer.regions.list), function(region) {
        return region.start;
    });

    /* Make sure loop states are consistent with current region */
    _.each(regionList, function(region) {
      if (_state.looping && _state.currentRegion && region.id === _state.currentRegion.id) {
        region.update({loop: true});
      } else {
        region.update({loop: false});
      }
    });

    this.setState({regions: regionList});
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

  saveRegionChanges: function(changes) {
    this.state.editingRegion.update({
      start: changes.start,
      end: changes.end,
      data: _.extend(this.state.editingRegion.data, {title: changes.title})
    });
    this.updateRegionState();
  },

  styles: {
    mainView: {
      backgroundColor: baseTheme.palette.mainViewColor
    },
    progressBar: {
      margin: '100px auto',
      width: '80%',
    },
    progressHidden: {
      display: 'none'
    },
    loadPercent: {
      margin: '8px 0px',
      fontSize: 16,
      fontFamily: baseTheme.palette.fontFamily,
      textAlign: 'center',
      color: baseTheme.palette.textColor,
    }
  },

  wavesurfer: null,
  timeline: null,

  render: function() {
    var progressBarStyle = this.state.loading ? this.styles.progressBar : this.styles.progressHidden;
    return (
      <div>
        <AppBar title="Earby"
          onLeftIconButtonTouchTap={this.handleTapMenuButton}
        />
        <AppMainMenu
          open={this.state.menuOpen}
          setMenuOpen={this.openMenu}
          setMenuClosed={this.closeMenu}
          onLoadFileClick={this.handleLoadFileClick}
        />
        <div id="root">
          <div id="main-view" style={this.styles.mainView}>
            <div style={progressBarStyle}>
              <LinearProgress
                mode="indeterminate"
              />
              <div style={this.styles.loadPercent}>{this.state.loadProgress}%</div>
            </div>
            <WaveformUI
              onMount={this.createWaveSurfer}
              loading={this.state.loading}
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
            <FilePickerDialog
              open={this.state.filePickerDialogOpen}
              onRequestClose={this.closeFilePickerDialog}
              onFileSelected={this.loadNewFile}
            >
            </FilePickerDialog>
            <EditRegionDialog
              open={this.state.editRegionDialogOpen}
              onRequestClose={this.closeEditRegionDialog}
              onSaveChanges={this.saveRegionChanges}
              region={this.state.editingRegion}
              duration={this.state.duration}
            />
          </div>
          <AppSidebar id="sidebar"
            currentTime={this.state.currentTime}
            duration={this.state.duration}
            title={this.state.songTitle}
            playing={this.state.playing}
            looping={this.state.looping}
            slow={this.state.slow}
            loading={this.state.loading}
            regions={this.state.regions}
            onAddRegionClick={this.handleAddRegionClick}
            onSetRegionEndClick={this.handleSetRegionEndClick}
            onRegionClick={this.handleRegionClick}
            onRegionEditClick={this.handleRegionEditClick}
            onRegionDeleteClick={this.handleRegionDeleteClick}
            onPlayClick={this.handlePlayClick}
            onLoopClick={this.handleLoopClick}
            onPrevRegionClick={this.handlePrevRegionClick}
            onNextRegionClick={this.handleNextRegionClick}
            onSlowClick={this.handleSlowClick}
          />
        </div>
      </div>
    );
  }
});

module.exports = Application;
