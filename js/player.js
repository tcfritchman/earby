/* player.js - Logic for player controls and functions
 * Author: Thomas Fritchman
 */

var wavesurfer;
var isSlow = false;
var regions = [];

document.addEventListener('DOMContentLoaded', function() {
});

window.onbeforeunload = function() {
if (wavesurfer) {
  wavesurfer.destroy();
}
};

function handleFileChange(files) {
if (files.length) {
  var file = files[0];
  var filename = file.name;
  var filesize = file.size;
  var statusText = filename + ' (' + filesize + ' bytes)';
  $('#source-status-text').html(statusText);
  initializePlayer();
  wavesurfer.loadBlob(file);
}
}

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

/* reset the labels/icons */
setPlayButtonStatus('play');
setLoopButtonStatus('#loop-btn-1-2', 'off')
$('#slow-btn').html('slow');
$('#source-status-text').html('No audio file selected.');

/* reset globals */
isSlow = false;
regions = [];

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

function handleSetStart(regionId) {
if (!wavesurfer) {
  return;
}

var pos = wavesurfer.getCurrentTime();

console.log('set start @ ' + pos);

if (!regions[regionId]) {
  createRegion(regionId, pos, pos, null);
  $('#goto-btn-1').removeAttr('disabled');
  $('#goto-btn-2').removeAttr('disabled');
  $('#loop-btn-1-2').removeAttr('disabled');
  console.log('new region ' + regionId + ' created');
} else {
  regions[regionId].update({start:pos});
}
}

function handleSetEnd(regionId) {
if (!wavesurfer) {
  return;
}

var pos = wavesurfer.getCurrentTime();

console.log('set end @ ' + pos);

if (!regions[regionId]) {
  createRegion(regionId, pos, pos, null);
  $('#goto-btn-1').removeAttr('disabled');
  $('#goto-btn-2').removeAttr('disabled');
  $('#loop-btn-1-2').removeAttr('disabled');
  console.log('new region ' + regionId + ' created');
} else {
  regions[regionId].update({end:pos})
}
}

function handleGotoStart(regionId) {
if (!wavesurfer) {
  return;
}

if (regions[regionId]) {
  var goto = regions[regionId].getStart();
  wavesurfer.play(goto);
  setPlayButtonStatus('pause');
}
}

function handleGotoEnd(regionId) {
if (!wavesurfer) {
  return;
}

if (regions[regionId]) {
  var goto = regions[regionId].getEnd();
  wavesurfer.play(goto);
  setPlayButtonStatus('pause');
}
}

function handleLoop(regionId) {
if (!wavesurfer) {
  return;
}

if (regions[regionId]) {
  var isLoop = regions[regionId].getLoop();
  var goto = regions[regionId].getStart();
  if (isLoop){
    isLoop = false;
    setLoopButtonStatus('#loop-btn-1-2', 'off')
  } else {
    isLoop = true;
    setLoopButtonStatus('#loop-btn-1-2', 'on')
  }
  regions[regionId].update({loop: isLoop})
  if (isLoop) {
    wavesurfer.play(goto);
    setPlayButtonStatus('pause');
  }
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

function setLoopButtonStatus(buttonId, status) {
switch(status) {
  case 'on':
    if ($(buttonId + ' > span').hasClass("glyphicon glyphicon-refresh")) {
      $(buttonId + ' > span').removeClass("glyphicon glyphicon-refresh");
      $(buttonId + ' > span').addClass("glyphicon glyphicon-arrow-right");
    }
    break;
  case 'off':
    if ($(buttonId + ' > span').hasClass("glyphicon glyphicon-arrow-right")) {
      $(buttonId + ' > span').removeClass("glyphicon glyphicon-arrow-right");
      $(buttonId + ' > span').addClass("glyphicon glyphicon-refresh");
    }
}
}

function createRegion(id, startTime, endTime, color) {
var options = {
  id: id,
  start: startTime,
  end: endTime,
  color: 'rgba(255, 255, 0, 0.2)'
};
regions[id] = wavesurfer.addRegion(options);
console.log('new region created with options ' + options);
}
