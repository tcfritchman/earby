# Earby #

A music player web app for musicians who learn songs by ear.

[Live Demo](http://www.earby.tcfritchman.com)

### Features ###

* Simple playback
* Play/pause
* Next/Prev Region
* Static waveform view
* Position slider
* Regions with markers
* Region list
* Add region and set endpoint at current time
* Delete region from list
* Edit region details in list
* Set start/end with sliders
* Loop region
* Slowed down playback
* Load files from disk
* Iconified buttons
* Current time display
* Timeline in waveform view
* Automated build

### Features to implement ###
* URL support
* More tooltips
* Colors for regions
* Volume control
* Zoom
* Better layout for small screens
* Adjust wavesurfer when screen size changes
* Change playback rate at correct pitch
* Highlight selected region
* Pitch correction (fine tuning)
* Keyboard controls
* Help page
* Accessibility with ARIA

### Possible features ###
* Dropbox support
* Google Drive support
* Youtube support
* Create a playlist with multiple songs
* Save a playlist or recent songs using cache
    * Ability to play through/not/repeat
* Save a playlist to server? (would require registration)
* Settings (using cache)
* Eq filter (to hide or bring out certain instruments)
* Pitch identification tool

### Known Bugs ###
* Wavesurfer encounters errors in Firefox (on Mac)
* Selected region not always in foreground making it impossible to edit using the mouse
* Sometimes dragging sliders causes selection
* Dragging a region does not update the order of the region list
* Deleting the selected region can cause issues
* Error when loading an invalid file not handled elegantly
* Too many regions causes poor performance
* Edit region dialog does not focus on default
* Loop sometimes stays on when all of the regions are deleted

### Installation ###
1. `npm install`
2. `gulp`

### References ###
* [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js)
* [material-ui](http://www.material-ui.com/)
* [react](https://facebook.github.io/react/)
* [react-dropzone](https://github.com/okonet/react-dropzone)
* [underscore.js](http://underscorejs.org/)
