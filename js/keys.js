var keyEvent = function(event) {
    var key = event.keyCode || event.which;
    var keychar = String.fromCharCode(key);
    var isShift = event.shiftKey;

    switch (key) {
        case 32: /* Spacebar */
            console.log('spacebar pressed!');
            handlePlayToggle();
            break;
    }
}
