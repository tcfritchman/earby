var React = require('react');
var RegionsPane = require('./RegionsPane.react');
var Transport = require('./Transport.react');
var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup = require ('material-ui/lib/toolbar/toolbar-group');
var ToolbarSeparator = require('material-ui/lib/toolbar/toolbar-separator');
var ToolbarTitle = require ('material-ui/lib/toolbar/toolbar-title');
var IconButton = require('material-ui/lib/icon-button');
var ViewListIcon = require('material-ui/lib/svg-icons/action/view-list');
var RaisedButton = require('material-ui/lib/raised-button');
var Popover = require('material-ui/lib/popover/popover');

var styles = {
  popover: {
    padding: 20,
  },
};

var AppToolbar = React.createClass({
  getInitialState: function() {
    return {
      addRegionOpen: false,
      regionPaneOpen: false
    };
  },

  handleAddClick: function(event) {
    this.setState({
      addRegionOpen: true,
      anchorEl: event.currentTarget
    });
    this.props.onAddRegionClick();
  },

  handleShowRegionsPane: function(event) {
    this.setState({
      regionPaneOpen: true,
      anchorEl: event.currentTarget
    });
  },

  handleSetEndClick: function() {
    this.setState({addRegionOpen: false});
    this.props.onSetRegionEndClick();
  },

  handleRequestClose: function() {
    this.setState({addRegionOpen: false, regionPaneOpen: false});
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

  render: function() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true} float="left">
          <Transport
            playing={this.props.playing}
            onPlayClick={this.props.onPlayClick}
            onLoopClick={this.props.onLoopClick}
            onSkipFwdClick={this.props.onSkipFwdClick}
            onSkipBackClick={this.props.onSkipBackClick}
            onPrevRegionClick={this.props.onPrevRegionClick}
            onNextRegionClick={this.props.onNextRegionClick}
          />
        </ToolbarGroup>
        <ToolbarGroup float="right">
          <ToolbarSeparator />
          <RaisedButton
            label="Add Region"
            primary={true}
            onTouchTap={this.handleAddClick}
          />
          <Popover
            open={this.state.addRegionOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'center', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
          >
            <div style={styles.popover}>
              <RaisedButton
                primary={false}
                label="Set Region End"
                onClick={this.handleSetEndClick}
              />
            </div>
          </Popover>
          <IconButton
            touch={true}
            onTouchTap={this.handleShowRegionsPane}
          >
            <ViewListIcon />
          </IconButton>
          <Popover
            open={this.state.regionPaneOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
          >
            <RegionsPane
              regions={this.props.regions}
              onRegionClick={this.handleRegionClick}
              onRegionEditClick={this.handleRegionEditClick}
              onRegionDeleteClick={this.handleRegionDeleteClick}
            />
          </Popover>
        </ToolbarGroup>
      </Toolbar>
    );
  }
});

module.exports = AppToolbar;
