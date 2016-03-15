var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');
var TempHandle = require('material-ui/lib/svg-icons/navigation/arrow-drop-up');
var slidable = require('/mixins/slidable.js');

styles = {
  root: {
    userSelect: 'none',
    cursor: 'default',
    position: 'relative',
    marginTop: 0,
    marginBottom: 48
  },
  track: {
    position: 'absolute',
    top: 24,
    left: 0,
    width: '100%'
  },
  handle: {
    boxSizing: 'border-box',
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: '0%',
    overflow: 'visible'
  }
};

var PositionSlider
  = React.createClass(_.extend(slidable), {
});

module.exports = PositionSlider ;
