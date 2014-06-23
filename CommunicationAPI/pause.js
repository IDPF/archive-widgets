/**
 * Sample code.
 */

wapi.subscribe(window.parent, "pause", function (msg) {
    handlePause(msg);
});
