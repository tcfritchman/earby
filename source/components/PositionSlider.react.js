// don't need this file
var React = require('react');
var ReactDOM = require('react-dom');
var SimpleSlider = require('./SimpleSlider.react');

styles = {
};

var PositionSlider = React.createClass({
  render: function() {
    return(
      <SimpleSlider />
    );
  }
});

module.exports = PositionSlider ;
