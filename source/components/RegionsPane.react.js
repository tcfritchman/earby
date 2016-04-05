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
  handleClick: function() {
    this.props.onRegionClick(this.props.region);
  },

  handleClickDelete: function() {
    this.props.onRegionDeleteClick(this.props.region);
  },

  render: function() {
    return (
      <ListItem
        onTouchTap={this.handleClick}
        rightIconButton={
          <span>
            <IconButton>
              <EditIcon />
            </IconButton>
            <IconButton onTouchTap={this.handleClickDelete}>
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

  handleRegionDeleteClick: function(region) {
    this.props.onRegionDeleteClick(region);
  },

  mapRegionsToItems: function(region) {
    return <RegionItem
      region={region}
      onRegionClick={this.handleRegionClick}
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
