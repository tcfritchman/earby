/* regions.js - Manages regions in earby
 * Author: Thomas Fritchman
 */

var currentRegion = null;
var regionsAdded = 0;


/* Region helpers */
function setCurrentRegion (id) {
    if (!WS || !WS.regions) {
        return;
    }
    if (getRegionIsLoop()) {
        console.log('cant set region, looping is active');
        return;
    }
    if (WS.regions.list[id]) {
        currentRegion = WS.regions.list[id];
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
    if (!WS || !WS.regions) {
        return;
    }
    return WS.regions.list[id] || null;
}

function getRegionIsLoop() {
    if (!WS || !WS.regions) {
        return null;
    }
    for (var key in WS.regions.list) {
        if (WS.regions.list.hasOwnProperty(key)) {
            if (WS.regions.list[key].loop) {
                return (WS.regions.list[key]);
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
    if (!WS) {
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
            title: 'Region' + regionsAdded /* Default title */
        },
        color: null
    }

    var r = WS.addRegion(options);
    setCurrentRegion(r.id);     /* Set current as new region */

    $(r.element).prepend('<div class="region-annotation">' + r.data.title + '</div>');

    renderRegionList();
    renderRegionLabel();
    $('#set-btn-1').prop('disabled', false);
    $('#set-btn-2').prop('disabled', false);
    $('#goto-btn-1').prop('disabled', false);
    $('#goto-btn-2').prop('disabled', false);
    $('#loop-btn-1-2').prop('disabled', false);
}

function handleDeleteRegion(id) {
    if (!WS || !WS.regions) {
        return;
    }

    if (getRegionIsLoop()) {
        console.log('cant delete region, looping is active');
        return;
    }

    if (_.size(WS.regions.list) == 1) {
        handleNoRegions();
    }

    var toDelete = getRegionWithId(id);

    if (toDelete) {
        if (toDelete == currentRegion) {
            clearCurrentRegion();
        }
        toDelete.remove();
        console.log('region ' + id + ' deleted');
    }

    renderRegionList();
    renderRegionLabel();
}

function handleSetCurrentRegion(id) {
    if (!WS || !WS.regions) {
        return;
    }

    setCurrentRegion(id);
    renderRegionLabel();
}

function handleSetStart() {
    if (!WS || !WS.regions || !currentRegion) {
        return;
    }

    var pos = WS.getCurrentTime();
    currentRegion.update({start:pos});
    renderRegionList();
    console.log('set start @ ' + pos);
}

function handleSetEnd() {
    if (!WS || !WS.regions || !currentRegion) {
        return;
    }

    var pos = WS.getCurrentTime();
    currentRegion.update({end:pos})
    renderRegionList();
    console.log('set end @ ' + pos);
}

function handleGotoStart() {
    if (!WS || !WS.regions || !currentRegion) {
        return;
    }

    var goto = currentRegion.start;
    WS.play(goto);
    setPlayButtonStatus('pause');
}

function handleGotoEnd() {
    if (!WS || !WS.regions || !currentRegion) {
        return;
    }

    var goto = currentRegion.end;
    WS.play(goto);
    setPlayButtonStatus('pause');
}

function handleLoop() {
    if (!WS || !WS.regions || !currentRegion) {
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
        renderRegionLabel();
    }
}

function handleRegionUpdate() {
    return function (region) {
        renderRegionList();
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
    $(r.element).find('.region-annotation').text(text);
}

function renderRegionList() {
    if (!WS || !WS.regions || _.size(WS.regions.list) < 1) {
        $('#region-list').html('No regions.');
        return;
    }

    var template = '{{#items}} <div class="list-item" onclick="handleSetCurrentRegion({{id}})"> <div class="list-item-group"> <div class="list-item-index">{{id}}</div> </div> <div class="list-item-group"> <div class="list-item-text">{{title}}</div> </div> <div class="list-item-group"> <div class="list-item-controls"> <button class="btn btn-default btn-sm" type="button" onclick="handleDeleteRegion({{id}})">Delete</button> </div> </div> </div> {{/items}}'

    var items = [];
    for (var item in WS.regions.list) {
        if (WS.regions.list.hasOwnProperty(item)) {
            items.push({id: WS.regions.list[item].id,
                        title: WS.regions.list[item].data.title,
                        start: WS.regions.list[item].start});
        }
    }

    items = _.sortBy(items, 'start');

    var view = {'items': items};
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
