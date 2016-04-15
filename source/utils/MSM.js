/* Helper to perform a true modulus */
function mod(n, m) {
        return ((n % m) + m) % m;
}

/* Represent POSITIVE time values in the format minutes:seconds:milliseconds
  - Rounds down to the millisecond.
  - toString format ~ M:SS:mmm where minutes are not padded
*/
function MSM(seconds) {
  var truncSecs = Math.floor(seconds);
  this.milliseconds = Math.floor(1000 * (seconds - truncSecs));
  this.minutes      = Math.floor(truncSecs / 60);
  this.seconds      = Math.floor(truncSecs % 60);
}

MSM.prototype.toSeconds = function() {
  return ((this.minutes * 60) + this.seconds + (this.milliseconds / 1000));
};

MSM.prototype.equals = function(msm) {
  return (this.minutes === msm.minutes && this.seconds === msm.seconds && this.milliseconds === msm.milliseconds);
};

MSM.prototype.toString = function() {
  var msZeros;
  if (this.milliseconds !== 0) {
    msZeros = 2 - Math.floor(Math.log10(this.milliseconds));
  } else {
    msZeros = 2;
  }
  var str = this.minutes.toString() + ':';
  if (this.seconds <= 9) str += '0';
  str += this.seconds.toString() + ':';
  for (var i = msZeros; msZeros > 0; msZeros--) {
    str += '0';
  }
  return str + this.milliseconds.toString();
};

MSM.prototype.update = function(msm) {
  if (msm.milliseconds >= 1000 || msm.milliseconds < 0) {
    msm.seconds += Math.floor(msm.milliseconds / 1000);
    msm.milliseconds = mod(msm.milliseconds, 1000);
  }

  if (msm.seconds >= 60 || msm.seconds < 0) {
    msm.minutes += Math.floor(msm.seconds / 60);
    msm.seconds = mod(msm.seconds, 60);
  }

  this.milliseconds = msm.milliseconds;
  this.seconds = msm.seconds;
  this.minutes = msm.minutes;
};

module.exports = MSM;
