var React = require('react');
var TextField = require('material-ui/lib/text-field');
var MSM = require('../utils/MSM');

var TimeFieldMSM = React.createClass({

  handleMinutesChange: function(e) {
    var val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    var msm = new MSM(0);
    msm.update({
      milliseconds: this.props.value.milliseconds,
      seconds: this.props.value.seconds,
      minutes: val,
    });
    msm = this.checkBounds(msm);
    this.props.onChange(e, msm);
  },

  handleSecondsChange: function(e) {
    var val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    var msm = new MSM(0);
    msm.update({
      milliseconds: this.props.value.milliseconds,
      seconds: val,
      minutes: this.props.value.minutes
    });
    msm = this.checkBounds(msm);
    this.props.onChange(e, msm);
  },

  handleMillisecondsChange: function(e) {
    var val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    var msm = new MSM(0);
    msm.update({
      milliseconds: val,
      seconds: this.props.value.seconds,
      minutes: this.props.value.minutes
    });
    msm = this.checkBounds(msm);
    this.props.onChange(e, msm);
  },

  checkBounds: function(msm) {
    if (this.props.max < msm.toSeconds()) {
      return new MSM(this.props.max);
    } else if (this.props.min > msm.toSeconds()) {
      return new MSM(this.props.min);
    } else {
      return msm;
    }
  },

  render: function() {
    return (
      <div>
        <TextField
          type="number"
          disabled={this.props.disabled}
          style={this.props.fieldStyle}
          inputStyle={this.props.inputStyle}
          onChange={this.handleMinutesChange}
          value={this.props.value.minutes}
        /> :
        <TextField
          type="number"
          disabled={this.props.disabled}
          style={this.props.fieldStyle}
          inputStyle={this.props.inputStyle}
          onChange={this.handleSecondsChange}
          value={this.props.value.seconds}
        /> :
        <TextField
          type="number"
          disabled={this.props.disabled}
          style={this.props.fieldStyle}
          inputStyle={this.props.inputStyle}
          onChange={this.handleMillisecondsChange}
          value={this.props.value.milliseconds}
        />
      </div>
    );
  }
});

module.exports = TimeFieldMSM;
