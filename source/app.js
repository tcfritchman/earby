var React = require('react');
var ReactDOM = require('react-dom');
var Application = require('./components/Application.react');
var injectTapEventPlugin = require('react-tap-event-plugin');

var AppElement = React.createElement(
  Application,
  {
    wavesurfer: null
  }
);

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ReactDOM.render(
    AppElement,
    document.getElementById('react-application')
);
