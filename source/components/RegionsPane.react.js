var React = require('react');
var EditIcon = require('material-ui/lib/svg-icons/editor/mode-edit');
var DeleteIcon = require('material-ui/lib/svg-icons/action/delete');
var IconButton = require('material-ui/lib/icon-button');
var FlatButton = require('material-ui/lib/flat-button');
var List = require('material-ui/lib/lists/list.js');
var ListItem = require('material-ui/lib/lists/list-item.js');

var styles = {
  itemDiv: {
  /* Override the ListItem styling to accomodate extra button */
    paddingRight: 80
  }
};

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

  render: function() {
    return (
      <ListItem
        onTouchTap={this.handleRegionClick}
        rightIconButton={
          <span>
            <IconButton onTouchTap={this.handleRegionEditClick}>
              <EditIcon />
            </IconButton>
            <IconButton onTouchTap={this.handleRegionDeleteClick}>
              <DeleteIcon />
            </IconButton>
          </span>
        }
      >
        <div style={styles.itemDiv}>
          {this.props.region.data.title}
        </div>
      </ListItem>
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
