/* player.js - Logic for player controls and functions
 * Author: Thomas Fritchman
 */

var wavesurfer;
var isSlow = false;

var fileBrowseSession = {
    selectedFiles: null,
    selectedFileSource: null,
    setSelected: function(files, source) {
        this.selectedFiles = files;
        this.selectedFileSource = source;
    },
    handleOK: function() {
        switch(this.selectedFileSource) {
            case 'local':
                this.handleFileChange(this.selectedFiles);
                break;
            //case 'gdrive': ... etc.
        }
    },
    handleCancel: function() {

    },
    handleFileChange: function(files) {
        if (files.length) {
            var file = files[0];
            var filename = file.name;
            var filesize = file.size;
            var statusText = filename + ' (' + filesize + ' bytes)';
            initializePlayer();
            $('#source-status-text').html(statusText);
            wavesurfer.loadBlob(file);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
});

window.onbeforeunload = function() {
    if (wavesurfer) {
        wavesurfer.destroy();
    }
};

function initializePlayer() {
    console.log('initializing player...');

    if (wavesurfer) {
        wavesurfer.destroy();
    }

    /* reset the buttons as disabled */
    $('#play-btn').prop('disabled', true);
    $('#prev-btn').prop('disabled', true);
    $('#next-btn').prop('disabled', true);
    $('#slow-btn').prop('disabled', true);
    $('#set-btn-1').prop('disabled', true);
    $('#set-btn-2').prop('disabled', true);
    $('#goto-btn-1').prop('disabled', true);
    $('#goto-btn-2').prop('disabled', true);
    $('#loop-btn-1-2').prop('disabled', true);
    $('#add-region-btn').prop('disabled', true);

    /* reset the labels/icons */
    setPlayButtonStatus('play');
    setLoopButtonStatus('#loop-btn-1-2', 'off')
    $('#slow-btn').html('slow');
    $('#source-status-text').html('No audio file selected.');

    /* reset globals */
    isSlow = false;
    regions = [];
    currentRegion = null;

    /* initialize the wavesurfer */
    wavesurfer = Object.create(WaveSurfer);
    var options = {
        container     : document.querySelector('#player'),
        waveColor     : '#444',
        progressColor : '#666',
        cursorColor   : 'red',
        cursorWidth   : 2
    };
    wavesurfer.init(options);

    /* event listeners */
    wavesurfer.on('ready', handlePlayerReady());
    wavesurfer.on('finish', handleEndOfFile());
}

function handlePlayerReady() {
    return function() {
        console.log('player ready');
        $('#play-btn').removeAttr('disabled');
        $('#prev-btn').removeAttr('disabled');
        $('#next-btn').removeAttr('disabled');
        $('#slow-btn').removeAttr('disabled');
        $('#set-btn-1').removeAttr('disabled');
        $('#set-btn-2').removeAttr('disabled');
        $('#add-region-btn').removeAttr('disabled');

        /* These seem to only work if declared after audio loads */
        wavesurfer.on('region-created', handleRegionCreated());
        wavesurfer.on('region-updated', handleRegionUpdated());
        wavesurfer.on('region-removed', handleRegionRemoved());
        wavesurfer.on('region-click', handleRegionClick());
    }
}

function handleURLChange() {
    var url = document.getElementById('enter-url').value;
    $('#source-status-text').html(url);
    wavesurfer.load(url);
}

function handleEndOfFile() {
    return function() {
        console.log('end of file');
        setPlayButtonStatus('play');
    }
}

function handlePlayToggle() {
    if (!wavesurfer) {
        return;
    }
    console.log('play toggle');

    if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
        setPlayButtonStatus('play');
    } else {
        wavesurfer.play();
        setPlayButtonStatus('pause');
    }
}

function handlePrev() {
    if (!wavesurfer) {
        return;
    }

    wavesurfer.skipBackward();
}

function handleNext() {
    if (!wavesurfer) {
        return;
    }

    wavesurfer.skipForward();
}

function handleSlow() {
    /* TODO: find a way to playback at original pitch */
    if (!wavesurfer) {
        return;
    }

    if(isSlow) {
        isSlow = false;
        wavesurfer.setPlaybackRate(1.0);
        $('#slow-btn').html('slow');
    } else {
        isSlow = true;
        wavesurfer.setPlaybackRate(0.5);
        $('#slow-btn').html('normal');
    }
}

function setPlayButtonStatus(status) {
    switch(status) {
      case "play":
        if ($('#play-btn > span').hasClass("glyphicon glyphicon-pause")) {
          $('#play-btn > span').removeClass("glyphicon glyphicon-pause");
          $('#play-btn > span').addClass("glyphicon glyphicon-play");
        }
        break;
      case "pause":
        if ($('#play-btn > span').hasClass("glyphicon glyphicon-play")) {
          $('#play-btn > span').removeClass("glyphicon glyphicon-play");
          $('#play-btn > span').addClass("glyphicon glyphicon-pause");
        }
    }
}
