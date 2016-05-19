var React = require('react');
var Transport = require('./Transport.react');
var RegionsPane = require('./RegionsPane.react');
var IconButton = require('material-ui/lib/icon-button');
var ViewListIcon = require('material-ui/lib/svg-icons/action/view-list');
var RaisedButton = require('material-ui/lib/raised-button');
var Popover = require('material-ui/lib/popover/popover');
var Divider = require('material-ui/lib/divider');
var Paper = require('material-ui/lib/paper');
var MSM = require('../utils/MSM');

var AppSidebar = React.createClass({
  styles: {
    root: {
      backgroundColor: "#f5f5f5",
      padding: 20,
      textAlign: 'center'
    },
    timeText: {
      fontSize: 'xx-large',
      textAlign: 'center',
    },
    totalTimeText: {
      marginLeft: 30,
      fontSize: 'small',
      textAlign: 'center'
    },
    titleText: {
      textAlign: 'center',
      margin: '10px auto'
    },
    transport: {
      width: 144,
      margin: '12px auto'
    },
    popover: {
      padding: 20,
    },
    regionButton: {
      display: 'inline-block',
      padding: 20
    }
  },

  getInitialState: function() {
    return {
      addRegionOpen: false,
    };
  },

  handleAddClick: function(event) {
    this.setState({
      addRegionOpen: true,
      anchorEl: event.currentTarget
    });
    this.props.onAddRegionClick();
  },

  handleSetEndClick: function() {
    this.setState({addRegionOpen: false});
    this.props.onSetRegionEndClick();
  },

  handleRegionClick: function(region) {
    this.props.onRegionClick(region);
    this.setState({regionPaneOpen: false});
  },

  handleRegionEditClick: function(region) {
    this.props.onRegionEditClick(region);
    this.setState({regionPaneOpen: false});
  },

  handleRegionDeleteClick: function(region) {
    this.props.onRegionDeleteClick(region);
    this.setState({regionPaneOpen: false});
  },

  handleRequestClose: function() {
    this.setState({addRegionOpen: false});
  },

  render: function() {
    var currentTimeMSM = new MSM(this.props.currentTime);
    var totalTimeMSM = new MSM(this.props.duration);
    return (
      <Paper
        id={this.props.id}
        style={this.styles.root}>
        <div style={this.styles.timeText}>
          {currentTimeMSM.toString()}
        </div>
        <div style={this.styles.totalTimeText}>
          {'/' + totalTimeMSM.toString()}
        </div>
        <div style={this.styles.titleText}>
          {this.props.title}
        </div>
        <div style={this.styles.transport}>
          <Transport
            playing={this.props.playing}
            loading={this.props.loading}
            onPlayClick={this.props.onPlayClick}
            onLoopClick={this.props.onLoopClick}
            onSlowClick={this.props.onSlowClick}
            onSkipFwdClick={this.props.onSkipFwdClick}
            onSkipBackClick={this.props.onSkipBackClick}
            onPrevRegionClick={this.props.onPrevRegionClick}
            onNextRegionClick={this.props.onNextRegionClick}
          />
        </div>
        <Divider />
        <div style={this.styles.regionButton} >
          <RaisedButton
            label="Add Region"
            primary={true}
            onTouchTap={this.handleAddClick}
            disabled={this.props.loading}
          />
        </div>
        <Popover
          open={this.state.addRegionOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'center', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <div style={this.styles.popover}>
            <RaisedButton
              primary={false}
              label="Set Region End"
              onClick={this.handleSetEndClick}
            />
          </div>
        </Popover>
        <RegionsPane
          regions={this.props.regions}
          onRegionClick={this.handleRegionClick}
          onRegionEditClick={this.handleRegionEditClick}
          onRegionDeleteClick={this.handleRegionDeleteClick}
        />
      </Paper>
    );
  }
});

module.exports = AppSidebar;
