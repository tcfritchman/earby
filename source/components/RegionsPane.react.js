var React = require('react');
var EditIcon = require('material-ui/lib/svg-icons/editor/mode-edit');
var DeleteIcon = require('material-ui/lib/svg-icons/action/delete');
var IconButton = require('material-ui/lib/icon-button');
var FlatButton = require('material-ui/lib/flat-button');
var List = require('material-ui/lib/lists/list.js');
var ListItem = require('material-ui/lib/lists/list-item.js');

var styles = {
  /* Override the ListItem styling to accomodate extra button */
  itemDiv: {
    paddingRight: 80
  }
};

var RegionItem = React.createClass({
  handleClick: function() {
    this.props.onRegionClick(this.props.region);
  },
  render: function() {
    return (
      <ListItem
        onTouchTap={this.handleClick}
        rightIconButton={
          <span>
            <IconButton><EditIcon /></IconButton>
            <IconButton><DeleteIcon /></IconButton>
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

var RegionsPane = React.createClass({
  handleRegionClick: function(region) {
    console.log('test');
    this.props.onRegionClick(region);
  },
  mapRegionsToItems: function(region) {
    return <RegionItem
      region={region}
      onRegionClick={this.handleRegionClick}
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
