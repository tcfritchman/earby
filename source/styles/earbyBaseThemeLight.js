var colors = require('material-ui/lib/styles/colors');
var colorManipulator = require('material-ui/lib/utils/color-manipulator');

exports.default = {
  palette: {
    primary1Color: colors.cyan500,
    primary2Color: colors.cyan700,
    primary3Color: colors.grey400,
    accent1Color: colors.pinkA200,
    accent2Color: colors.grey100,
    accent3Color: colors.grey500,
    textColor: colors.darkBlack,
    alternateTextColor: colors.white,
    canvasColor: colors.white,
    borderColor: colors.grey300,
    disabledColor: colorManipulator.fade(colors.darkBlack, 0.3),
    pickerHeaderColor: colors.cyan500,
    clockCircleColor: colorManipulator.fade(colors.darkBlack, 0.07),
    shadowColor: colors.fullBlack
  }
};

module.exports = exports['default'];
