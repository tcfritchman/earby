var keyEvent = function(event) {
    var key = event.keyCode || event.which;
    var keychar = String.fromCharCode(key);
    var isShift = event.shiftKey;

    switch (key) {
        case 32: /* Spacebar */
            handlePlayToggle();
            break;
        case 13: /* Enter */
            handleNewRegion();
            break;
        case 38: /* ArrowUp */
            if (isShift){
                handleSetEnd();
            } else {
                handleGotoEnd();
            }
            break;
        case 40: /* ArrowDown */
            if (isShift){
                handleSetStart();
            } else {
                handleGotoStart();
            }
            break;
        case 37: /* ArrowLeft */
            handlePrevRegion();
            break;
        case 39: /* ArrowRight */
            handleNextRegion();
            break;
        case 188: /* Comma */
            handlePrev();
            break;
        case 190: /* Period */
            handleNext();
            break;
    }
}
