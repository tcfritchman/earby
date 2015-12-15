/* regions.js - Manages regions in earby
 * Author: Thomas Fritchman
 */

var currentRegion = null;
var regionsAdded = 0;

/* Region helpers */
function setCurrentRegion (id) {
    if (getRegionIsLoop()) {
        console.log('cant set region, looping is active');
        return;
    }
    if (WS.Regions[id]) {
        currentRegion = WS.Regions[id];
        console.log('current region set to ' + id);
    } else {
        console.log('Region with id ' + id + ' doesnt exist');
    }
}

function clearCurrentRegion() {
    if (getRegionIsLoop()) {
        console.log('cant clear region, looping is active');
        return;
    }
    currentRegion = null;
    console.log('current region cleared');
}

function getRegionWithId(id) {
    if (!WS || !WS.Regions) {
        return;
    }
    return WS.Regions[id] || null;
}

function getRegionIsLoop()
    for (var r in WS.Regions) {
        if (object.hasOwnProperty(r)) {
            if (r.loop) {
                return r;
            }
        }
    }
    return null;
}

/* Region event handlers */
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
    if (!WS || !WS.Regions) {
        return;
    }

    if (getRegionIsLoop()) {
        console.log('cant create region, looping is active');
        return;
    }

    var pos = WS.getCurrentTime();

    var options = {
        id: ++regionsAdded,
        start: pos,
        end: null,      /* Creates a very short region, ie. marker */
        data: {
            title: 'Region' /* Default title */
        },
        color: null
    }

    var r = WS.addRegion(options);
    setCurrentRegion(r.id);     /* Set current as new region */

    updateRegionAnnotation(r, r.title);
    renderRegionList();
    renderRegionLabel();
    $('#set-btn-1').prop('disabled', false);
    $('#set-btn-2').prop('disabled', false);
    $('#goto-btn-1').prop('disabled', false);
    $('#goto-btn-2').prop('disabled', false);
    $('#loop-btn-1-2').prop('disabled', false);
}

function handleDeleteRegion(id) {
    if (!WS || !WS.Regions) {
        return;
    }

    if (getRegionIsLoop()) {
        console.log('cant delete region, looping is active');
        return;
    }

    var toDelete = getRegionWithId(id);

    if (toDelete) {
        if (toDelete == currentRegion) {
            clearCurrentRegion();
        }
        toDelete.remove();
        console.log('region ' + id + ' deleted');
    }

    if (WS.Regions.length == 1) {
        handleNoRegions();
    }

    renderRegionList();
    renderRegionLabel();
}

function handleSetCurrentRegion(id) {
    if (!WS || !WS.Regions) {
        return;
    }

    setCurrentRegion(id);
    renderRegionLabel();
}

function handleSetStart() {
    if (!WS || !WS.Regions || !currentRegion) {
        return;
    }

    var pos = WS.getCurrentTime();
    currentRegion.update({start:pos});
    console.log('set start @ ' + pos);
}

function handleSetEnd() {
    if (!WS || !WS.Regions || !currentRegion) {
        return;
    }

    var pos = WS.getCurrentTime();
    currentRegion.update({end:pos})
    console.log('set end @ ' + pos);
}

function handleGotoStart() {
    if (!WS || !WS.Regions || !currentRegion) {
        return;
    }

    var goto = currentRegion.start;
    WS.play(goto);
    setPlayButtonStatus('pause');
}

function handleGotoEnd() {
    if (!WS || !WS.Regions || !currentRegion) {
        return;
    }

    var goto = currentRegion.end;
    WS.play(goto);
    setPlayButtonStatus('pause');
}

function handleLoop() {
    if (!WS || !WS.Regions || !currentRegion) {
        return;
    }

    var isLoop = getRegionIsLoop();
    var goto = currentRegion.start;

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

    currentRegion.update({loop: isLoop})

    if (isLoop) {
        WS.play(goto);
        setPlayButtonStatus('pause');
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

/* View rendering */
function updateRegionAnnotation(r, text) {
    $(r.element).prepend(text);
}

function renderRegionList() {
    if (WS.Regions.length < 1) {
        $('#region-list').html('No regions.');
        return;
    }

    var template = '{{#items}} <div class="list-item" onclick="handleSetCurrentRegion({{id}})"> <div class="list-item-group"> <div class="list-item-index">{{id}}</div> </div> <div class="list-item-group"> <div class="list-item-text">{{data.title}}</div> </div> <div class="list-item-group"> <div class="list-item-controls"> <button class="btn btn-default btn-sm" type="button" onclick="handleDeleteRegion({{id}})">Delete</button> </div> </div> </div> {{/items}}'
    var view = {items: WS.Regions};
    Mustache.parse(template);
    var rendered = Mustache.render(template, view);
    $('#region-list').html(rendered);
}

function renderRegionLabel() {
    if (currentRegion != null) {
        $('#selected-region-label').html(currentRegion.id + ' - ' + currentRegion.data.title);
    } else {
        $('#selected-region-label').html('No region selected');
    }
}
