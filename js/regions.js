/* regions.js - Manages regions in earby
 * Author: Thomas Fritchman
 */

/* RegionManager - maintain the list of regions */
function RegionManager(ws) {
    this.WS = ws;
    this.regions = [];
    this.currentRegion = null;
    this.loopingActive = false;
    this.regionsAdded = 0;
}

RegionManager.prototype.createRegion = function(options) {
    if (this.loopingActive) {
        console.log('cant create region, looping is active');
        return;
    }
    id = this.regions.length;
    var WSRegion = this.WS.addRegion(options);
    this.regions.push(new Region(WSRegion, id, options.title));
    console.log('new region created with options ' + options);
}

RegionManager.prototype.deleteRegion = function(id) {
    if (this.loopingActive) {
        console.log('cant delete region, looping is active');
        return;
    }
    if (id < this.regions.length) {
        var toDelete = this.regions[id];
        if (this.regions.length == 1) {
            this.regions = [];
            handleNoRegions();
        } else {
            this.regions.splice(id, 1);
        }
        toDelete.region.remove(); /* Remove from wavesurfer */
        console.log('region ' + id + ' deleted');
    } else {
        console.log('unable to delete region');
    }
    this.refreshIds(); // Ensure indices match
}

RegionManager.prototype.clearRegions = function() {
    this.regions = []
    this.WS.clearRegions();
    console.log('regions cleared');
    handleNoRegions();
}

RegionManager.prototype.setCurrentRegion = function(id) {
    if (this.loopingActive) {
        console.log('cant set region, looping is active');
        return;
    }
    if (this.regions.length > id) {
        this.currentRegion = this.regions[id];
        console.log('current region set to ' + id);
    }
}

RegionManager.prototype.getCurrentRegion = function() {
    return this.currentRegion;
}

RegionManager.prototype.regionWithId = function(id) {
    for (var i=0; i<this.regions.length; i++) {
        if (this.regions[i].id == id) {
            return this.regions[i];
        }
    }
    return null;
}

RegionManager.prototype.refreshIds = function() {
    for (var i=0; i<this.regions.length; i++) {
        this.regions[i].id = i;
    }
}

/* Region wrapper class used by RegionManager */
function Region(WSRegion, id, title) {
    this.region = WSRegion; /* A Wavesurfer region object */
    this.id = id;
    this.title = title;
}

/* Region event handlers */
function handleNoRegions() {
    console.log('handling case 0 regions');
    RM.currentRegion = null;
    RM.regionsAdded = 0;
    $('#set-btn-1').prop('disabled', true);
    $('#set-btn-2').prop('disabled', true);
    $('#goto-btn-1').prop('disabled', true);
    $('#goto-btn-2').prop('disabled', true);
    $('#loop-btn-1-2').prop('disabled', true);
}

function handleNewRegion() {
    if (!WS || !RM) {
        return;
    }

    var pos = WS.getCurrentTime();

    regionOptions = {
        start: pos,
        end: null,      /* Creates a very short region, ie. marker */
        title: 'Region', /* Default title */
        color: null
    }

    RM.createRegion(regionOptions);
    renderRegionList();
    $('#set-btn-1').prop('disabled', false);
    $('#set-btn-2').prop('disabled', false);
    $('#goto-btn-1').prop('disabled', false);
    $('#goto-btn-2').prop('disabled', false);
    $('#loop-btn-1-2').prop('disabled', false);
}

function handleDeleteRegion(id) {
    if (!WS || !RM) {
        return;
    }

    RM.deleteRegion(id);
    renderRegionList();
}

function handleSetCurrentRegion(id) {
    if (!WS || !RM) {
        return;
    }

    if (RM.loopingActive) {
        console.log('cant set region, looping is active');
        return;
    }

    RM.setCurrentRegion(id);
    if (RM.getCurrentRegion() != null) {
        $('#selected-region-label').html(RM.currentRegion.id + ' - ' + RM.currentRegion.title);
    } else {
        $('#selected-region-label').html('No region selected');
    }
}

function handleSetStart() {
    if (!WS || !RM) {
        return;
    }

    var pos = WS.getCurrentTime();
    console.log('set start @ ' + pos);
    RM.currentRegion.region.update({start:pos});
}

function handleSetEnd() {
    if (!WS || !RM) {
        return;
    }

    var pos = WS.getCurrentTime();
    console.log('set end @ ' + pos);
    RM.currentRegion.region.update({end:pos})
}

function handleGotoStart() {
    if (!WS || !RM) {
        return;
    }

    var goto = RM.currentRegion.region.getStart();
    WS.play(goto);
    setPlayButtonStatus('pause');
}

function handleGotoEnd() {
    if (!WS || !RM) {
        return;
    }

    var goto = RM.currentRegion.region.getEnd();
    WS.play(goto);
    setPlayButtonStatus('pause');
}

function handleLoop() {
    if (!WS || !RM || RM.currentRegion == null) {
        return;
    }

    var isLoop = RM.currentRegion.region.getLoop();
    var goto = RM.currentRegion.region.getStart();
    if (isLoop) {
        isLoop = false;
        setLoopButtonStatus('#loop-btn-1-2', 'off')
        $('#add-region-btn').prop('disabled', false);
        $('#region-list .list-item-controls button').prop('disabled', false);
    } else {
        isLoop = true;
        setLoopButtonStatus('#loop-btn-1-2', 'on')
        $('#add-region-btn').prop('disabled', true);
        $('#region-list .list-item-controls button').prop('disabled', true);
    }
    RM.currentRegion.region.update({loop: isLoop})
    RM.loopingActive = isLoop;
    if (isLoop) {
        WS.play(goto);
        setPlayButtonStatus('pause');
    }
}

/*
function handleRegionCreated() {
    return function() {
        renderRegionList();
    }
}

function handleRegionUpdated() {
    return function() {
        renderRegionList();
    }
}

function handleRegionRemoved() {
    return function() {
        renderRegionList();
    }
}
*/

function handleRegionClick() {
    return function(region) {
        RM.setCurrentRegion(region.id);
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

function renderRegionList() {
    if (RM.regions.length < 1) {
        $('#region-list').html('No regions.');
        return;
    }

    var template = '{{#items}} <div class="list-item" onclick="handleSetCurrentRegion({{id}})"> <div class="list-item-group"> <div class="list-item-index">{{id}}</div> </div> <div class="list-item-group"> <div class="list-item-text">{{title}}</div> </div> <div class="list-item-group"> <div class="list-item-controls"> <button class="btn btn-default btn-sm" type="button" onclick="handleDeleteRegion({{id}})">Delete</button> </div> </div> </div> {{/items}}'
    var view = {items: RM.regions};
    Mustache.parse(template);
    var rendered = Mustache.render(template, view);
    $('#region-list').html(rendered);
}
