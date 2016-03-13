var React = require('react');
var Popover = require('material-ui/lib/popover/popover');
var RaisedButton = require('material-ui/lib/raised-button');

var styles = {
  popover: {
    padding: 20,
  },
};

var SetRegionControls = React.createClass({
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
      <span>
        <RaisedButton
          label="Add Region"
          primary={true}
          onTouchTap={this.handleAddClick}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
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
      </span>
    );
  }
});

module.exports = SetRegionControls;
