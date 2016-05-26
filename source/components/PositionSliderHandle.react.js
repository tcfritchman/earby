var React = require('react');

var PositionSliderHandle = React.createClass({
  styles: {
    width: 48,
    height: 48,
    verticalAlign: 'middle'
  },
  
  render: function() {
    return (
      <svg
         style={this.styles} viewBox="0 0 440.00001 291.4947" preserveAspectRatio="xMidYMid meet" fit>
        <g
           transform="translate(0,-760.86751)"
           id="layer1">
          <path
             id="rect3336"
             d="m 131.75,836.86223 -88.25,0 c -23.822,0 -43,19.178 -43,43 l 0,128.99997 c 0,23.822 19.178,43 43,43 l 353,0 c 23.822,0 43,-19.178 43,-43 l 0,-128.99997 c 0,-23.822 -19.178,-43 -43,-43 l -88.25,0 c -51.48045,-2.13449 -78.12973,-34.91482 -88.25,-74 -10.12027,39.08518 -36.76955,71.86551 -88.25,74 z"
             fill="#808080" />
          <path
             id="path4162"
             d="m 139.18522,383.80267 c 3.3e-4,-11.27835 0.098,-15.79321 0.21695,-10.03301 0.11899,5.76019 0.11872,14.98794 -6.1e-4,20.50609 -0.11932,5.51816 -0.21668,0.80528 -0.21634,-10.47308 z"
             fill="#b3b3b3" />
          <path
             id="path4164"
             d="m 139.82729,393.34861 c 0,-3.30572 0.1218,-4.65806 0.27067,-3.0052 0.14887,1.65286 0.14887,4.35755 0,6.01041 -0.14887,1.65286 -0.27067,0.30052 -0.27067,-3.00521 z"
             fill="#b3b3b3" />
        </g>
        <g
           transform="translate(0,-760.86751)"
           id="layer2">
          <rect
             ry="0"
             y="868.86224"
             x="209.60808"
             height="150.20238"
             width="21.391916"
             id="rect4188"
             fill="#4d4d4d" />
          <rect
             fill="#4d4d4d"
             id="rect4190"
             width="21.391916"
             height="150.20238"
             x="267.26617"
             y="868.86224"
             ry="0" />
          <rect
             fill="#4d4d4d"
             id="rect4192"
             width="21.391916"
             height="150.20238"
             x="151.95001"
             y="868.86224"
             ry="0" />
        </g>
      </svg>
    );
  }
});

module.exports = PositionSliderHandle;
