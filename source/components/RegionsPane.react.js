var React = require('react');
var EditIcon = require('material-ui/lib/svg-icons/editor/mode-edit');
var DeleteIcon = require('material-ui/lib/svg-icons/action/delete');
var IconButton = require('material-ui/lib/icon-button');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var MoreVertIcon = require('material-ui/lib/svg-icons/navigation/more-vert');
var FlatButton = require('material-ui/lib/flat-button');
var List = require('material-ui/lib/lists/list.js');
var ListItem = require('material-ui/lib/lists/list-item.js');
var MSM = require('../utils/MSM');

var styles = {
  listItem: {
    width: '200px',
  },
};

var iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon />
  </IconButton>
);

/* Wrapper for the ListItem component */
var RegionItem = React.createClass({
  handleRegionClick: function() {
    this.props.onRegionClick(this.props.region);
  },

  handleRegionEditClick: function() {
    this.props.onRegionEditClick(this.props.region);
  },

  handleRegionDeleteClick: function() {
    this.props.onRegionDeleteClick(this.props.region);
  },

  formatTitleText: function(region) {
    var startMSM = new MSM(region.start);
    var endMSM = new MSM(region.end);
    var startStr = startMSM.toString().split(':');
    var endStr = endMSM.toString().split(':');
    startStr = startStr[0] + ':' + startStr[1];
    endStr = endStr[0] + ':' + endStr[1];
    return startStr + ' - ' + endStr;
  },

  render: function() {
    return (
      <ListItem
        style={styles.listItem}
        primaryText={this.formatTitleText(this.props.region)}
        secondaryText={this.props.region.data.title}
        onTouchTap={this.handleRegionClick}
        rightIconButton={
          <IconMenu iconButtonElement={iconButtonElement}>
            <MenuItem
              onTouchTap={this.handleRegionEditClick}
              leftIcon={<EditIcon />}
            >
              Edit
            </MenuItem>
            <MenuItem
              onTouchTap={this.handleRegionDeleteClick}
              leftIcon={<DeleteIcon />}
            >
              Delete
            </MenuItem>
          </IconMenu>
        }
      />
    );
  }
});

/* List component containing the list of regions */
var RegionsPane = React.createClass({
  handleRegionClick: function(region) {
    this.props.onRegionClick(region);
  },

  handleRegionEditClick: function(region) {
    this.props.onRegionEditClick(region);
  },

  handleRegionDeleteClick: function(region) {
    this.props.onRegionDeleteClick(region);
  },

  mapRegionsToItems: function(region) {
    return <RegionItem
      region={region}
      onRegionClick={this.handleRegionClick}
      onRegionEditClick={this.handleRegionEditClick}
      onRegionDeleteClick={this.handleRegionDeleteClick}
    />;
  },

  render: function() {
    return (
      <List>
        {this.props.regions.map(this.mapRegionsToItems)}
      </List>
    );
  }
});

module.exports = RegionsPane;
