# Earby #

A music player web app for musicians who learn songs by ear.

[Live Demo](http://www.earby.tcfritchman.com)

### Features ###

* Simple playback
* Play/pause/skipforward/backward
* Static waveform view
* Regions with markers
* Region list
* Set start/end
* Goto start/end
* Loop region
* Load files from disk
* Iconified buttons
* Timeline in waveform view
* Keyboard controls
* Help page
* Automated build

### Features to implement ###
* URL support
* Time position value indicator
* Tooltips
* Better colors for regions
* Volume control
* Zoom
* Change playback rate at correct pitch
* Highlight selected region
* Pitch correction (fine tuning)
* Accessibility with ARIA

### Possible features ###
* Dropbox support
* Google Drive support
* Youtube support
* Create a playlist with multiple songs
* Save a playlist using cache
    * Ability to play through/not/repeat
* Save a playlist to server? (would require registration)
* Resize waveform with window
* Settings (using cache)
* Eq filter (to hide or bring out certain instruments)
* Pitch identification tool

### Other tasks ###
* Improve the UI appearance and usability

### Bugs ###
* Possible to place marker 2 before marker 1 causing interface glitch
* Moving a marker with the mouse causes playback to jump to the cursor
* Wavesurfer encounters errors in Firefox (on Mac)
* Selected region not always in foreground making it impossible to edit using the mouse
* Keyboard controls conflict with shortcuts in some browsers

### Installation ###
1. `npm install`
2. `npm run build`

### References ###
* [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)
