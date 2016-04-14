var React = require('react');
var Dialog = require('material-ui/lib/dialog');
var FlatButton = require('material-ui/lib/flat-button');
var TextField = require('material-ui/lib/text-field');
var TimeFieldMSM = require('./TimeFieldMSM.react');
var MSM = require('../utils/MSM');

var styles = {
  timeInputField: {
    marginLeft: 5,
    marginRight: 1,
    width: 60
  }
};

var EditRegionDialog = React.createClass({
  actions: [],

  saveAndClose: function() {
    this.props.onRequestClose();
  },

  componentWillMount: function() {
    this.actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.props.onRequestClose}
      />,
      <FlatButton
        label="Save"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveAndClose}
      />
    ];
  },

  getInitialState: function() {
    return {
      title: "",
      start: new MSM(0),
      end: new MSM(0)
    };
  },

  setFieldDefaults: function() {
    this.setState({
      title: this.props.region.data.title,
      start: new MSM(this.props.region.start),
      end: new MSM(this.props.region.end)
    });
  },

  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },

  handleStartChange: function(e, value) {
    this.setState({start: value});
  },

  handleEndChange: function(e, value) {
    this.setState({end: value});
  },

  componentWillReceiveProps: function(nextProps) {
    if (!this.props.open && nextProps.open) {
      this.setFieldDefaults();
    }
  },

  render: function() {
    if (!this.props.region) {
      return (<div></div>);
    } else {
      return (
        <Dialog
          title="Edit Region"
          actions={this.actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.onRequestClose}
        >
          <TextField
            id="name-input"
            hintText="Name"
            value={this.state.title}
            onChange={this.handleTitleChange}
          />
          <br /> Start
          <TimeFieldMSM
            fieldStyle={styles.timeInputField}
            value={this.state.start}
            min={0}
            max={this.props.duration}
            onChange={this.handleStartChange}
          />
          <br /> End
          <TimeFieldMSM
            fieldStyle={styles.timeInputField}
            value={this.state.end}
            min={0}
            max={this.props.duration}
            onChange={this.handleEndChange}
          />
        </Dialog>
      );
    }
  }
});

module.exports = EditRegionDialog;
