var colors = require('material-ui/lib/styles/colors');
var colorManipulator = require('material-ui/lib/utils/color-manipulator');

exports.default = {
  palette: {
    primary1Color: colors.indigo700,
    primary2Color: colors.indigo700,
    primary3Color: colors.grey600,
    accent1Color: colors.pinkA200,
    accent2Color: colors.pinkA400,
    accent3Color: colors.pinkA100,
    textColor: colors.fullWhite,
    alternateTextColor: colors.grey300,
    canvasColor: '#303030',
    borderColor: colorManipulator.fade(colors.fullWhite, 0.3),
    disabledColor: colorManipulator.fade(colors.fullWhite, 0.3),
    pickerHeaderColor: colorManipulator.fade(colors.fullWhite, 0.12),
    clockCircleColor: colorManipulator.fade(colors.fullWhite, 0.12),
    shadowColor: colors.fullBlack,
    mainViewColor: '#202020',
    slowToggleColor: colors.yellow300,
    loopToggleColor: colors.lightGreen300,
    wavePrimaryColor: colors.grey800,
    waveSecondaryColor: colors.fullBlack
  }
};

module.exports = exports['default'];
