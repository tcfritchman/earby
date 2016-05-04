var React = require('react');
var Transport = require('./Transport.react');

var Sidebar = React.createClass({
  styles: {
    timeText: {
    },
    titleText: {
    },
  },

  render: function() {
    return (
      <div style={this.props.style}>
        <div style={this.styles.timeText}>
          {this.props.currentTime}
        </div>
        <div style={this.styles.titleText}>
          {this.props.title}
        </div>
        <Transport
          playing={this.props.playing}
          looping={this.props.looping}
          onPlayClick={this.props.onPlayClick}
          onSkipFwdClick={this.props.onSkipFwdClick}
          onSkipBackClick={this.props.onSkipBackClick}
          onPrevRegionClick={this.props.onPrevRegionClick}
          onNextRegionClick={this.props.onNextRegionClick}
        />
        <RaisedButton
          label="Add Region"
          primary={true}
          onTouchTap={this.handleAddClick}
        />
      </div>
    );
  }

});

module.exports = Sidebar;
