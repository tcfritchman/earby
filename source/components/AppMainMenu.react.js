var React = require('react');
var LeftNav = require('material-ui/lib/left-nav');
var MenuItem = require('material-ui/lib/menus/menu-item');

var AppMainMenu = React.createClass({
  handleRequestChange: function(open) {
    (open ? this.props.setMenuOpen : this.props.setMenuClosed)();
  },

  render: function() {
    return (
      <div>
        <LeftNav
          docked={false}
          width={200}
          open={this.props.open}
          onRequestChange = {this.handleRequestChange}
        >
          <MenuItem onTouchTap={this.props.onLoadFileClick}>Load File</MenuItem>
        </LeftNav>
      </div>
    );
  }
});

module.exports = AppMainMenu;
