var React = require('react');
var Dialog = require('material-ui/lib/dialog');
var FlatButton = require('material-ui/lib/flat-button');
var Dropzone = require('react-dropzone');

var FilePickerDialog = React.createClass({
  styles: {},
  actions: [],

  contextTypes: {
    muiTheme: React.PropTypes.object.isRequired
  },

  handleFileChange: function(files) {
    this.setState({
      currentFile: files[0]
    });
  },

  saveAndClose: function() {
    this.props.onFileSelected(this.state.currentFile);
    this.props.onRequestClose();
  },

  getInitialState: function() {
    return {
      currentFile: null
    };
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
        disabled={this.state.currentFile !== null}
      />
    ];

    this.styles = {
      dropZone: {
        width: '90%',
        height: '150px',
        margin: '15px auto',
        border: '2px dashed ' + this.context.muiTheme.baseTheme.palette.textColor,
        padding: '20px 0px',
        textAlign: 'center',
        color: this.context.muiTheme.baseTheme.palette.textColor
      }
    };
  },

  render: function() {
    var fileNameText;
    if (this.state.currentFile !== null) {
      fileNameText = 'Drop a file here. Current: ' + this.state.currentFile.name;
    } else {
      fileNameText = 'Drop a file here.';
    }

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
          style={this.styles.dropZone}
        >
          <div>{fileNameText}</div>
        </Dropzone>
      </Dialog>
    );
  }
});

module.exports = FilePickerDialog;
