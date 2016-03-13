var React = require('react');
var EditIcon = require('material-ui/lib/svg-icons/editor/mode-edit');
var DeleteIcon = require('material-ui/lib/svg-icons/action/delete');
var IconButton = require('material-ui/lib/icon-button');
var FlatButton = require('material-ui/lib/flat-button');
var List = require('material-ui/lib/lists/list.js');
var ListItem = require('material-ui/lib/lists/list-item.js');

var styles = {
  itemStyle: {
  },
};

var RegionItem = React.createClass({
  render: function() {
    return (
      <ListItem
        primaryText={this.props.region.data.title}
        style={styles.itemStyle}
        rightIconButton={
          <span>
            <IconButton><EditIcon /></IconButton>
            <IconButton><DeleteIcon /></IconButton>
          </span>
        }
      />
    );
  }
});

var RegionsPane = React.createClass({
  render: function() {
    return (
      <List>
        {this.props.regions.map(function(region) {
          return <RegionItem
            region={region}
          />;
      })}
      </List>
    );
  }
});

module.exports = RegionsPane;
