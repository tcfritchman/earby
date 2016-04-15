var React = require('react');
var Transport = require('./Transport.react');
var IconButton = require('material-ui/lib/icon-button');
var ViewListIcon = require('material-ui/lib/svg-icons/action/view-list');
var RaisedButton = require('material-ui/lib/raised-button');
var Popover = require('material-ui/lib/popover/popover');
var MSM = require('../utils/MSM');

var AppSidebar = React.createClass({
  styles: {
    root: {
      backgroundColor: "#f5f5f5",
      padding: 20,
      textAlign: 'center'
    },
    timeText: {
      fontSize: 'x-large',
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

  handleRequestClose: function() {
    this.setState({addRegionOpen: false});
  },

  render: function() {
    var currentTimeMSM = new MSM(this.props.currentTime);
    var totalTimeMSM = new MSM(this.props.duration);
    return (
      <div id={this.props.id} style={this.styles.root}>
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
            onPlayClick={this.props.onPlayClick}
            onLoopClick={this.props.onLoopClick}
            onSkipFwdClick={this.props.onSkipFwdClick}
            onSkipBackClick={this.props.onSkipBackClick}
            onPrevRegionClick={this.props.onPrevRegionClick}
            onNextRegionClick={this.props.onNextRegionClick}
          />
        </div>
        <div style={this.styles.regionButton} >
          <RaisedButton
            label="Add Region"
            primary={true}
            onTouchTap={this.handleAddClick}
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
      </div>
    );
  }
});

module.exports = AppSidebar;
