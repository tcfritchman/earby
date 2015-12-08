/* regions.js - Manages regions in earby
 * Author: Thomas Fritchman
 */

var regions = [];
var currentRegion = null;
var regionsAdded = 0;

function createRegion(options) {
    options.id = regions.length;
    regions[regions.length] = wavesurfer.addRegion(options);
    console.log('new region created with options ' + options);
}

function deleteRegion(id) {
    if (id < regions.length) {
        toDelete = regions[id];
        if (regions.length == 1) {
            regions = [];
            handleNoRegions();
        } else {
            regions.splice(id, 1);
        }
        toDelete.remove();
        refreshIds(); // Ensure indexes match
        console.log('region ' + id + ' deleted');
    }
    console.log('unable to delete region');
}

function clearRegions() {
    regions = []
    wavesurfer.clearRegions();
    // REMOVE REGIONS FROM LIST
    console.log('regions cleared');
    handleNoRegions();
}

function setCurrentRegion(id) {
    if (regions.length > id) {
        currentRegion = regions[id];
        console.log('current region set to ' + id);
    }
}

function getCurrentRegion() {
    return currentRegion;
}

function regionWithId(id) {
    for (var i=0; i<regions.length; i++) {
        if (regions[i].id == id) {
            return regions[i];
        }
    }
    return null;
}

function refreshIds() {
    for (var i=0; i<regions.length; i++) {
        region[i].id = i;
    }
}

function handleNoRegions() {
    console.log('handling case 0 regions');
    currentRegion = null;
    regionsAdded = 0;
    $('#set-btn-1').prop('disabled', true);
    $('#set-btn-2').prop('disabled', true);
    $('#goto-btn-1').prop('disabled', true);
    $('#goto-btn-2').prop('disabled', true);
    $('#loop-btn-1-2').prop('disabled', true);
}

function handleNewRegion() {
    if (!wavesurfer) {
        return;
    }

    var pos = wavesurfer.getCurrentTime();

    regionOptions = {
        start: pos,
        end: null,      /* Creates a very short region, ie. marker */
        name: 'Region', /* Default name */
        color: null
    }

    createRegion(regionOptions);
    $('#goto-btn-1').removeAttr('disabled');
    $('#goto-btn-2').removeAttr('disabled');
    $('#loop-btn-1-2').removeAttr('disabled');
}

function handleDeleteRegion(id) {
    deleteRegion(id);
    renderRegionList();
}

function handleSetCurrentRegion(id) {
    setCurrentRegion(id);
    $('#selected-region-label').html(currentRegion.id);
}

function handleSetStart() {
    if (!wavesurfer) {
        return;
    }

    var pos = wavesurfer.getCurrentTime();
    console.log('set start @ ' + pos);
    currentRegion.update({start:pos});
}

function handleSetEnd() {
    if (!wavesurfer) {
        return;
    }

    var pos = wavesurfer.getCurrentTime();
    console.log('set end @ ' + pos);
    currentRegion.update({end:pos})
}

function handleGotoStart() {
    if (!wavesurfer) {
        return;
    }

    var goto = currentRegion.getStart();
    wavesurfer.play(goto);
    setPlayButtonStatus('pause');
}

function handleGotoEnd() {
    if (!wavesurfer) {
        return;
    }

    var goto = currentRegion.getEnd();
    wavesurfer.play(goto);
    setPlayButtonStatus('pause');
}

function handleLoop() {
    if (!wavesurfer) {
        return;
    }

    var isLoop = currentRegion.getLoop();
    var goto = currentRegion.getStart();
    if (isLoop){
        isLoop = false;
        setLoopButtonStatus('#loop-btn-1-2', 'off')
    } else {
        isLoop = true;
        setLoopButtonStatus('#loop-btn-1-2', 'on')
    }
    currentRegion.update({loop: isLoop})
    if (isLoop) {
        wavesurfer.play(goto);
        setPlayButtonStatus('pause');
    }
}

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

function handleRegionClick() {
    return function(region) {
        setCurrentRegion(region.id);
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
    if (regions.length < 1) {
        return;
    }

    var template = '{{#items}} <div class="list-item" onclick="handleSetCurrentRegion({{id}})"> <div class="list-item-group"> <div class="list-item-index">{{id}}</div> </div> <div class="list-item-group"> <div class="list-item-text">{{id}}</div> </div> <div class="list-item-group"> <div class="list-item-controls"> <button class="btn btn-default btn-sm" type="button" onclick="handleDeleteRegion({{id}})">Delete</button> </div> </div> </div> {{/items}}'
    var view = {items: regions};
    Mustache.parse(template);
    var rendered = Mustache.render(template, view);
    $('#region-list').html(rendered);

    /* Async seems to really mess with this one... justifiably I guess...
    $.get('templates/regionList.stache', function(template) {
        var view = {items: regions};
        var rendered = Mustache.render(template, view);
        $('#region-list').html(rendered);
    });
    */
}
