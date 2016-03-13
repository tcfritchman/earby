var React = require('react');

var Wavesurfer = React.createClass({
  componentDidMount: function() {
    this.props.onMount();
  },
  render: function() {
    return <div id="wavesurfer"></div>;
  }
});

module.exports = Wavesurfer;
