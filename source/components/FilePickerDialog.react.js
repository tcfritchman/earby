var React = require('react');
var Dialog = require('material-ui/lib/dialog');
var FlatButton = require('material-ui/lib/flat-button');
var Dropzone = require('react-dropzone');

var FilePickerDialog = React.createClass({
  actions: [],

  handleClose: function() {
    this.props.onRequestClose();
  },

  handleFileChange: function(files) {
    this.setState({
      currentFile: files[0]
    });
  },

  componentWillMount: function() {
    this.actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.props.onRequestClose}
      />,
      <FlatButton
        label="Choose"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveAndClose}
      />
    ];
  },

  render: function() {
    return (
      <Dialog
        title="Pick a tune"
        actions={this.actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.onRequestClose}
      >
        <Dropzone
          onDrop={this.handleFileChange}
          multiple={false}
          accept="audio"
        >
          <div>Drop a file here.</div>
        </Dropzone>
      </Dialog>
    );
  }
});

module.exports = FilePickerDialog;
