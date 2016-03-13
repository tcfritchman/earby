var React = require('react');
var SetRegionControls = require('./SetRegionControls.react');
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
      open: false
    };
  },
  handleAddClick: function(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
    this.props.onAddRegionClick();
  },
  handleSetEndClick: function() {
    this.setState({open: false});
    this.props.onSetRegionEndClick();
  },
  handleRequestClose: function() {
    this.setState({open: false});
  },
  render: function() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true} float="left">
        </ToolbarGroup>
        <ToolbarGroup float="right">
          <ToolbarSeparator />
          <RaisedButton
            label="Add Region"
            primary={true}
            onTouchTap={this.handleAddClick}
          />
          <Popover
            open={this.state.open}
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
          <IconButton touch={true}>
            <ViewListIcon />
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    );
  }
});

module.exports = AppToolbar;
