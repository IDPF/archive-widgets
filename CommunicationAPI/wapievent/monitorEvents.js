(function () {

    var eventMonitor_ = {};

    var dispatch = true;

    var eventCounters_ = {
        "click": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["click"].count += 1;
                eventCounters_["click"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new MouseEvent("click", msg));
                }
            }
        },
        "dblclick": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["dblclick"].count += 1;
                eventCounters_["dblclick"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new MouseEvent("dblclick", msg));
                }
            }
        },
        "mousedown": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["mousedown"].count += 1;
                eventCounters_["mousedown"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new MouseEvent("mousedown", msg));
                }
            }
        },
        "mouseup": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["mouseup"].count += 1;
                eventCounters_["mouseup"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new MouseEvent("mouseup", msg));
                }
            }
        },
        "mouseover": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["mouseover"].count += 1;
                eventCounters_["mouseover"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new MouseEvent("mouseover", msg));
                }
            }
        },
        "mousemove": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["mousemove"].count += 1;
                eventCounters_["mousemove"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new MouseEvent("mousemove", msg));
                }
            }
        },
        "mouseout": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["mouseout"].count += 1;
                eventCounters_["mouseout"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new MouseEvent("mousedown", msg));
                }
            }
        },
        "keydown": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["keydown"].count += 1;
                eventCounters_["keydown"].updated = false;
                var keyboardEvent = new KeyboardEvent("keydown", msg);
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(keyboardEvent);
                }
            }
        },
        "keypress": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["keypress"].count += 1;
                eventCounters_["keypress"].updated = false;
                var keyboardEvent = new KeyboardEvent("keypress", msg);
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(keyboardEvent);
                }
            }
        },
        "keyup": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["keyup"].count += 1;
                eventCounters_["keyup"].updated = false;
                var keyboardEvent = new KeyboardEvent("keyup", msg);
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(keyboardEvent);
                }

            }
        },
        "resize": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["resize"].count += 1;
                eventCounters_["resize"].updated = false;
            }
        },
        "scroll": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["scroll"].count += 1;
                eventCounters_["scroll"].updated = false;
            }
        },
        "focus": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["focus"].count += 1;
                eventCounters_["focus"].updated = false;
            }
        },

        "blur": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["blur"].count += 1;
                eventCounters_["blur"].updated = false;
            }
        },
        "focusin": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["focusin"].count += 1;
                eventCounters_["focusin"].updated = false;
            }
        },
        "focusout": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["focusout"].count += 1;
                eventCounters_["focusout"].updated = false;
            }
        },
        "DOMActivate": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["DOMActivate"].count += 1;
                eventCounters_["DOMActivate"].updated = false;
            }
        },
        "touchstart": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["touchstart"].count += 1;
                eventCounters_["touchstart"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new CustomEvent("touchstart", msg));
                }

            }
        },
        "touchend": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["touchend"].count += 1;
                eventCounters_["touchend"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new CustomEvent("touchend", msg));
                }

            }
        },
        "touchmove": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["touchmove"].count += 1;
                eventCounters_["touchmove"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new CustomEvent("touchmove", msg));
                }

            }
        },
        "touchenter": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["touchenter"].count += 1;
                eventCounters_["touchenter"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new CustomEvent("touchenter", msg));
                }
            }
        },
        "touchleave": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["touchleave"].count += 1;
                eventCounters_["touchleave"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new CustomEvent("touchleave", msg));
                }

            }
        },
        "touchcancel": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["touchcancel"].count += 1;
                eventCounters_["touchcancel"].updated = false;
                if (dispatch && !msg.defaultPrevented)
                {
                    window.dispatchEvent(new CustomEvent("touchcancel", msg));
                }
            }
        },
        "pointerdown": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["pointerdown"].count += 1;
                eventCounters_["pointerdown"].updated = false;
            }
        },
        "pointerup": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["pointerup"].count += 1;
                eventCounters_["pointerup"].updated = false;
            }
        },
        "pointercancel": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["pointercancel"].count += 1;
                eventCounters_["pointercancel"].updated = false;
            }
        },
        "pointermove": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["pointermove"].count += 1;
                eventCounters_["pointermove"].updated = false;
            }
        },
        "pointerover": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["pointerover"].count += 1;
                eventCounters_["pointerover"].updated = false;
            }
        },
        "pointerout": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["pointerout"].count += 1;
                eventCounters_["pointerout"].updated = false;
            }
        },
        "pointerenter": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["pointerenter"].count += 1;
                eventCounters_["pointerenter"].updated = false;
            }
        },
        "pointerleave": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["pointerleave"].count += 1;
                eventCounters_["pointerleave"].updated = false;
            }
        },
        "gotpointercapture": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["gotpointercapture"].count += 1;
                eventCounters_["gotpointercapture"].updated = false;
            }
        },
        "lostpointercapture": {
            count: 0,
            updated: true,
            handler: function (msg) {
                if (print_eventinfo)
                {
                    printEventInfo(msg);
                }
                eventCounters_["lostpointercapture"].count += 1;
                eventCounters_["lostpointercapture"].updated = false;
            }
        }
    };

    function subscribe(e) {
        for (var key in e)
        {
            if (e.hasOwnProperty(key))
            {
                wapi.subscribe(key, e[key].handler);
            }
        }
    }

    function unsubscribe(e) {
        for (var key in e)
        {
            if (e.hasOwnProperty(key))
            {
                wapi.unsubscribe(key, e[key].handler);
            }
        }
    }


    var interval = null;
    var interval2 = null;

    window.eventMonitor = {};

    eventMonitor.eventCounters = eventCounters_;

    eventMonitor.startCounters = function () {
        // updates counters
        interval = window.setInterval(function () {
            for (var key in eventCounters_)
            {
                if (eventCounters_.hasOwnProperty(key) && eventCounters_[key].updated === false)
                {
                    var e = document.getElementById(key);
                    e.innerHTML = "<span style='color:red;font-weight:bold;'>" + eventCounters_[key].count + "</span>";
                    eventCounters_[key].updated = true;
                }
            }
        }, 50);


        // clears red color from recently updated counters
        interval2 = window.setInterval(function () {
            for (var key in eventCounters_)
            {
                if (eventCounters_.hasOwnProperty(key))
                {
                    var e = document.getElementById(key);
                    e.innerHTML = "<span style='font-weight:bold;'>" + eventCounters_[key].count + "</span>";
                }
            }
        }, 500);
    }

    eventMonitor.stopCounters = function () {
        if (interval)
        {
            window.clearInterval(interval);
            interval = null;
        }

        if (interval2)
        {
            window.clearInterval(interval2);
            interval2 = null;
        }
    }

    eventMonitor.startCounters();

    eventMonitor.getEventCount = function () {
        var count = 0;
        for (var key in eventCounters_)
        {
            if (eventCounters_.hasOwnProperty(key))
            {
                count += eventCounters_[key].count;
            }
        }
        return count;
    };

    eventMonitor.toggleDispatching = function () {
        dispatch = !dispatch;
    };

})();