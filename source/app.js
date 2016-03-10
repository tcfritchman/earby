var React = require('react');
var ReactDOM = require('react-dom');
var Application = require("./components/Application.react");

var AppElement = React.createElement(
  Application,
  {
    wavesurfer: null
  }
);

ReactDOM.render(
    AppElement,
    document.getElementById('react-application')
);
