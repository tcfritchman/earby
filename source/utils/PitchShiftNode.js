var PitchShift = require('pitch-shift');

function PitchShiftNode(audioCtx, bufferSize, inChannels, outChannels) {

  var shifter = PitchShift(
    function onData(frame) {
    },
    function onTune(t, pitch) {
    },
    {
      frameSize: bufferSize,
      sampleRate: audioCtx.sampleRate,
    }
  );

  var scriptNode = audioCtx.createScriptProcessor(bufferSize, inChannels, outChannels);
  scriptNode.onaudioprocess = function(audioProcessingEvent) {
    var inBuffer = audioProcessingEvent.inputBuffer;
    var outBuffer = audioProcessingEvent.outputBuffer;

    /* Loop through output channels */
    for (var channel = 0; channel < outBuffer.numberOfChannels; channel++) {
      var inData = inBuffer.getChannelData(channel);
      var outData = outBuffer.getChannelData(channel);

      for (var sample = 0; sample < inBuffer.length; sample++) {
        outData[sample] = inData[sample];
      }

      shifter.doPitchShift(outData);

    }
  };
}
