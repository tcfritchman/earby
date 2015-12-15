/* player.js - Logic for player controls and functions in earby
 * Author: Thomas Fritchman
 */

/* Globals */
var WS;                     /* wavesurfer */
var isSlow = false;

/* A session for when the user is choosing a music file to use in the app */
// TODO: extract this class into its own file
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
            WS.loadBlob(file);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
});

window.onbeforeunload = function() {
    if (WS) {
        /* Remove the wavesurfer when the window is closed to help
            prevent audio glitches */
        WS.destroy();
    }
};

function initializePlayer() {
    console.log('initializing player...');

    if (WS) {
        WS.destroy();
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

    /* initialize the wavesurfer */
    WS = Object.create(WaveSurfer);
    var options = {
        container     : document.querySelector('#player'),
        waveColor     : '#444',
        progressColor : '#666',
        cursorColor   : 'red',
        cursorWidth   : 2
    };
    WS.init(options);

    /* Reset region-related elements */
    renderRegionList();
    renderRegionLabel();

    /* event listeners */
    WS.on('ready', handlePlayerReady());
    WS.on('finish', handleEndOfFile());
}

function handlePlayerReady() {
    return function() {
        console.log('player ready');
        $('#play-btn').removeAttr('disabled');
        $('#prev-btn').removeAttr('disabled');
        $('#next-btn').removeAttr('disabled');
        $('#slow-btn').removeAttr('disabled');
        $('#add-region-btn').removeAttr('disabled');

        var timeline = Object.create(WaveSurfer.Timeline);

        timeline.init({
            wavesurfer: WS,
            container: "#timeline-container",
            notchPercentHeight: 40,
            primaryColor: '#4d7eb2',
            secondaryColor: '#375a7f',
            primaryFontColor: '#4d7eb2',
            secondaryFontColor: '#375a7f'
        });

        /* These seem to only work if declared after audio loads */
        /*WS.on('region-created', handleRegionCreated());
        WS.on('region-updated', handleRegionUpdated());
        WS.on('region-removed', handleRegionRemoved()); */
        //WS.on('region-click', handleRegionClick());
    }
}

function handleURLChange() {
    var url = document.getElementById('enter-url').value;
    $('#source-status-text').html(url);
    WS.load(url);
}

function handleEndOfFile() {
    return function() {
        console.log('end of file');
        setPlayButtonStatus('play');
    }
}

function handlePlayToggle() {
    if (!WS) {
        return;
    }
    console.log('play toggle');

    if (WS.isPlaying()) {
        WS.pause();
        setPlayButtonStatus('play');
    } else {
        WS.play();
        setPlayButtonStatus('pause');
    }
}

function handlePrev() {
    if (!WS) {
        return;
    }

    WS.skipBackward();
}

function handleNext() {
    if (!WS) {
        return;
    }

    WS.skipForward();
}

function handleSlow() {
    /* TODO: find a way to playback at original pitch */
    if (!WS) {
        return;
    }

    if(isSlow) {
        isSlow = false;
        WS.setPlaybackRate(1.0);
        $('#slow-btn').html('slow');
    } else {
        isSlow = true;
        WS.setPlaybackRate(0.5);
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
